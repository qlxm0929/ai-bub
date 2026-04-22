'use client';

import { useEffect, useState, useRef } from 'react';
import type { CommunityPost } from '@/lib/supabase';
import { recommendedPrompts, promptCategories } from '@/lib/prompts';
import { communityResources } from '@/lib/community';

const POST_CATEGORIES = ['전체', '💡 AI 팁', '🔮 프롬프트 공유', '📰 뉴스/발견', '❓ 질문', '🛠️ 도구 추천', '💬 자유'];

function timeAgo(dateStr: string) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return '방금 전';
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  return `${Math.floor(diff / 86400)}일 전`;
}

// ── 추천 프롬프트 사이드 패널 ─────────────────────────
function PromptSidebar() {
  const [activeTab, setActiveTab] = useState<'prompts' | 'github'>('prompts');
  const [promptCat, setPromptCat] = useState('전체');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = promptCat === '전체'
    ? recommendedPrompts
    : recommendedPrompts.filter(p => p.category === promptCat);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <aside className="w-full lg:w-80 xl:w-96 flex-shrink-0">
      <div className="glass-card overflow-hidden sticky top-20">
        {/* 탭 */}
        <div className="flex border-b border-white/5">
          {(['prompts', 'github'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-xs font-semibold transition-colors ${
                activeTab === tab ? 'text-white bg-white/5 border-b-2 border-purple-500' : 'text-gray-500 hover:text-gray-300'
              }`}>
              {tab === 'prompts' ? '🔮 추천 프롬프트' : '⭐ GitHub 리소스'}
            </button>
          ))}
        </div>

        {activeTab === 'prompts' ? (
          <div>
            {/* 카테고리 필터 */}
            <div className="p-3 border-b border-white/5 flex gap-1.5 flex-wrap">
              {promptCategories.map(cat => (
                <button key={cat} onClick={() => setPromptCat(cat)}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-medium transition-all ${
                    promptCat === cat ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-500 hover:text-gray-300'
                  }`}>
                  {cat}
                </button>
              ))}
            </div>

            {/* 프롬프트 리스트 */}
            <div className="divide-y divide-white/5 max-h-[600px] overflow-y-auto">
              {filtered.map(p => (
                <div key={p.id} className="p-4 group hover:bg-white/2 transition-colors">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{p.categoryIcon}</span>
                      <h3 className="text-xs font-bold text-white">{p.title}</h3>
                    </div>
                    <button
                      onClick={() => handleCopy(p.id, p.prompt)}
                      className={`text-[10px] px-2 py-1 rounded-md flex-shrink-0 transition-all ${
                        copiedId === p.id
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-white/5 text-gray-500 hover:bg-purple-500/20 hover:text-purple-400 border border-white/5'
                      }`}
                    >
                      {copiedId === p.id ? '✓ 복사됨' : '복사'}
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-500 mb-2 leading-relaxed">{p.description}</p>
                  <div className="bg-black/40 rounded-lg p-2.5 border border-white/5 relative">
                    <pre className="text-[10px] text-gray-400 whitespace-pre-wrap leading-relaxed line-clamp-3 font-mono">
                      {p.prompt}
                    </pre>
                  </div>
                  <div className="flex gap-1 mt-2">
                    {p.tags.map(t => (
                      <span key={t} className="text-[9px] bg-white/5 text-gray-600 px-1.5 py-0.5 rounded">#{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* GitHub 리소스 */
          <div className="divide-y divide-white/5 max-h-[660px] overflow-y-auto">
            {communityResources.map(r => (
              <a key={r.id} href={r.githubUrl} target="_blank" rel="noopener noreferrer"
                className="block p-4 hover:bg-white/3 transition-colors group">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${r.color} flex items-center justify-center text-sm font-bold flex-shrink-0`}>
                    {r.icon}
                  </div>
                  <div className="min-w-0">
                    <span className="badge badge-purple text-[9px] mb-0.5 block w-fit">{r.typeLabel}</span>
                    <h3 className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors truncate">{r.titleKo}</h3>
                  </div>
                </div>
                <p className="text-[10px] text-gray-500 leading-relaxed mb-2 line-clamp-2">{r.descriptionKo}</p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {r.tags.slice(0, 2).map(t => (
                      <span key={t} className="text-[9px] bg-white/5 text-gray-600 px-1.5 py-0.5 rounded">#{t}</span>
                    ))}
                  </div>
                  {r.stars && <span className="text-[9px] text-yellow-500">{r.stars}</span>}
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}

// ── 메인 게시판 ───────────────────────────────────────
export default function CommunityBoard() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('전체');
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [form, setForm] = useState({ nickname: '', category: '💡 AI 팁', title: '', content: '' });
  const [error, setError] = useState('');
  const formRef = useRef<HTMLDivElement>(null);

  const fetchPosts = async (cat = category) => {
    setLoading(true);
    const res = await fetch(`/api/posts?category=${encodeURIComponent(cat)}`);
    const data = await res.json();
    setPosts(data.posts || []);
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setSubmitting(false);
    if (!res.ok) { setError(data.error); return; }
    setShowForm(false);
    setForm({ nickname: '', category: '💡 AI 팁', title: '', content: '' });
    setCategory('전체');
    await fetchPosts('전체');
  };

  const handleLike = async (id: string) => {
    if (likedIds.has(id)) return;
    setLikedIds(prev => new Set([...prev, id]));
    const res = await fetch('/api/posts/like', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    const data = await res.json();
    if (res.ok) {
      setPosts(prev => prev.map(p => p.id === id ? { ...p, likes: data.likes } : p));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* 헤더 */}
      <div className="mb-10">
        <div className="badge badge-purple mb-3">커뮤니티</div>
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-4xl font-black text-white mb-2">정보 공유 게시판</h1>
            <p className="text-gray-400">AI 팁, 프롬프트, 발견한 정보를 자유롭게 공유해 보세요 🙌</p>
          </div>
          <button
            onClick={() => { setShowForm(!showForm); setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth' }), 100); }}
            className="btn-primary px-5 py-2.5 text-sm flex items-center gap-2 flex-shrink-0"
          >
            ✏️ 글쓰기
          </button>
        </div>
      </div>

      {/* 메인 레이아웃: 게시판 + 사이드바 */}
      <div className="flex flex-col lg:flex-row gap-8">

        {/* 왼쪽: 게시판 */}
        <div className="flex-1 min-w-0">
          {/* 글쓰기 폼 */}
          {showForm && (
            <div ref={formRef} className="glass-card p-6 mb-6 border border-purple-500/20" style={{ background: 'rgba(124,58,237,0.05)' }}>
              <h2 className="text-lg font-bold text-white mb-5">✏️ 새 글 작성</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-400 mb-1.5 block">닉네임</label>
                    <input value={form.nickname} onChange={e => setForm(f => ({ ...f, nickname: e.target.value }))}
                      maxLength={20} placeholder="익명의 탐험가"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors" required />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1.5 block">카테고리</label>
                    <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors">
                      {POST_CATEGORIES.filter(c => c !== '전체').map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">제목</label>
                  <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    maxLength={100} placeholder="제목을 입력해주세요"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors" required />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">내용 ({form.content.length}/1000)</label>
                  <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                    maxLength={1000} rows={5} placeholder="AI 팁, 프롬프트, 발견한 정보 등을 자유롭게 공유해주세요!"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors resize-none" required />
                </div>
                {error && <p className="text-red-400 text-sm">{error}</p>}
                <div className="flex gap-3 justify-end">
                  <button type="button" onClick={() => setShowForm(false)} className="btn-ghost px-5 py-2 text-sm">취소</button>
                  <button type="submit" disabled={submitting} className="btn-primary px-6 py-2 text-sm">
                    {submitting ? '등록 중...' : '게시하기 🚀'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 카테고리 탭 */}
          <div className="flex gap-2 mb-5 flex-wrap">
            {POST_CATEGORIES.map(c => (
              <button key={c} onClick={() => setCategory(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  category === c ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}>
                {c}
              </button>
            ))}
          </div>

          {/* 게시글 목록 */}
          {loading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="glass-card p-5">
                  <div className="skeleton h-3 w-1/4 mb-3" /><div className="skeleton h-5 w-3/4 mb-2" />
                  <div className="skeleton h-4 w-full mb-1" /><div className="skeleton h-4 w-2/3" />
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-24 text-gray-600">
              <div className="text-5xl mb-4">🌌</div>
              <p className="text-lg">아직 게시글이 없어요.</p>
              <p className="text-sm mt-1">첫 번째 글을 작성해서 커뮤니티를 시작해 보세요!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map(post => (
                <div key={post.id} className="glass-card p-5 group">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="badge badge-purple text-[10px]">{post.category}</span>
                      <span className="text-xs text-gray-600">·</span>
                      <span className="text-xs text-gray-500 font-medium">{post.nickname}</span>
                      <span className="text-xs text-gray-600">·</span>
                      <span className="text-xs text-gray-600">{timeAgo(post.created_at)}</span>
                    </div>
                    <button onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all flex-shrink-0 ${
                        likedIds.has(post.id)
                          ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30 cursor-default'
                          : 'bg-white/5 text-gray-400 border border-white/5 hover:bg-pink-500/10 hover:text-pink-400 hover:border-pink-500/20'
                      }`}>
                      {likedIds.has(post.id) ? '❤️' : '🤍'} {post.likes}
                    </button>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">{post.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-wrap">{post.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 오른쪽: 추천 프롬프트 + GitHub 사이드바 */}
        <PromptSidebar />
      </div>
    </div>
  );
}
