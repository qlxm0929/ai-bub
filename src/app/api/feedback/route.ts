import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// 런타임에만 초기화 — 빌드 시 env 미존재 에러 방지
function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export async function POST(req: Request) {
  try {
    const { type, content } = await req.json();

    if (!content?.trim()) {
      return NextResponse.json({ error: 'content required' }, { status: 400 });
    }

    const adminSupabase = getAdminClient();
    const { error } = await adminSupabase.from('feedback').insert({
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
