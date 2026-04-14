export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';

const SITE_DOMAIN = process.env.SITE_DOMAIN ?? 'coaiexist.wtf';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path');
    
    if (!path) {
      return NextResponse.json({ success: false, error: 'Path required' }, { status: 400 });
    }

    // Fetch the actual content from the site
    const url = `https://${SITE_DOMAIN}${path}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      return NextResponse.json({ success: false, error: 'Failed to fetch content' }, { status: response.status });
    }

    const content = await response.text();
    
    return NextResponse.json({ 
      success: true, 
      content,
      path,
      url
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error fetching content:', message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
