export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const totalPages = await prisma.sitePage.count();
    const orphanCount = await prisma.sitePage.count({ where: { isOrphan: true } });
    const stubCount = await prisma.sitePage.count({ where: { isStub: true } });
    
    const categories = await prisma.sitePage.groupBy({
      by: ['category'],
      _count: { id: true }
    });
    
    const settings = await prisma.appSettings.findUnique({ where: { id: 'default' } });
    
    return NextResponse.json({
      success: true,
      stats: {
        totalPages,
        orphanCount,
        stubCount,
        categories: categories?.map(c => ({ 
          name: c?.category ?? 'unknown', 
          count: c?._count?.id ?? 0 
        })) ?? [],
        lastScan: settings?.lastFullScan
      }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error:', message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
