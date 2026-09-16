'use client';

import { useState } from 'react';
import { Bookmark, RefreshCw, Search } from 'lucide-react';
import { matchesFilter } from '@/lib/discovery/merge';
import { useDiscovery } from './useDiscovery';
import { DiscoveryCard, displayDate } from './DiscoveryCard';
import { SourcePanel } from './SourcePanel';

const categories = [{ id: 'all', label: '전체' }, { id: 'free', label: '무료 플랜' }, { id: 'trial', label: '무료 체험' }, { id: 'new', label: '신규 AI' }, { id: 'update', label: '기능 업데이트' }] as const;
const buttonStyle = 'min-h-11 px-4 py-2 rounded-lg text-sm font-medium focus-visible:outline-2 focus-visible:outline-purple-300';
export function DiscoveryFeed() {
  const data = useDiscovery();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [use, setUse] = useState('all');
  const [savedOnly, setSavedOnly] = useState(false);
  const items = data.snapshot?.items ?? [];
  const savedIds = new Set(data.saved.map((item) => item.id));
  const currentIds = new Set(items.map((item) => item.id));
  const failedIds = new Set(data.snapshot?.sources.filter((source) => source.status === 'failed').map((source) => source.id));
  const pool = savedOnly ? data.saved.map((entry) => items.find((item) => item.id === entry.id) ?? entry) : items;
  const filtered = pool.filter((item) => matchesFilter(item, query, category, use));
  const hasFailure = failedIds.size > 0 || Boolean(data.networkError);
  return <section aria-label="AI 소식·무료 혜택" className="space-y-6">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="max-w-2xl">
        <div className="badge badge-cyan mb-3">공식 근거와 함께 보는 AI</div>
        <h1 className="text-3xl sm:text-4xl font-black mb-3">AI 소식·무료 혜택</h1>
        <p className="text-sm sm:text-base text-gray-300 leading-relaxed">새로운 도구와 업데이트를 살펴보고, 무료 조건은 공식 근거로 확인하세요.</p>
      </div>
      <button onClick={() => void data.refresh()} disabled={data.loading || (data.cooldown > 0 && !data.networkError)}
        className={`${buttonStyle} inline-flex items-center gap-2 bg-purple-600 text-white hover:bg-purple-500 disabled:opacity-60 disabled:cursor-not-allowed`}>
        <RefreshCw size={16} aria-hidden="true" className={data.loading ? 'animate-spin motion-reduce:animate-none' : ''} />
        {data.loading ? '소스 조회 중' : data.cooldown > 0 && !data.networkError ? `${Math.floor(data.cooldown / 60)}분 ${data.cooldown % 60}초 후 갱신` : '최신 정보 가져오기'}
      </button>
    </div>
    <div className="space-y-3">
      <p role="status" aria-live="polite" className="text-sm text-gray-300">{data.loading ? '연결된 공식 소스를 확인하고 있습니다…' : data.notice}</p>
      <p className="text-xs text-gray-400">연속 호출을 줄이기 위해 수집 결과를 최대 5분 재사용합니다. 저장은 이 브라우저에 보관됩니다.</p>
      {data.snapshot && <p className="text-xs text-gray-400">다음 원본 조회 가능: {displayDate(data.snapshot.nextRefreshAt)} KST</p>}
      {hasFailure && <p role="alert" className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-200">
        {data.networkError || '일부 소스의 조회가 실패했습니다. 해당 소스는 이전 수집 결과가 있으면 표시합니다.'}
      </p>}
      {data.storageError && <p role="alert" className="text-sm text-amber-200">{data.storageError}</p>}
      {data.snapshot && <SourcePanel snapshot={data.snapshot} historical={Boolean(data.networkError) || data.loading} />}
    </div>
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-end">
        <label className="flex-1 min-w-0 basis-64">
          <span className="block text-xs text-gray-300 mb-2">제품·소식 검색</span>
          <span className="relative block"><Search size={17} aria-hidden="true" className="absolute left-3 top-3.5 text-gray-400" />
            <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="예: 코딩, Gemini, 자동화"
              className="w-full min-h-11 rounded-lg border border-white/20 bg-black/50 pl-10 pr-3 text-sm focus:outline-2 focus:outline-purple-300" />
          </span>
        </label>
        <label><span className="block text-xs text-gray-300 mb-2">활용 용도</span>
          <select value={use} onChange={(event) => setUse(event.target.value)} className="min-h-11 rounded-lg border border-white/20 bg-black px-3 text-sm focus:outline-2 focus:outline-purple-300">
            <option value="all">모든 용도</option>{['코딩', '문서', '이미지', '자동화', '리서치'].map((value) => <option key={value}>{value}</option>)}
          </select>
        </label>
        <button aria-pressed={savedOnly} onClick={() => setSavedOnly(!savedOnly)} className={`${buttonStyle} flex items-center gap-2 ${savedOnly ? 'bg-purple-600' : 'bg-white/10 text-gray-200'}`}>
          <Bookmark size={16} aria-hidden="true" />저장한 항목 {data.saved.length}
        </button>
      </div>
      <div className="flex flex-wrap gap-2" aria-label="소식 분류">
        {categories.map((entry) => <button key={entry.id} aria-pressed={category === entry.id} onClick={() => setCategory(entry.id)}
          className={`${buttonStyle} ${category === entry.id ? 'bg-purple-600 text-white' : 'text-gray-300 bg-white/5 hover:bg-white/10'}`}>{entry.label}</button>)}
      </div>
      <p className="text-xs text-gray-400">{filtered.length}개 제품·소식 · 오픈소스와 무료 이용 여부는 별개입니다.</p>
    </div>
    {filtered.length ? <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {filtered.map((item) => <DiscoveryCard key={item.id} item={item} saved={savedIds.has(item.id)} onSave={() => data.toggleSaved(item)}
        stale={Boolean(data.networkError) || !currentIds.has(item.id) || item.evidence.some((entry) => failedIds.has(entry.sourceId))} />)}
    </div> : <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-gray-300">
      {data.loading ? '공식 소스를 조회하고 있습니다.' : savedOnly && !data.saved.length ? '카드의 저장 버튼을 눌러 관심 항목을 모아보세요.'
        : items.length ? '조건에 맞는 항목이 없습니다. 무료 체험 조건을 확인하지 못한 제품은 이 분류에 표시하지 않습니다.' : '아직 수집된 정보가 없습니다. 수집 상태를 확인한 뒤 다시 시도해주세요.'}
    </div>}
  </section>;
}
