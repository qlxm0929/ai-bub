-- Supabase SQL Editor에서 실행하세요
create table if not exists community_posts (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz default now(),
  nickname    text not null,
  category    text not null,
  title       text not null,
  content     text not null,
  likes       int default 0
);

-- 익명 읽기/쓰기 허용
alter table community_posts enable row level security;
create policy "Anyone can read" on community_posts for select using (true);
create policy "Anyone can insert" on community_posts for insert with check (true);
create policy "Anyone can update likes" on community_posts for update using (true);

-- ── 피드백 테이블 ─────────────────────────────────────────
create table if not exists feedback (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz default now(),
  type        text not null,
  content     text not null
);

alter table feedback enable row level security;
create policy "Anyone can insert feedback" on feedback for insert with check (true);
-- 읽기는 운영자만 (Supabase Dashboard에서 직접 확인)
