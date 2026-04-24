'use client';

import { tools, categories } from '@/lib/tools';
import { NewTool } from '@/lib/newtools';
import { useState, useEffect } from 'react';

export default function ToolsPage() {
  const [newTools, setNewTools] = useState<NewTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchToolsData = () => {
    setTimeout(() => setIsRefreshing(true), 0);
    fetch('/api/newtools')
      .then((r) => r.json())
      .then((data) => {
        setNewTools(data.tools || []);
        setLoading(false);
        setIsRefreshing(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
        setIsRefreshing(false);
      });
  };

  useEffect(() => {
    fetchToolsData();
  }, []);

  const query = searchQuery.toLowerCase().trim();

  // 검색 필터링 로직
  const filteredNewTools = newTools.filter(t => 
    t.name.toLowerCase().includes(query) || 
    t.tagline.toLowerCase().includes(query) || 
    t.description.toLowerCase().includes(query)
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10 flex flex-col sm:flex-row items-center justify-between gap-6">
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
          <button 
            onClick={fetchToolsData}
            disabled={isRefreshing || loading}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border border-white/10 bg-white/5 hover:bg-white/10 transition-colors w-full sm:w-auto ${isRefreshing ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span className={`text-base ${isRefreshing ? 'animate-spin' : ''}`}>🔄</span>
            <span className="hidden sm:inline">{isRefreshing ? '업데이트 중...' : '새로고침'}</span>
          </button>
        </div>
      </div>

      <div className="space-y-16">
        {/* 방금 출시된 최신 AI 도구 (Product Hunt) */}
        {!loading && filteredNewTools.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6 border-b border-pink-500/20 pb-4">
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">🔥 방금 출시된 최신 AI 도구</h2>
              <span className="badge badge-pink">Product Hunt 연동</span>
            </div>
            
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
          </section>
        )}

        {/* 로딩 상태 표시 */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin text-4xl">🔄</div>
          </div>
        )}

        {/* 검색 결과가 없을 때 */}
        {!loading && query && filteredNewTools.length === 0 && tools.filter(t => 
          t.name.toLowerCase().includes(query) || 
          t.nameKo.toLowerCase().includes(query) || 
          t.description.toLowerCase().includes(query)
        ).length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <div className="text-5xl mb-4">😕</div>
            <p>검색 결과가 없습니다. 다른 키워드로 검색해보세요.</p>
          </div>
        )}

        {/* 필수 AI 도구 (카테고리별) */}
        {categories.map((category) => {
          const categoryTools = tools.filter((t) => 
            t.category === category &&
            (t.name.toLowerCase().includes(query) || 
             t.nameKo.toLowerCase().includes(query) || 
             t.description.toLowerCase().includes(query) ||
             t.tags.some(tag => tag.toLowerCase().includes(query)))
          );
          
          if (categoryTools.length === 0) return null; // 검색 결과가 없으면 카테고리 숨김
          
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
                    
                    <p className="text-sm text-gray-400 leading-relaxed mb-6">
                      {tool.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {tool.tags.map((tag) => (
                        <span key={tag} className="badge badge-gray text-xs bg-black/40">#{tag}</span>
                      ))}
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
