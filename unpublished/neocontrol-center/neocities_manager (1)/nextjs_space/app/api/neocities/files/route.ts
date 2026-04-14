export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { getNeocitiesClientFromDb, NeocitiesFile, NeocitiesClient } from '@/lib/neocities';

// Build full file tree recursively - handles Neocities server errors gracefully
async function buildFileTree(client: NeocitiesClient, path: string = ''): Promise<NeocitiesFile[]> {
  let files: NeocitiesFile[];
  try {
    files = await client.list(path || undefined);
  } catch (error) {
    const msg = error instanceof Error ? error.message : '';
    if (msg.includes('NEOCITIES_SERVER_ERROR')) {
      console.warn(`[buildFileTree] Skipping path due to Neocities server error: ${path}`);
      return []; // Skip this directory but continue
    }
    throw error; // Re-throw other errors
  }
  
  const allFiles: NeocitiesFile[] = [];

  for (const file of (files ?? [])) {
    allFiles.push(file);
    
    if (file?.is_directory) {
      // Add small delay to avoid rate limiting
      await new Promise(r => setTimeout(r, 50));
      const subFiles = await buildFileTree(client, file.path);
      allFiles.push(...(subFiles ?? []));
    }
  }

  return allFiles;
}

export async function GET() {
  try {
    const client = await getNeocitiesClientFromDb();
    const files = await buildFileTree(client);
    
    return NextResponse.json({ 
      success: true, 
      files: files ?? [],
      count: files?.length ?? 0 
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[FILES API] Error:', message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, path, content, filenames } = body ?? {};
    const client = await getNeocitiesClientFromDb();

    if (action === 'upload') {
      if (!path || !content) {
        return NextResponse.json({ success: false, error: 'Path and content required' }, { status: 400 });
      }
      
      const result = await client.upload([{ path, content }]);
      return NextResponse.json({ success: true, result });
    }

    if (action === 'delete') {
      if (!filenames || !Array.isArray(filenames)) {
        return NextResponse.json({ success: false, error: 'Filenames array required' }, { status: 400 });
      }
      
      const result = await client.delete(filenames);
      return NextResponse.json({ success: true, result });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in POST:', message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
