import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

  const { data: post } = await supabase
    .from('community_posts')
    .select('likes')
    .eq('id', id)
    .single();

  if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

  const { data, error } = await supabase
    .from('community_posts')
    .update({ likes: post.likes + 1 })
    .eq('id', id)
    .select('likes')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ likes: data.likes });
}
