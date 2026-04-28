'use client';

import { tools, categories, quickFilters } from '@/lib/tools';
import { NewTool } from '@/lib/newtools';
import { useState, useEffect } from 'react';

export default function ToolsPage() {
  const [newTools, setNewTools] = useState<NewTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const fetchToolsData = () => {
    setTimeout(() => setIsRefreshing(true), 0);
    setFetchError(false);
    fetch('/api/newtools')
      .then((r) => r.json())
      .then((data) => {
        setNewTools(data.tools || []);
        setLoading(false);
        setIsRefreshing(false);
      })
      .catch((e) => {
        console.error(e);
        setFetchError(true);
        setLoading(false);
        setIsRefreshing(false);
      });
  };

  useEffect(() => {
    fetchToolsData();
    // 스켈레톤이 무한히 남지 않도록 최대 8초 후 강제 완료
    const safetyTimer = setTimeout(() => {
      setLoading(false);
    }, 8000);
    return () => clearTimeout(safetyTimer);
  }, []);

  const query = searchQuery.toLowerCase().trim();

  // 검색 필터링
  const filteredNewTools = newTools.filter(t =>
    t.name.toLowerCase().includes(query) ||
    t.tagline.toLowerCase().includes(query) ||
    t.description.toLowerCase().includes(query)
  );

  // 빠른 필터 + 검색 함께 적용
  const matchesTool = (t: typeof tools[number]) => {
    const matchesQuery =
      !query ||
      t.name.toLowerCase().includes(query) ||
      t.nameKo.toLowerCase().includes(query) ||
      t.description.toLowerCase().includes(query) ||
      t.tags.some(tag => tag.toLowerCase().includes(query));

    const matchesFilter = (() => {
      if (!activeFilter) return true;
      if (activeFilter === 'free') return t.hasFree;
      if (activeFilter === 'beginner') return t.difficulty === 1;
      if (activeFilter === 'korean') return t.quickFilters?.includes('korean') ?? false;
      if (activeFilter === 'image') return t.category === '이미지 생성' || (t.quickFilters?.includes('image') ?? false);
      if (activeFilter === 'code') return t.category === '코딩/개발' || (t.quickFilters?.includes('code') ?? false);
      if (activeFilter === 'video') return t.category === '영상/오디오' || (t.quickFilters?.includes('video') ?? false);
      return true;
    })();

    return matchesQuery && matchesFilter;
  };

  const totalFiltered = tools.filter(matchesTool).length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      {/* 헤더 */}
      <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="text-center sm:text-left">
          <div className="badge badge-green mb-3">AI 도구 모음</div>
          <h1 className="text-4xl font-black text-white mb-4">어떤 도구가 필요하신가요?</h1>
          <p className="text-gray-400 text-lg">
            초보자도 쓰기 좋은 검증된 AI 도구들을 모아두었어요.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="도구 이름, 설명 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 transition-colors"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
          </div>
          {/* 새로고침 버튼: 초기 로딩 완료 후에만 표시 */}
          {!loading && (
            <button
              onClick={fetchToolsData}
              disabled={isRefreshing}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border border-white/10 bg-white/5 hover:bg-white/10 transition-colors w-full sm:w-auto ${isRefreshing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span className={`text-base ${isRefreshing ? 'animate-spin' : ''}`}>🔄</span>
              <span className="hidden sm:inline">{isRefreshing ? '업데이트 중...' : '새로고침'}</span>
            </button>
          )}
        </div>
      </div>

      {/* ── 빠른 필터 ── */}
      <div className="mb-8 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveFilter(null)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
            activeFilter === null
              ? 'bg-green-600 border-green-500 text-white'
              : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
          }`}
        >
          전체 {!activeFilter && !query && <span className="ml-1 opacity-60 text-xs">{tools.length}</span>}
        </button>
        {quickFilters.map(f => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(activeFilter === f.id ? null : f.id)}
            title={f.description}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
              activeFilter === f.id
                ? 'bg-green-600 border-green-500 text-white'
                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            {f.label}
          </button>
        ))}
        {(query || activeFilter) && (
          <span className="self-center text-xs text-gray-500 ml-1">
            {totalFiltered}개 도구
          </span>
        )}
      </div>

      <div className="space-y-16">
        {/* 방금 출시된 최신 AI 도구 (Product Hunt) */}
        {!activeFilter && (
          <section>
            <div className="flex items-center gap-3 mb-6 border-b border-pink-500/20 pb-4">
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">🔥 방금 출시된 최신 AI 도구</h2>
              <span className="badge badge-pink">Product Hunt 연동</span>
            </div>

            {/* Product Hunt: 로딩 / 결과 / 실패 분기 */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="glass-card p-5 border border-pink-500/10 animate-pulse">
                    <div className="h-3 w-1/3 bg-white/10 rounded mb-3" />
                    <div className="h-4 w-3/4 bg-white/10 rounded mb-2" />
                    <div className="h-3 w-full bg-white/10 rounded mb-1" />
                    <div className="h-3 w-2/3 bg-white/10 rounded" />
                  </div>
                ))}
              </div>
            ) : fetchError ? (
              <div className="text-center py-10 text-gray-600 border border-white/5 rounded-2xl">
                <div className="text-3xl mb-2">📡</div>
                <p className="text-sm">최신 도구를 불러오지 못했어요.</p>
                <button
                  onClick={fetchToolsData}
                  className="mt-3 px-4 py-1.5 text-xs bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  다시 시도
                </button>
              </div>
            ) : filteredNewTools.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredNewTools.map((tool, i) => (
                  <a key={tool.id} href={tool.link} target="_blank" rel="noopener noreferrer"
                    className="glass-card p-5 group cursor-pointer border border-pink-500/10 hover:border-pink-500/30" style={{ animationDelay: `${i * 0.05}s` }}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="badge badge-pink text-[10px]">NEW</span>
                      <span className="text-xs text-gray-500">{new Date(tool.pubDate).toLocaleDateString('ko-KR')}</span>
                    </div>
                    <h3 className="font-bold text-white mb-1 group-hover:text-pink-400 transition-colors line-clamp-1">{tool.name}</h3>
                    <p className="text-xs font-medium text-pink-300/80 mb-2 line-clamp-1">{tool.tagline}</p>
                    <p className="text-[10px] text-gray-400 leading-relaxed line-clamp-3">{tool.description}</p>
                  </a>
                ))}
              </div>
            ) : (
              /* 데이터는 있지만 빈 배열 또는 필터 결과 없음 */
              <div className="text-center py-10 text-gray-600 border border-white/5 rounded-2xl">
                <div className="text-3xl mb-2">📦</div>
                <p className="text-sm">현재 표시할 최신 AI 도구가 없습니다.</p>
                <button
                  onClick={fetchToolsData}
                  className="mt-3 px-4 py-1.5 text-xs bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  다시 불러오기
                </button>
              </div>
            )}
          </section>
        )}

        {/* 검색/필터 결과가 없을 때 */}
        {!loading && totalFiltered === 0 && (query || activeFilter) && (
          <div className="text-center py-20 text-gray-500">
            <div className="text-5xl mb-4">😕</div>
            <p>검색 결과가 없습니다. 다른 키워드나 필터를 사용해보세요.</p>
            <button
              onClick={() => { setSearchQuery(''); setActiveFilter(null); }}
              className="mt-4 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm transition-colors"
            >
              필터 초기화
            </button>
          </div>
        )}

        {/* 필수 AI 도구 (카테고리별) */}
        {categories.map((category) => {
          const categoryTools = tools.filter(t => t.category === category && matchesTool(t));

          if (categoryTools.length === 0) return null;

          return (
            <section key={category}>
              <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                <h2 className="text-2xl font-bold text-white">{category}</h2>
                <span className="badge badge-gray">{categoryTools.length}개</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {categoryTools.map((tool, i) => (
                  <a
                    key={tool.id}
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-card glow-green p-6 group cursor-pointer relative overflow-hidden"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-lg`}>
                        {tool.categoryIcon}
                      </div>
                      <div className="text-right">
                        <span className={`badge text-xs mb-1 ${tool.hasFree ? 'badge-green' : 'badge-orange'}`}>
                          {tool.hasFree ? '무료 플랜 있음' : '유료만 있음'}
                        </span>
                        <div className="flex justify-end text-xs text-yellow-400 tracking-widest">
                          {'⭐'.repeat(tool.difficulty)}
                          <span className="text-gray-600 ml-1">난이도</span>
                        </div>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-green-400 transition-colors">
                      {tool.name} <span className="text-sm text-gray-500 font-normal ml-1">({tool.nameKo})</span>
                    </h3>

                    <p className="text-sm text-gray-400 leading-relaxed mb-5">
                      {tool.description}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-2 mt-auto">
                      <div className="flex flex-wrap gap-1.5">
                        {tool.tags.map((tag) => (
                          <span key={tag} className="badge badge-gray text-xs bg-black/40">#{tag}</span>
                        ))}
                      </div>
                      <span className="text-[10px] text-gray-600 whitespace-nowrap">검토 {tool.lastReviewed}</span>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
