import Parser from 'rss-parser';

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  link: string;
  translateLink: string; // 구글 번역 링크
  pubDate: string;
  source: string;
  sourceKo: string;
  category: string;
  isKorean: boolean; // 한국어 뉴스 여부
  image?: string;
}

const feeds = [
  // ===== 한국어 뉴스 (우선순위 높음) =====
  {
    url: 'https://it.donga.com/feeds/rss/',
    source: 'IT동아',
    sourceKo: 'IT동아',
    category: 'AI 트렌드',
    isKorean: true,
  },
  {
    url: 'https://www.newstheai.com/rss/allArticle.xml',
    source: 'TheAI',
    sourceKo: '더에이아이',
    category: 'AI 전문',
    isKorean: true,
  },
  {
    url: 'http://feeds.feedburner.com/zdkorea',
    source: 'ZDNet Korea',
    sourceKo: 'ZDNet 코리아',
    category: '산업 뉴스',
    isKorean: true,
  },
  // ===== 영어 뉴스 (구글 번역 연결) =====
  {
    url: 'https://techcrunch.com/category/artificial-intelligence/feed/',
    source: 'TechCrunch',
    sourceKo: '테크크런치',
    category: '스타트업',
    isKorean: false,
  },
  {
    url: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml',
    source: 'The Verge',
    sourceKo: '더 버지',
    category: '테크 트렌드',
    isKorean: false,
  },
  {
    url: 'https://feeds.feedburner.com/venturebeat/SZYF',
    source: 'VentureBeat',
    sourceKo: '벤처비트',
    category: '산업 뉴스',
    isKorean: false,
  },
];


const parser = new Parser({
  customFields: {
    item: [['media:content', 'mediaContent'], ['media:thumbnail', 'mediaThumbnail']],
  },
});

function extractImage(item: Record<string, unknown>): string | undefined {
  const media = item['mediaContent'] as { $?: { url?: string } } | undefined;
  const thumb = item['mediaThumbnail'] as { $?: { url?: string } } | undefined;
  if (media?.['$']?.url) return media['$'].url;
  if (thumb?.['$']?.url) return thumb['$'].url;
  const content = (item['content:encoded'] || item['content'] || '') as string;
  const imgMatch = content.match(/<img[^>]+src="([^"]+)"/);
  return imgMatch?.[1];
}

function getTranslateLink(url: string, isKorean: boolean): string {
  if (isKorean) return url;
  return `https://translate.google.com/translate?sl=en&tl=ko&u=${encodeURIComponent(url)}`;
}

import { translateToKorean } from './translate';

export async function fetchNews(limit = 40): Promise<NewsItem[]> {
  const allItems: NewsItem[] = [];

  await Promise.allSettled(
    feeds.map(async (feed) => {
      try {
        const parsed = await parser.parseURL(feed.url);
        const items = await Promise.all(parsed.items.slice(0, 10).map(async (item, idx) => {
          let title = item.title || '제목 없음';
          let summary = item.contentSnippet?.slice(0, 180) || item.summary?.replace(/<[^>]*>/g, '').slice(0, 180) || '';
          
          if (!feed.isKorean) {
             title = await translateToKorean(title);
             summary = await translateToKorean(summary);
          }
          
          return {
            id: `${feed.source}-${idx}-${Date.now()}`,
            title,
            summary,
            link: item.link || '#',
            translateLink: getTranslateLink(item.link || '#', feed.isKorean),
            pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
            source: feed.source,
            sourceKo: feed.sourceKo,
            category: feed.category,
            isKorean: feed.isKorean,
            image: extractImage(item as unknown as Record<string, unknown>),
          };
        }));
        allItems.push(...items);
      } catch (e) {
        console.error(`Failed to fetch ${feed.source}:`, e);
      }
    })
  );

  // 한국어 뉴스 먼저, 그 다음 영어 뉴스 (시간순 정렬)
  const koreanNews = allItems
    .filter((i) => i.isKorean)
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

  const englishNews = allItems
    .filter((i) => !i.isKorean)
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

  return [...koreanNews, ...englishNews].slice(0, limit);
}

export function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (hours < 1) return '방금 전';
  if (hours < 24) return `${hours}시간 전`;
  if (days < 7) return `${days}일 전`;
  return date.toLocaleDateString('ko-KR');
}
