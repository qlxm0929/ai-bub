'use client';

import { useEffect, useState } from 'react';
import { NewsItem, timeAgo } from '@/lib/rss';
import { youtubeChannels, popularSearches } from '@/lib/youtube';

const SOURCES_KO = ['전체', '블로터', 'ZDNet 코리아', '전자신문', 'IT동아'];
const SOURCES_EN = ['테크크런치', '더 버지', '벤처비트'];

type Tab = 'all' | 'ko' | 'en' | 'youtube';

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('all');
  const [source, setSource] = useState('전체');
  const [updatedAt, setUpdatedAt] = useState('');

  // 쿼리 스트링으로 유튜브 탭 이동 처리
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('tab') === 'youtube') setTab('youtube');
    }
  }, []);

  useEffect(() => {
    fetch('/api/news')
      .then((r) => r.json())
      .then((data) => {
        setNews(data.news || []);
        setUpdatedAt(data.updatedAt || '');
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = news.filter((item) => {
    if (tab === 'ko') return item.isKorean;
    if (tab === 'en') return !item.isKorean;
    const srcOk = source === '전체' || item.sourceKo === source;
    return srcOk;
  });

  const koCount = news.filter((i) => i.isKorean).length;
  const enCount = news.filter((i) => !i.isKorean).length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <div className="badge badge-cyan mb-3">실시간 뉴스</div>
        <h1 className="text-4xl font-black text-white mb-2">AI 뉴스</h1>
        <p className="text-gray-500">
          국내외 AI 뉴스를 한곳에서 — 영어 기사도 한국어로 번역해서 읽을 수 있어요
          {updatedAt && (
            <span className="ml-2 text-xs text-gray-600">
              · 업데이트: {new Date(updatedAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </p>
      </div>

      <div className="flex gap-2 mb-6 border-b border-white/5 pb-4 flex-wrap">
        {[
          { key: 'all', label: `전체 (${news.length})`, icon: '📰' },
          { key: 'ko', label: `🇰🇷 한국어 (${koCount})`, icon: '' },
          { key: 'en', label: `🌐 해외 뉴스 (${enCount})`, icon: '' },
          { key: 'youtube', label: 'YouTube', icon: '▶️' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => { setTab(key as Tab); setSource('전체'); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === key
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'youtube' ? (
        <YouTubeSection />
      ) : (
        <>
          {(tab === 'en' || tab === 'all') && enCount > 0 && (
            <div className="glass-card p-4 mb-6 flex items-center gap-3"
              style={{ border: '1px solid rgba(34,211,238,0.2)', background: 'rgba(34,211,238,0.05)' }}>
              <span className="text-xl">🌐</span>
              <p className="text-sm text-gray-300">
                영어 기사는 <span className="text-cyan-400 font-semibold">번역해서 보기</span>를 누르면 바로 한국어로 읽을 수 있어요!
              </p>
            </div>
          )}

          {tab === 'all' && (
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="text-xs text-gray-500 self-center">출처:</span>
              {['전체', ...SOURCES_KO, ...SOURCES_EN].map((s) => (
                <button
                  key={s}
                  onClick={() => setSource(s)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                    source === s
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="glass-card p-5">
                  <div className="skeleton h-3 mb-3 w-1/4" />
                  <div className="skeleton h-5 mb-2 w-full" />
                  <div className="skeleton h-4 mb-1 w-full" />
                  <div className="skeleton h-4 w-3/4" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <div className="text-5xl mb-4">😕</div>
              <p>뉴스를 불러오는 중이에요. 잠시 후 다시 확인해주세요.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function NewsCard({ item }: { item: NewsItem }) {
  return (
    <div className="glass-card p-5 flex flex-col group hover:border-cyan-500/30">
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
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-3 flex-1 mb-3">
          {item.summary}
        </p>
      )}

      <div className="flex items-center gap-2 mt-auto pt-3 border-t border-white/5">
        <a href={item.link} target="_blank" rel="noopener noreferrer"
          className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 transition-colors">
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
  );
}

function YouTubeSection() {
  return (
    <div className="space-y-12 animate-fade-in-up">
      <div>
        <div className="badge badge-orange mb-3">빠른 검색</div>
        <h2 className="text-xl font-bold text-white mb-2">유튜브에서 AI 바로 검색하기</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
          {popularSearches.map((s) => (
            <a key={s.keyword} href={s.searchUrl} target="_blank" rel="noopener noreferrer"
              className="glass-card p-4 group cursor-pointer flex items-center gap-3">
              <span className="text-2xl">{s.icon}</span>
              <div>
                <p className="text-sm font-semibold text-white group-hover:text-orange-400 transition-colors">{s.keyword}</p>
                <p className="text-xs text-gray-500 hidden sm:block">{s.description}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      <div>
        <div className="badge badge-green mb-3">🇰🇷 한국어 채널</div>
        <h2 className="text-xl font-bold text-white mb-2">추천 한국어 AI 유튜브 채널</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {youtubeChannels.filter((c) => c.language === 'ko').map((channel) => (
            <ChannelCard key={channel.id} channel={channel} />
          ))}
        </div>
      </div>

      <div>
        <div className="badge badge-cyan mb-3">🌐 해외 꿀팁</div>
        <h2 className="text-xl font-bold text-white mb-2">자막으로 배우는 전 세계 AI 트렌드</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {youtubeChannels.filter((c) => c.language === 'en').map((channel) => (
            <ChannelCard key={channel.id} channel={channel} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ChannelCard({ channel }: { channel: ReturnType<typeof youtubeChannels>[0] }) {
  return (
    <a href={channel.channelUrl} target="_blank" rel="noopener noreferrer"
      className="glass-card p-5 group cursor-pointer flex flex-col hover:border-red-500/30">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${channel.color} flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform`}>
          {channel.thumbnailEmoji}
        </div>
        <div>
          <h3 className="font-bold text-white group-hover:text-red-400 transition-colors">{channel.name}</h3>
          <span className="text-xs text-gray-500">{channel.subscribers}</span>
        </div>
      </div>
      <p className="text-sm text-gray-400 leading-relaxed mb-4 flex-1">{channel.description}</p>
      <div className="flex flex-wrap gap-1.5 mt-auto">
        {channel.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="badge badge-gray text-[10px]">{tag}</span>
        ))}
      </div>
    </a>
  );
}
