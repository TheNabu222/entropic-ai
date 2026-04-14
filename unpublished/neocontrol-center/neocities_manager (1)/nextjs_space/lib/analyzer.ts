// Site analysis utilities for orphan/stub detection

export interface AnalyzedPage {
  path: string;
  filename: string;
  directory: string;
  extension: string;
  fileType: string;
  size: number;
  isOrphan: boolean;
  isStub: boolean;
  title?: string;
  wordCount: number;
  inboundLinks: number;
  outboundLinks: string[];
  category: string;
}

export interface SiteAnalysis {
  totalFiles: number;
  htmlPages: number;
  orphanCount: number;
  stubCount: number;
  directories: string[];
  pages: AnalyzedPage[];
  linkMap: Map<string, string[]>;
}

// Parse HTML to extract links
export function extractLinks(html: string, basePath: string): string[] {
  const links: string[] = [];
  const linkRegex = /href=["']([^"']+)["']/gi;
  let match;
  
  while ((match = linkRegex.exec(html ?? '')) !== null) {
    let href = match[1];
    
    // Skip external links, anchors, and special protocols
    if (href?.startsWith('http') || 
        href?.startsWith('//') || 
        href?.startsWith('#') || 
        href?.startsWith('mailto:') ||
        href?.startsWith('javascript:')) {
      continue;
    }
    
    // Resolve relative paths
    if (href?.startsWith('/')) {
      links.push(href);
    } else if (href) {
      const dir = basePath?.substring(0, basePath?.lastIndexOf('/') + 1) ?? '/';
      links.push(dir + href);
    }
  }
  
  return [...new Set(links)];
}

// Extract title from HTML
export function extractTitle(html: string): string | undefined {
  const titleMatch = html?.match(/<title[^>]*>([^<]*)<\/title>/i);
  return titleMatch?.[1]?.trim();
}

// Count words in HTML (excluding tags)
export function countWords(html: string): number {
  const text = html
    ?.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    ?.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    ?.replace(/<[^>]+>/g, ' ')
    ?.replace(/\s+/g, ' ')
    ?.trim() ?? '';
  
  return text?.split(/\s+/)?.filter(w => w?.length > 0)?.length ?? 0;
}

// Determine file category based on path
export function getCategory(path: string): string {
  const parts = path?.split('/')?.filter(p => p) ?? [];
  return parts[0] ?? 'root';
}

// Check if a file is likely a stub/WIP
export function isLikelyStub(path: string, wordCount: number, stubThreshold: number = 200): boolean {
  const lowerPath = path?.toLowerCase() ?? '';
  
  // Check for stub indicators in filename
  const stubIndicators = ['copy', 'backup', 'test', 'old_', 'temp', 'wip', '_backup', '-copy', '.bak'];
  const hasStubIndicator = stubIndicators.some(ind => lowerPath?.includes(ind));
  
  // Check word count threshold
  const isMinimalContent = wordCount < stubThreshold;
  
  return hasStubIndicator || isMinimalContent;
}

// Analyze site structure and build link graph
export function analyzeSiteStructure(
  files: Array<{ path: string; content?: string; size: number }>,
  stubThreshold: number = 200
): SiteAnalysis {
  const pages: AnalyzedPage[] = [];
  const linkMap = new Map<string, string[]>();
  const inboundCounts = new Map<string, number>();
  const directories = new Set<string>();
  
  // First pass: analyze each file
  for (const file of (files ?? [])) {
    const path = file?.path ?? '';
    const parts = path?.split('/') ?? [];
    const filename = parts[parts?.length - 1] ?? '';
    const extension = filename?.includes('.') ? filename?.split('.')?.pop() ?? '' : '';
    const directory = '/' + (parts?.slice(0, -1)?.join('/') ?? '');
    
    directories.add(directory);
    
    const fileType = getFileType(extension);
    const content = file?.content ?? '';
    const wordCount = fileType === 'html' ? countWords(content) : 0;
    const outboundLinks = fileType === 'html' ? extractLinks(content, path) : [];
    
    // Track outbound links for inbound counting
    linkMap.set(path, outboundLinks);
    for (const link of (outboundLinks ?? [])) {
      inboundCounts.set(link, (inboundCounts.get(link) ?? 0) + 1);
    }
    
    pages.push({
      path,
      filename,
      directory,
      extension,
      fileType,
      size: file?.size ?? 0,
      isOrphan: false, // Will be set in second pass
      isStub: isLikelyStub(path, wordCount, stubThreshold),
      title: fileType === 'html' ? extractTitle(content) : undefined,
      wordCount,
      inboundLinks: 0, // Will be set in second pass
      outboundLinks,
      category: getCategory(path),
    });
  }
  
  // Second pass: set inbound links and detect orphans
  const mainFiles = ['/index.html', '/nav.html'];
  
  for (const page of (pages ?? [])) {
    page.inboundLinks = inboundCounts.get(page?.path) ?? 0;
    
    // Orphan detection: no inbound links and not a main file
    const isMainFile = mainFiles.includes(page?.path ?? '');
    page.isOrphan = !isMainFile && page.inboundLinks === 0 && page.fileType === 'html';
  }
  
  return {
    totalFiles: files?.length ?? 0,
    htmlPages: pages?.filter(p => p?.fileType === 'html')?.length ?? 0,
    orphanCount: pages?.filter(p => p?.isOrphan)?.length ?? 0,
    stubCount: pages?.filter(p => p?.isStub)?.length ?? 0,
    directories: [...directories],
    pages,
    linkMap,
  };
}

function getFileType(extension: string): string {
  const ext = extension?.toLowerCase() ?? '';
  if (ext === 'html' || ext === 'htm') return 'html';
  if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'ico'].includes(ext)) return 'image';
  if (['js', 'ts', 'jsx', 'tsx'].includes(ext)) return 'javascript';
  if (ext === 'css') return 'css';
  if (['json', 'xml', 'txt', 'md'].includes(ext)) return 'data';
  return 'other';
}
