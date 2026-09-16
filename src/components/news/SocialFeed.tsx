'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bookmark, ExternalLink, Search, SlidersHorizontal, RefreshCw } from 'lucide-react';
import { platforms, socialPosts, socialSearchUrl, topics, type Platform, type Topic } from '@/lib/social/catalog';
import { SocialCard } from './SocialCard';
import { useSocial } from './useSocial';

const filterClass = (active: boolean) => `min-h-11 rounded-lg px-4 py-2 text-sm focus-visible:outline-2 focus-visible:outline-purple-300 ${active ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`;

export function SocialFeed() {
  const [platform, setPlatform] = useState<Platform | 'all'>('all');
  const [topic, setTopic] = useState<Topic | 'all'>('all');
  const [query, setQuery] = useState('');
  const [savedOnly, setSavedOnly] = useState(false);
  const { snapshot, saved, error, notice, loading, remaining, refresh, toggleSaved } = useSocial();
  const [origin, setOrigin] = useState<'all' | 'search' | 'curated'>('all');
  const pool = new Map([...saved, ...(snapshot?.posts ?? []), ...socialPosts].map((post) => [post.id, post]));
  const visible = [...pool.values()].sort((a, b) => (b.publishedOn ?? '').localeCompare(a.publishedOn ?? '')).filter((post) =>
    (origin === 'all' || (origin === 'search' ? post.origin === 'search' : !post.origin)) &&
    (platform === 'all' || post.platform === platform) && (topic === 'all' || post.topics.includes(topic)) &&
    (!savedOnly || saved.some((item) => item.id === post.id)) &&
    [post.title, post.summary, post.author, ...post.topics.map((t) => topics[t])].join(' ').toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
  function resetFilters() { setPlatform('all'); setTopic('all'); setQuery(''); setSavedOnly(false); setOrigin('all'); }
  return <section aria-labelledby="social-title" className="space-y-6">
    <header className="space-y-3">
      <p className="text-cyan-300 text-sm">Threads · Instagram</p>
      <h1 id="social-title" className="text-2xl sm:text-4xl font-bold text-white">SNS에서 찾은 AI</h1>
      <p className="text-gray-300 leading-relaxed">도구를 발견하고, 활용법을 모아보세요. 새로고침하면 공개 검색에서 AI 관련 게시글을 찾아옵니다.</p>
      <p className="text-xs text-gray-400 leading-relaxed">최근 한 달 공개 검색 기준 · 색인에 따라 누락·오래된 글이 포함될 수 있습니다. 검색 발췌는 원문 전체 확인과 다릅니다.</p>
    </header>
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5 space-y-3" aria-busy={loading}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-semibold text-white">공개글 자동 수집</h2>
        <button type="button" disabled={loading || remaining > 0} onClick={() => void refresh()} className="min-h-11 inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm text-white hover:bg-purple-500 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-purple-300">
          <RefreshCw size={16} className={loading ? 'animate-spin motion-reduce:animate-none' : ''} aria-hidden="true" />{loading ? '수집 중…' : remaining > 0 ? `${Math.ceil(remaining / 60)}분 후 새로고침` : '새로고침'}
        </button>
      </div>
      <p role="status" className="text-sm leading-relaxed text-gray-300">{loading ? 'Threads·Instagram 공개 검색을 조회하고 있습니다.' : notice || '이전 자료를 표시하고 있습니다.'}</p>
      <div className="grid sm:grid-cols-2 gap-3">{snapshot?.sources.map((source) => <div key={source.platform} className="rounded-xl bg-black/20 p-3 space-y-1 text-xs leading-relaxed">
        <p className={source.status === 'success' ? 'text-emerald-300' : source.status === 'failed' ? 'text-amber-200' : 'text-gray-300'}>{platforms[source.platform]} · {source.status === 'success' ? `${source.count}개` : source.status === 'failed' ? '수집 실패' : '미연결'}</p>
        <p className="text-gray-400">{source.message}</p>
        <p className="text-gray-400">마지막 성공: {source.lastSuccessAt ? new Date(source.lastSuccessAt).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }) : '없음'}</p>
        {source.status !== 'success' && source.lastSuccessAt && <p className="text-amber-200">이전 수집 결과 표시</p>}
      </div>)}</div>
      <p className="text-xs text-gray-400">10분 간격으로 다시 조회합니다. 검색에 없는 비공개·로그인 전용 글은 수집하지 않습니다.</p>
    </div>
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
      <div className="flex flex-wrap gap-2" role="group" aria-label="게시글 확인 방식">
        <button type="button" className={filterClass(origin === 'all')} aria-pressed={origin === 'all'} onClick={() => setOrigin('all')}>모든 글</button>
        <button type="button" className={filterClass(origin === 'search')} aria-pressed={origin === 'search'} onClick={() => setOrigin('search')}>자동 수집</button>
        <button type="button" className={filterClass(origin === 'curated')} aria-pressed={origin === 'curated'} onClick={() => setOrigin('curated')}>선별 글</button>
      </div>
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="SNS 플랫폼">
        <button type="button" className={filterClass(platform === 'all')} aria-pressed={platform === 'all'} onClick={() => setPlatform('all')}>전체 플랫폼</button>
        {(['threads', 'instagram'] as const).map((value) => <button type="button" key={value} className={filterClass(platform === value)} aria-pressed={platform === value} onClick={() => setPlatform(value)}>{platforms[value]}</button>)}
        <button type="button" className={`${filterClass(savedOnly)} inline-flex items-center gap-2 sm:ml-auto`} aria-pressed={savedOnly} onClick={() => setSavedOnly(!savedOnly)}><Bookmark size={15} aria-hidden="true" />저장한 글 {saved.length}</button>
      </div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="SNS 활용 분야">
        <button type="button" className={filterClass(topic === 'all')} aria-pressed={topic === 'all'} onClick={() => setTopic('all')}>모든 분야</button>
        {(['tools', 'workflow', 'research', 'image', 'offers'] as const).map((value) => <button type="button" key={value} className={filterClass(topic === value)} aria-pressed={topic === value} onClick={() => setTopic(value)}>{topics[value]}</button>)}
      </div>
    </div>
    <div className="flex flex-wrap justify-between items-center gap-2 text-xs text-gray-400"><p role="status">게시글 {visible.length}개{savedOnly ? ' · 저장한 글' : ''}</p><p>저장은 이 브라우저에만 보관됩니다.</p></div>
    {error && <p role="alert" className="text-sm text-amber-200">{error}</p>}
    {visible.length ? <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">{visible.map((post) => <SocialCard key={post.id} post={post} saved={saved.some((item) => item.id === post.id)} onSave={() => toggleSaved(post)} />)}</div>
      : <div className="rounded-2xl border border-dashed border-white/15 p-8 text-center space-y-3"><SlidersHorizontal className="mx-auto text-gray-400" aria-hidden="true" /><h2 className="font-semibold text-white">{savedOnly && !saved.length ? '아직 저장한 글이 없습니다' : '조건에 맞는 글이 없습니다'}</h2><p className="text-sm text-gray-400">필터를 바꾸거나 위의 공개글 검색으로 더 찾아보세요.</p><button type="button" onClick={resetFilters} className={filterClass(false)}>필터 초기화</button></div>}
    <aside className="rounded-xl border border-white/10 bg-black/20 p-4 text-xs leading-relaxed text-gray-400">
      <p>SNS 소개 내용은 작성자의 주장입니다. 무료 기간·카드 등록·추가 비용은 공식 페이지에서 다시 확인하세요. 원문을 보려면 플랫폼 로그인이 필요할 수 있습니다.</p>
      <Link href="/news" className="inline-flex min-h-11 items-center text-cyan-300 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-cyan-300">공식 근거가 있는 AI 소식·무료 혜택 보기</Link>
    </aside>
  </section>;
}
