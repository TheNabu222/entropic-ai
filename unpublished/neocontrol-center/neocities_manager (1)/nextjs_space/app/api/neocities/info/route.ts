export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { getNeocitiesClientFromDb } from '@/lib/neocities';

export async function GET() {
  try {
    const client = await getNeocitiesClientFromDb();
    const info = await client.info();
    
    return NextResponse.json({ 
      success: true, 
      info: info ?? {} 
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[INFO API] Error:', message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
