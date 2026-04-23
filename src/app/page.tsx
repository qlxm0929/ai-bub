import { fetchNews, timeAgo } from '@/lib/rss';
import { tools } from '@/lib/tools';
import { guides } from '@/lib/guides';
import { communityResources } from '@/lib/community';
import { fetchNewTools } from '@/lib/newtools';
import Link from 'next/link';

export const revalidate = 60;

export default async function HomePage() {
  let latestNews: Awaited<ReturnType<typeof fetchNews>> = [];
  let newTools: Awaited<ReturnType<typeof fetchNewTools>> = [];
  
  try {
    const [newsData, toolsData] = await Promise.all([
      fetchNews(6),
      fetchNewTools(4) // 신규 도구 4개 가져오기
    ]);
    latestNews = newsData;
    newTools = toolsData;
  } catch {
    latestNews = [];
    newTools = [];
  }

  const featuredTools = tools.filter((t) => ['chatgpt', 'claude', 'gemini', 'perplexity'].includes(t.id));

  return (
    <div className="stars-bg relative">
      {/* Hero Section */}
      <section className="hero-gradient relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-24 text-center relative z-10">
          <div className="inline-flex items-center gap-2 badge badge-purple mb-6 animate-fade-in-up">
            <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" />
            AI 초보자를 위한 공간
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-widest mb-6 animate-fade-in-up"
            style={{ animationDelay: '0.1s', opacity: 0, animationFillMode: 'forwards' }}>
            <span className="gradient-text">AI.EL</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up"
            style={{ animationDelay: '0.2s', opacity: 0, animationFillMode: 'forwards' }}>
            무한한 기술의 흐름 속에서도 변치 않는 영감과 지혜를 전달합니다.<br className="hidden sm:block" />
            AI가 처음인 분들도 직관적으로 다가갈 수 있는 신비로운 아카이브입니다.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up"
            style={{ animationDelay: '0.3s', opacity: 0, animationFillMode: 'forwards' }}>
            <Link href="/guides" className="btn-primary text-base px-8 py-3 animate-pulse-glow">
              🎓 초보자 가이드 보기
            </Link>
            <Link href="/news" className="btn-ghost text-base px-8 py-3">
              📰 최신 AI 뉴스
            </Link>
          </div>

          <div className="flex items-center justify-center gap-8 mt-14 animate-fade-in-up"
            style={{ animationDelay: '0.4s', opacity: 0, animationFillMode: 'forwards' }}>
            {[
              { value: '10+', label: 'AI 도구 소개' },
              { value: '6+', label: '초보자 가이드' },
              { value: '실시간', label: 'AI 뉴스' },
              { value: '10+', label: 'GitHub 리소스' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 신규 AI 도구 알림 섹션 */}
      {newTools.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 border-t border-white/5 bg-gradient-to-r from-purple-900/10 to-transparent relative">
          <div className="flex items-end justify-between mb-8">
            <div className="flex items-center gap-3">
              <span className="text-3xl animate-bounce">🔥</span>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="section-title !mb-0">이번 주 핫한 신규 AI 도구</h2>
                  <span className="badge badge-orange text-[10px] px-2 py-0.5">실시간</span>
                </div>
                <p className="section-subtitle">전 세계에서 방금 출시된 따끈따끈한 AI 도구들이에요</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
            {newTools.map((tool, i) => (
              <a
                key={tool.id}
                href={tool.link}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card p-5 group cursor-pointer flex flex-col relative overflow-hidden"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                {tool.isNew && (
                  <div className="absolute -right-6 top-3 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-bold px-8 py-0.5 rotate-45 shadow-lg shadow-orange-500/20">
                    NEW
                  </div>
                )}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 flex items-center justify-center text-lg font-bold text-orange-400 group-hover:scale-110 transition-transform">
                    {tool.name.charAt(0)}
                  </div>
                  <h3 className="font-bold text-white text-base group-hover:text-orange-400 transition-colors line-clamp-1 flex-1 pr-6">
                    {tool.name}
                  </h3>
                </div>
                <p className="text-sm text-gray-400 line-clamp-2 mb-4 leading-relaxed flex-1">
                  {tool.tagline}
                </p>
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
                  <span className="text-xs text-gray-500">{timeAgo(tool.pubDate)}</span>
                  <span className="text-xs text-orange-400 font-medium group-hover:translate-x-1 transition-transform">보러가기 →</span>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Latest News */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 border-t border-white/5">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="badge badge-cyan mb-2">실시간 업데이트</div>
            <h2 className="section-title">최신 AI 뉴스</h2>
            <p className="section-subtitle">국내외 AI 뉴스를 한국어로 — 해외 기사도 번역해서 읽을 수 있어요</p>
          </div>
          <div className="flex gap-3">
            <Link href="/news?tab=youtube" className="text-sm text-red-400 hover:text-red-300 transition-colors font-medium">
              ▶ YouTube →
            </Link>
            <Link href="/news" className="text-sm text-purple-400 hover:text-purple-300 transition-colors font-medium">
              전체 보기 →
            </Link>
          </div>
        </div>

        {latestNews.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-card p-5">
                <div className="skeleton h-4 mb-3 w-1/3" />
                <div className="skeleton h-5 mb-2 w-full" />
                <div className="skeleton h-4 mb-1 w-full" />
                <div className="skeleton h-4 w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {latestNews.map((item) => (
              <div key={item.id} className="glass-card p-5 flex flex-col group hover:border-cyan-500/30">
                <div className="flex items-center justify-between mb-3">
                  <span className={`badge text-xs ${item.isKorean ? 'badge-green' : 'badge-cyan'}`}>
                    {item.isKorean ? '🇰🇷' : '🌐'} {item.sourceKo}
                  </span>
                  <span className="text-xs text-gray-600">{timeAgo(item.pubDate)}</span>
                </div>
                <a href={item.link} target="_blank" rel="noopener noreferrer"
                  className="text-sm font-semibold text-white leading-snug mb-2 hover:text-cyan-400 transition-colors line-clamp-2 cursor-pointer">
                  {item.title}
                </a>
                {item.summary && (
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 flex-1">
                    {item.summary}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/5">
                  <a href={item.link} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-cyan-400 font-medium hover:text-cyan-300 flex items-center gap-1">
                    원문 보기 <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </a>
                  {!item.isKorean && (
                    <a href={item.translateLink} target="_blank" rel="noopener noreferrer"
                      className="ml-auto text-xs px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all hover:scale-105 shadow-sm shadow-cyan-500/20"
                      style={{ background: 'rgba(34,211,238,0.15)', color: '#67e8f9', border: '1px solid rgba(34,211,238,0.3)' }}>
                      🌐 번역해서 보기
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* New Tools from Product Hunt */}
      {newTools.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 border-t border-white/5">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="badge badge-pink mb-2">🔥 최신 출시</div>
              <h2 className="section-title">방금 나온 따끈따끈한 AI 도구</h2>
              <p className="section-subtitle">전 세계에서 방금 출시된 최신 AI 서비스들을 만나보세요</p>
            </div>
            <Link href="/tools" className="text-sm text-purple-400 hover:text-purple-300 transition-colors font-medium">
              더 보기 →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {newTools.slice(0, 4).map((tool, i) => (
              <a key={tool.id} href={tool.link} target="_blank" rel="noopener noreferrer"
                className="glass-card p-5 group cursor-pointer border border-pink-500/10 hover:border-pink-500/30" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="badge badge-pink text-[10px]">NEW</span>
                  <span className="text-xs text-gray-500">{new Date(tool.pubDate).toLocaleDateString('ko-KR')}</span>
                </div>
                <h3 className="font-bold text-white mb-1 group-hover:text-pink-400 transition-colors line-clamp-1">{tool.name}</h3>
                <p className="text-xs font-medium text-pink-300/80 mb-2 line-clamp-1">{tool.tagline}</p>
                <p className="text-[10px] text-gray-500 leading-relaxed line-clamp-2">{tool.description}</p>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Featured Tools */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 border-t border-white/5">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="badge badge-green mb-2">추천 필수 도구</div>
            <h2 className="section-title">가장 유명한 AI 도구</h2>
            <p className="section-subtitle">초보자가 바로 시작하기 좋은 AI 도구들이에요</p>
          </div>
          <Link href="/tools" className="text-sm text-purple-400 hover:text-purple-300 transition-colors font-medium">
            전체 보기 →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredTools.map((tool, i) => (
            <a key={tool.id} href={tool.url} target="_blank" rel="noopener noreferrer"
              className="glass-card p-5 group cursor-pointer" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-lg mb-4 group-hover:scale-110 transition-transform`}>
                {tool.categoryIcon}
              </div>
              <h3 className="font-bold text-white mb-1">{tool.nameKo}</h3>
              <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3">{tool.description}</p>
              <div className="flex items-center gap-2">
                <span className={`badge text-xs ${tool.hasFree ? 'badge-green' : 'badge-orange'}`}>
                  {tool.hasFree ? '무료' : '유료'}
                </span>
                <div className="flex text-xs text-yellow-400">
                  {'⭐'.repeat(tool.difficulty)}
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Beginner Guides */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 border-t border-white/5">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="badge badge-orange mb-2">입문 가이드</div>
            <h2 className="section-title">초보자 가이드</h2>
            <p className="section-subtitle">단계별로 따라하면 누구나 AI를 쓸 수 있어요</p>
          </div>
          <Link href="/guides" className="text-sm text-purple-400 hover:text-purple-300 transition-colors font-medium">
            전체 보기 →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {guides.map((guide) => (
            <Link key={guide.slug} href={`/guides/${guide.slug}`} className="glass-card p-6 flex items-start gap-4 group cursor-pointer">
              <div className="text-3xl flex-shrink-0 group-hover:scale-110 transition-transform">{guide.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-white group-hover:text-purple-300 transition-colors text-sm">
                    {guide.title}
                  </h3>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">{guide.description}</p>
                <div className="flex items-center gap-2">
                  <span className="badge badge-gray text-xs">⏱ {guide.readTime}분</span>
                  <span className="badge badge-purple text-xs">{'⭐'.repeat(guide.difficulty)} 난이도</span>
                </div>
              </div>
              <span className="text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">→</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Antigravity Spotlight */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 border-t border-white/5">
        <div className="rounded-2xl p-8 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(79,70,229,0.15), rgba(124,58,237,0.15))', border: '1px solid rgba(139,92,246,0.25)' }}>
          <div className="absolute -right-10 -top-10 w-60 h-60 rounded-full blur-3xl opacity-20"
            style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)' }} />
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="text-5xl animate-float flex-shrink-0">🚀</div>
            <div className="flex-1">
              <div className="badge badge-purple mb-2">AI 코딩 도우미</div>
              <h2 className="text-2xl font-bold text-white mb-2">Antigravity로 코드 짜기</h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                VS Code에서 "이런 기능 만들어줘"라고 말하면 AI가 직접 코드를 작성합니다.<br />
                코딩 경험이 없어도 누구나 앱을 만들 수 있어요.
              </p>
              <Link href="/guides/antigravity-guide" className="btn-primary text-sm px-6 py-2.5 inline-block">
                📖 사용법 가이드 보기
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* GitHub Community Resources */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 border-t border-white/5">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="badge badge-cyan mb-2">GitHub 커뮤니티</div>
            <h2 className="section-title">커뮤니티 AI 리소스</h2>
            <p className="section-subtitle">개발자들이 공유한 AI 프롬프트, 에이전트, 워크플로우</p>
          </div>
          <Link href="/community" className="text-sm text-purple-400 hover:text-purple-300 transition-colors font-medium">
            전체 보기 →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {communityResources.slice(0, 3).map((resource) => (
            <a key={resource.id} href={resource.githubUrl} target="_blank" rel="noopener noreferrer" className="glass-card p-5 group cursor-pointer">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${resource.color} flex items-center justify-center text-base font-bold flex-shrink-0`}>
                  {resource.icon}
                </div>
                <div>
                  <span className="badge badge-purple text-xs block mb-1">{resource.typeLabel}</span>
                  <h3 className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors">{resource.titleKo}</h3>
                </div>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3">{resource.descriptionKo}</p>
              <div className="flex flex-wrap gap-1">
                {resource.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="badge badge-gray text-xs">{tag}</span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(79,70,229,0.2))', border: '1px solid rgba(139,92,246,0.3)' }}>
          <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(ellipse at center, rgba(139,92,246,0.3), transparent 70%)' }} />
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white mb-3">AI가 어렵다고 느끼셨나요?</h2>
            <p className="text-gray-400 mb-8 text-lg">초보자 가이드로 5분 안에 첫 AI 대화를 시작해보세요.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/guides/chatgpt-start" className="btn-primary text-base px-10 py-3 inline-block">
                🚀 지금 시작하기
              </Link>
              <Link href="/community" className="btn-ghost text-base px-8 py-3 inline-block">
                🌐 커뮤니티 리소스
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
