import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get('category') || '전체';
  const sort = req.nextUrl.searchParams.get('sort') || 'recent';
  
  let query = supabase
    .from('community_posts')
    .select('*')
    .limit(50);
    
  if (sort === 'popular') {
    query = query.order('likes', { ascending: false }).order('created_at', { ascending: false });
  } else {
    query = query.order('created_at', { ascending: false });
  }
  
  if (category !== '전체') {
    query = query.eq('category', category);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ posts: data });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { nickname, category, title, content } = body;

  if (!nickname?.trim() || !title?.trim() || !content?.trim()) {
    return NextResponse.json({ error: '모든 필드를 입력해주세요.' }, { status: 400 });
  }
  if (content.length > 1000) {
    return NextResponse.json({ error: '내용은 1000자 이내로 작성해주세요.' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('community_posts')
    .insert({ nickname: nickname.trim(), category, title: title.trim(), content: content.trim() })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ post: data });
}
