import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// service role key 사용 — 서버 전용 (클라이언트에 노출 금지)
const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

let tableReady = false;

async function ensureTable() {
  if (tableReady) return;
  // feedback 테이블이 없으면 자동 생성
  await adminSupabase.rpc('exec_ddl', {
    ddl: `
      CREATE TABLE IF NOT EXISTS feedback (
        id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        created_at timestamptz DEFAULT now(),
        type       text NOT NULL,
        content    text NOT NULL
      );
      ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
      DO $pol$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies
          WHERE tablename = 'feedback'
          AND policyname = 'Anyone can insert feedback'
        ) THEN
          EXECUTE 'CREATE POLICY "Anyone can insert feedback" ON feedback FOR INSERT WITH CHECK (true)';
        END IF;
      END
      $pol$;
    `,
  }).catch(() => null); // exec_ddl RPC가 없으면 조용히 무시
  tableReady = true;
}

export async function POST(req: Request) {
  try {
    const { type, content } = await req.json();

    if (!content?.trim()) {
      return NextResponse.json({ error: 'content required' }, { status: 400 });
    }

    await ensureTable();

    const { error } = await adminSupabase.from('feedback').insert({
      type: type || '기타',
      content: content.trim().slice(0, 2000),
    });

    if (error) {
      console.error('[feedback] supabase error:', error.message);
      // 테이블 미존재 오류면 안내 메시지 반환
      if (error.code === '42P01') {
        return NextResponse.json(
          { error: 'feedback 테이블이 아직 준비되지 않았습니다. Supabase Dashboard에서 SQL을 실행해주세요.' },
          { status: 503 }
        );
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[feedback] unexpected error:', e);
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
}
