export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { getNeocitiesClientFromDb, NeocitiesClient } from '@/lib/neocities';
import { extractLinks, extractTitle, countWords, getCategory, isLikelyStub } from '@/lib/analyzer';
import { prisma } from '@/lib/db';

const SITE_DOMAIN = process.env.SITE_DOMAIN ?? 'coaiexist.wtf';

interface FileWithContent {
  path: string;
  content: string;
  size: number;
}

export async function POST() {
  try {
    const client = await getNeocitiesClientFromDb();
    
    // Get all files
    const allFiles = await getAllFiles(client);
    
    // Fetch content for HTML files
    const htmlFiles = (allFiles ?? []).filter((f: { path: string; is_directory: boolean }) => 
      !f?.is_directory && (f?.path?.endsWith('.html') || f?.path?.endsWith('.htm'))
    );
    
    const filesWithContent: FileWithContent[] = [];
    const linkSources: Map<string, string[]> = new Map();
    
    // Fetch content for each HTML file (with rate limiting)
    for (const file of (htmlFiles ?? [])) {
      try {
        const url = `https://${SITE_DOMAIN}${file?.path?.startsWith('/') ? file.path : '/' + file.path}`;
        const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
        
        if (response.ok) {
          const content = await response.text();
          filesWithContent.push({
            path: file?.path?.startsWith('/') ? file.path : '/' + file.path,
            content,
            size: file?.size ?? content?.length ?? 0
          });
          
          // Extract links for inbound counting
          const links = extractLinks(content, file?.path ?? '');
          linkSources.set(file?.path ?? '', links);
        }
      } catch (e) {
        console.error(`Failed to fetch ${file?.path}:`, e);
      }
      
      // Rate limiting
      await new Promise(r => setTimeout(r, 100));
    }
    
    // Build inbound link counts
    const inboundCounts: Map<string, number> = new Map();
    for (const [source, links] of linkSources) {
      for (const link of (links ?? [])) {
        const normalizedLink = link?.startsWith('/') ? link : '/' + link;
        inboundCounts.set(normalizedLink, (inboundCounts.get(normalizedLink) ?? 0) + 1);
      }
    }
    
    // Get settings
    let settings = await prisma.appSettings.findUnique({ where: { id: 'default' } });
    if (!settings) {
      settings = await prisma.appSettings.create({
        data: { id: 'default' }
      });
    }
    
    // Analyze and save to database
    const pages = [];
    const mainFiles = ['/index.html', '/nav.html'];
    
    for (const file of (filesWithContent ?? [])) {
      const path = file?.path ?? '';
      const parts = path?.split('/')?.filter(p => p) ?? [];
      const filename = parts[parts?.length - 1] ?? '';
      const extension = filename?.includes('.') ? filename?.split('.')?.pop() ?? '' : '';
      const directory = '/' + (parts?.slice(0, -1)?.join('/') ?? '');
      
      const content = file?.content ?? '';
      const wordCount = countWords(content);
      const outboundLinks = extractLinks(content, path);
      const inboundLinks = inboundCounts.get(path) ?? 0;
      const isOrphan = !mainFiles.includes(path) && inboundLinks === 0;
      const isStub = isLikelyStub(path, wordCount, settings?.stubWordThreshold ?? 200);
      
      const pageData = {
        path,
        filename,
        directory,
        extension,
        fileType: 'html',
        size: file?.size ?? 0,
        isOrphan,
        isStub,
        wordCount,
        title: extractTitle(content),
        category: getCategory(path),
        inboundLinks,
        outboundLinks,
        lastScanned: new Date()
      };
      
      // Upsert to database
      await prisma.sitePage.upsert({
        where: { path },
        update: pageData,
        create: pageData
      });
      
      pages.push(pageData);
    }
    
    // Update last scan time
    await prisma.appSettings.update({
      where: { id: 'default' },
      data: { lastFullScan: new Date() }
    });
    
    // Get stats
    const directories = [...new Set(pages?.map(p => p?.directory) ?? [])];
    
    return NextResponse.json({
      success: true,
      stats: {
        totalFiles: allFiles?.length ?? 0,
        htmlPages: pages?.length ?? 0,
        orphanCount: pages?.filter(p => p?.isOrphan)?.length ?? 0,
        stubCount: pages?.filter(p => p?.isStub)?.length ?? 0,
        directories: directories?.length ?? 0
      },
      pages
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Analysis error:', message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

async function getAllFiles(client: NeocitiesClient, path: string = ''): Promise<Array<{ path: string; is_directory: boolean; size?: number }>> {
  let files;
  try {
    files = await client.list(path || undefined);
  } catch (error) {
    const msg = error instanceof Error ? error.message : '';
    if (msg.includes('NEOCITIES_SERVER_ERROR')) {
      console.warn(`[getAllFiles] Skipping path due to Neocities server error: ${path}`);
      return []; // Skip this directory but continue
    }
    throw error;
  }
  
  const allFiles: Array<{ path: string; is_directory: boolean; size?: number }> = [];

  for (const file of (files ?? [])) {
    allFiles.push(file);
    
    if (file?.is_directory) {
      await new Promise(r => setTimeout(r, 50)); // Rate limiting
      const subFiles = await getAllFiles(client, file.path);
      allFiles.push(...(subFiles ?? []));
    }
  }

  return allFiles;
}
