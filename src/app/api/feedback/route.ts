import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { type, content } = await req.json();

    if (!content?.trim()) {
      return NextResponse.json({ error: 'content required' }, { status: 400 });
    }

    const { error } = await supabase.from('feedback').insert({
      type: type || '기타',
      content: content.trim().slice(0, 2000),
    });

    if (error) {
      console.error('[feedback] supabase error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[feedback] unexpected error:', e);
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
}
