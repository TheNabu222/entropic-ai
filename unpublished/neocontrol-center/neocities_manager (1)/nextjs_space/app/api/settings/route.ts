export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    let settings = await prisma.appSettings.findUnique({ where: { id: 'default' } });
    
    if (!settings) {
      settings = await prisma.appSettings.create({
        data: { id: 'default' }
      });
    }
    
    return NextResponse.json({ success: true, settings: settings ?? {} });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error:', message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const settings = await prisma.appSettings.upsert({
      where: { id: 'default' },
      update: body ?? {},
      create: { id: 'default', ...(body ?? {}) }
    });
    
    return NextResponse.json({ success: true, settings: settings ?? {} });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error:', message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
