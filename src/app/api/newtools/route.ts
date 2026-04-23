import { NextResponse } from 'next/server';
import { fetchNewTools } from '@/lib/newtools';

export const revalidate = 3600;

export async function GET() {
  try {
    const tools = await fetchNewTools(12);
    return NextResponse.json({ 
      tools,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to fetch new tools:', error);
    return NextResponse.json({ tools: [], error: 'Failed to fetch' }, { status: 500 });
  }
}
