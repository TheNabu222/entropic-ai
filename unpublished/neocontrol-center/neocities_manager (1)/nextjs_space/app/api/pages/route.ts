export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter');
    const category = searchParams.get('category');
    
    let where: Record<string, boolean | string> = {};
    
    if (filter === 'orphans') {
      where.isOrphan = true;
    } else if (filter === 'stubs') {
      where.isStub = true;
    }
    
    if (category) {
      where.category = category;
    }
    
    const pages = await prisma.sitePage.findMany({
      where,
      orderBy: { path: 'asc' }
    });
    
    return NextResponse.json({ success: true, pages: pages ?? [] });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error:', message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
