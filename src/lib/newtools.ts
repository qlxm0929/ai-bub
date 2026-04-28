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

/** 제목+설명 키워드로 카테고리를 추론 — 순서는 우선순위 */
function classifyCategory(title: string, description: string): string {
  const t = title.toLowerCase();
  const d = description.toLowerCase();
  const text = t + ' ' + d;

  // ── 에이전트 ──────────────────────────────────────────────
  if (/\bagent|agents|agentic|multi[- ]?agent|co[- ]?pilot|autopilot|automat|workflow|orchestrat|fleet of|operate fleet/.test(text)) return '에이전트';

  // ── 어시스턴트 / 챗봇 (영상보다 먼저 — co-founder 등 오분류 방지) ──
  if (/\bchat|chatbot|assistant|companion|tutor|coach|mentor|co[- ]?founder|helpdesk|customer service|replai|reply/.test(text)) return '어시스턴트';

  // ── 영상 / 월드모델 ───────────────────────────────────────
  if (/\bvideo|film|clip|reel|motion|cinema|world model|avatar|lipsync|lip sync|talking head|animation|animate/.test(text)) return '영상';

  // ── 이미지 / 디자인 ───────────────────────────────────────
  if (/\bimage|photo|picture|stable diffusion|midjourney|dall[- ]?e|sketch|icon|logo|visual|illustration|generate.*art/.test(text)) return '이미지';

  // ── 오디오 / 음성 ─────────────────────────────────────────
  if (/\baudio|music|song|sound|voice|speech|tts|asr|podcast|vocal|singing|dialect|code.switch/.test(text)) return '오디오';

  // ── 개발 / 코딩 ───────────────────────────────────────────
  if (/\bcode|coding|coder|developer|engineer|github|gitlab|api|sdk|deploy|devops|cli|terminal|debug|refactor|snippet|ide|vscode|cursor|electronics|hardware|circuit|pcb|snap.together/.test(text)) return '개발';

  // ── 리서치 / 분석 ─────────────────────────────────────────
  if (/\bsearch|research|paper|arxiv|academic|study|analyt|insight|report|dataset|database|knowledge|graph|compare|benchmark|llm.*compare|measure|metric|survey|archive|newspaper/.test(text)) return '리서치';

  // ── 생산성 / 업무 ─────────────────────────────────────────
  if (/\bproductiv|task|manage|project|schedule|calendar|crm|workspace|meeting|note|notion|obsidian|slack|email|brief|summary|remind|to.?do|kanban|jira|asana/.test(text)) return '생산성';

  // ── 글쓰기 / 콘텐츠 ──────────────────────────────────────
  if (/\bwrite|writer|writing|content|copy|copywrite|seo|blog|draft|essay|article|newsletter|transcript|subtitle|caption/.test(text)) return '글쓰기';

  // ── 네트워킹 / 커뮤니티 ──────────────────────────────────
  if (/\bnetwork|community|social|connect|p2p|peer|share|collaborate|team|discord|telegram/.test(text)) return '커뮤니티';

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
