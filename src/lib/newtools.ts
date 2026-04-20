export interface NewTool {
  id: string;
  name: string;
  tagline: string;  // 한국어 요약
  description: string;
  link: string;
  pubDate: string;
  category: string;
  isNew: boolean; // 7일 이내
  votes?: number;
  thumbnail?: string;
}

// Product Hunt AI 카테고리에서 파싱
import Parser from 'rss-parser';
import { translateToKorean } from './translate';

const parser = new Parser();

export async function fetchNewTools(limit = 12): Promise<NewTool[]> {
  const tools: NewTool[] = [];

  const feeds = [
    {
      url: 'https://www.producthunt.com/feed?category=artificial-intelligence',
      category: 'AI 도구',
    },
  ];

  await Promise.allSettled(
    feeds.map(async (feed) => {
      try {
        const parsed = await parser.parseURL(feed.url);
        const items = await Promise.all(
          parsed.items.slice(0, limit).map(async (item, idx) => {
            const rawTitle = item.title || '';
            const rawSummary = item.contentSnippet?.slice(0, 200) || '';

            // 번역
            const [titleKo, summaryKo] = await Promise.all([
              translateToKorean(rawTitle),
              translateToKorean(rawSummary),
            ]);

            const pubDate = item.pubDate || item.isoDate || new Date().toISOString();
            const daysDiff = (Date.now() - new Date(pubDate).getTime()) / 86400000;

            return {
              id: `ph-${idx}-${Date.now()}`,
              name: rawTitle,
              tagline: titleKo !== rawTitle ? titleKo : rawTitle,
              description: summaryKo || rawSummary,
              link: item.link || 'https://www.producthunt.com/topics/artificial-intelligence',
              pubDate,
              category: feed.category,
              isNew: daysDiff < 7,
              thumbnail: undefined,
            };
          })
        );
        tools.push(...items);
      } catch (e) {
        console.error('Failed to fetch new tools:', e);
      }
    })
  );

  return tools
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
    .slice(0, limit);
}
