'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bookmark, ExternalLink, Search, SlidersHorizontal } from 'lucide-react';
import { z } from 'zod';
import { curatedOn, platforms, socialPosts, socialSearchUrl, topics, type Platform, type Topic } from '@/lib/social/catalog';
import { SocialCard } from './SocialCard';

const storageKey = 'aiel-social-saved-v1';
const savedSchema = z.array(z.string()).max(200);
function loadSaved(): { ids: string[]; error: string | null } {
  try {
    const parsed = savedSchema.safeParse(JSON.parse(localStorage.getItem(storageKey) ?? '[]'));
    return parsed.success ? { ids: parsed.data.filter((id) => socialPosts.some((p) => p.id === id)), error: null }
      : { ids: [], error: '저장 목록을 읽지 못했습니다. 다시 저장해주세요.' };
  } catch (error) {
    console.warn('Social saved items unavailable', error instanceof Error ? error.name : 'UnknownError');
    return { ids: [], error: '이 브라우저의 저장 공간에 접근하지 못했습니다.' };
  }
}
const filterClass = (active: boolean) => `min-h-11 rounded-lg px-4 py-2 text-sm focus-visible:outline-2 focus-visible:outline-purple-300 ${active ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`;

export function SocialFeed() {
  const [platform, setPlatform] = useState<Platform | 'all'>('all');
  const [topic, setTopic] = useState<Topic | 'all'>('all');
  const [query, setQuery] = useState('');
  const [savedOnly, setSavedOnly] = useState(false);
  const [saved, setSaved] = useState(loadSaved);
  const visible = socialPosts.filter((post) =>
    (platform === 'all' || post.platform === platform) && (topic === 'all' || post.topics.includes(topic)) &&
    (!savedOnly || saved.ids.includes(post.id)) &&
    [post.title, post.summary, post.author, ...post.topics.map((t) => topics[t])].join(' ').toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
  function toggleSaved(id: string) {
    const ids = saved.ids.includes(id) ? saved.ids.filter((value) => value !== id) : [...saved.ids, id];
    try { localStorage.setItem(storageKey, JSON.stringify(ids)); setSaved({ ids, error: null }); }
    catch (error) {
      console.warn('Social bookmark failed', error instanceof Error ? error.name : 'UnknownError');
      setSaved({ ...saved, error: '저장하지 못했습니다. 브라우저 저장 공간 설정을 확인해주세요.' });
    }
  }
  function resetFilters() { setPlatform('all'); setTopic('all'); setQuery(''); setSavedOnly(false); }
  return <section aria-labelledby="social-title" className="space-y-6">
    <header className="space-y-3">
      <p className="text-cyan-300 text-sm">Threads · Instagram</p>
      <h1 id="social-title" className="text-2xl sm:text-4xl font-bold text-white">SNS에서 찾은 AI</h1>
      <p className="text-gray-300 leading-relaxed">도구를 발견하고, 활용법을 모아보세요. AI 관련 공개 게시글만 직접 골랐습니다.</p>
      <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-400"><span>선별 자료 · {socialPosts.length}개</span><span>원문 확인 {curatedOn.replaceAll('-', '.')}</span><span>자동 수집 미연결 · 예전 게시글 포함</span></div>
    </header>
    <div className="rounded-2xl border border-purple-400/20 bg-purple-500/5 p-4 sm:p-5 space-y-4">
      <div><h2 className="text-base font-semibold text-white">관심 있는 AI 주제로 더 찾아보기</h2><p className="text-xs leading-relaxed text-gray-400 mt-2">검색어와 분야는 아래 카드에 적용됩니다. 검색 버튼은 Google에서 해당 플랫폼의 공개글을 엽니다.</p></div>
      <div><label htmlFor="social-query" className="block text-sm text-gray-300 mb-2">키워드 검색</label><div className="relative"><Search size={18} className="absolute left-3 top-3.5 text-gray-400" aria-hidden="true" /><input id="social-query" type="search" maxLength={100} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="예: 이미지, 자동화, NotebookLM" className="min-h-11 w-full rounded-lg border border-white/15 bg-black/40 pl-10 pr-4 text-sm text-white focus-visible:outline-2 focus-visible:outline-purple-300" /></div></div>
      <div className="flex flex-wrap gap-2">
        {Object.entries(platforms).map(([key, label]) => {
          const source = key === 'threads' ? 'threads' : 'instagram';
          return <a key={key} href={socialSearchUrl(source, query, topic)} target="_blank" rel="noopener noreferrer" className="min-h-11 inline-flex items-center gap-2 rounded-lg border border-white/15 bg-black/30 px-4 text-sm text-cyan-300 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-cyan-300">{label} 공개글 검색<ExternalLink size={14} aria-hidden="true" /></a>;
        })}
      </div>
    </div>
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="SNS 플랫폼">
        <button type="button" className={filterClass(platform === 'all')} aria-pressed={platform === 'all'} onClick={() => setPlatform('all')}>전체 플랫폼</button>
        {(['threads', 'instagram'] as const).map((value) => <button type="button" key={value} className={filterClass(platform === value)} aria-pressed={platform === value} onClick={() => setPlatform(value)}>{platforms[value]}</button>)}
        <button type="button" className={`${filterClass(savedOnly)} inline-flex items-center gap-2 sm:ml-auto`} aria-pressed={savedOnly} onClick={() => setSavedOnly(!savedOnly)}><Bookmark size={15} aria-hidden="true" />저장한 글 {saved.ids.length}</button>
      </div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="SNS 활용 분야">
        <button type="button" className={filterClass(topic === 'all')} aria-pressed={topic === 'all'} onClick={() => setTopic('all')}>모든 분야</button>
        {(['tools', 'workflow', 'research', 'image', 'offers'] as const).map((value) => <button type="button" key={value} className={filterClass(topic === value)} aria-pressed={topic === value} onClick={() => setTopic(value)}>{topics[value]}</button>)}
      </div>
    </div>
    <div className="flex flex-wrap justify-between items-center gap-2 text-xs text-gray-400"><p role="status">선별 게시글 {visible.length}개{savedOnly ? ' · 저장한 글' : ''}</p><p>저장은 이 브라우저에만 보관됩니다.</p></div>
    {saved.error && <p role="alert" className="text-sm text-amber-200">{saved.error}</p>}
    {visible.length ? <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">{visible.map((post) => <SocialCard key={post.id} post={post} saved={saved.ids.includes(post.id)} onSave={() => toggleSaved(post.id)} />)}</div>
      : <div className="rounded-2xl border border-dashed border-white/15 p-8 text-center space-y-3"><SlidersHorizontal className="mx-auto text-gray-400" aria-hidden="true" /><h2 className="font-semibold text-white">{savedOnly && !saved.ids.length ? '아직 저장한 글이 없습니다' : '조건에 맞는 선별 글이 없습니다'}</h2><p className="text-sm text-gray-400">필터를 바꾸거나 위의 공개글 검색으로 더 찾아보세요.</p><button type="button" onClick={resetFilters} className={filterClass(false)}>필터 초기화</button></div>}
    <aside className="rounded-xl border border-white/10 bg-black/20 p-4 text-xs leading-relaxed text-gray-400">
      <p>SNS 소개 내용은 작성자의 주장입니다. 무료 기간·카드 등록·추가 비용은 공식 페이지에서 다시 확인하세요. 원문을 보려면 플랫폼 로그인이 필요할 수 있습니다.</p>
      <Link href="/news" className="inline-flex min-h-11 items-center text-cyan-300 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-cyan-300">공식 근거가 있는 AI 소식·무료 혜택 보기</Link>
    </aside>
  </section>;
}
