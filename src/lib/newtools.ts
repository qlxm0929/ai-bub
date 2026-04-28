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
  return match[1]
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

/** 제목+설명 키워드로 카테고리를 추론 */
function classifyCategory(title: string, description: string): string {
  const text = (title + ' ' + description).toLowerCase();
  if (/\bagent|agents|automat|workflow|orchestrat/.test(text)) return '에이전트';
  if (/\bvideo|film|clip|reel|motion|cinema/.test(text)) return '비디오';
  if (/\bimage|photo|design|visual|art|generat.*image/.test(text)) return '이미지';
  if (/\bcod|develop|engineer|github|api|sdk|deploy/.test(text)) return '개발';
  if (/\bwrite|content|copy|seo|blog|draft|text/.test(text)) return '글쓰기';
  if (/\bsearch|research|data|analyt|insight|report/.test(text)) return '리서치';
  if (/\bproductiv|task|manage|schedule|calendar|crm/.test(text)) return '생산성';
  if (/\bchat|assistant|companion|tutor|support/.test(text)) return '어시스턴트';
  if (/\baudio|music|sound|voice|speech|podcast/.test(text)) return '오디오';
  return 'AI 도구';
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
            tagline: classifyCategory(rawTitle, description), // 키워드 기반 카테고리
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
