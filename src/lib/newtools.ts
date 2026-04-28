export interface NewTool {
  id: string;
  name: string;
  tagline: string;
  description: string;
  link: string;
  pubDate: string;
  category: string;
  isNew: boolean;
  votes?: number;
  thumbnail?: string;
}

// Product Hunt AI 카테고리 RSS 파싱
import Parser from 'rss-parser';

type CustomItem = {
  content?: string;
  title?: string;
  link?: string;
  pubDate?: string;
  isoDate?: string;
  author?: string;
  contentSnippet?: string;
};

const parser = new Parser<Record<string, unknown>, CustomItem>({
  customFields: { item: ['content'] },
});

/** RSS <content> HTML에서 첫 번째 <p> 태그의 텍스트만 추출 */
function extractFirstParagraph(html: string): string {
  const match = html.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  if (!match) return '';
  // 태그 제거 & HTML 엔티티 디코딩
  return match[1]
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

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
        const items = parsed.items.slice(0, limit).map((item, idx) => {
          const rawTitle = (item.title || '').trim();

          // 실제 설명: <content> HTML의 첫 번째 <p> 텍스트 사용
          const description = extractFirstParagraph(item.content || '');

          const pubDate = item.pubDate || item.isoDate || new Date().toISOString();
          const daysDiff = (Date.now() - new Date(pubDate).getTime()) / 86400000;

          return {
            id: `ph-${idx}-${Date.now()}`,
            name: rawTitle,
            tagline: feed.category,          // 이름 반복 대신 카테고리 표시
            description: description || '설명 없음',
            link: item.link || 'https://www.producthunt.com/topics/artificial-intelligence',
            pubDate,
            category: feed.category,
            isNew: daysDiff < 7,
            thumbnail: undefined,
          };
        });
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
