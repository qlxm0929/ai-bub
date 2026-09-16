export type Platform = 'threads' | 'instagram';
export type Topic = 'tools' | 'workflow' | 'research' | 'image' | 'offers';
export type SocialPost = {
  readonly id: string;
  readonly platform: Platform;
  readonly author: string;
  readonly title: string;
  readonly summary: string;
  readonly topics: readonly Topic[];
  readonly url: string;
  readonly publishedOn: string | null;
  readonly checkedOn: string;
  readonly caveat: string;
};
export const platforms = { threads: 'Threads', instagram: 'Instagram' } as const;
export const topics = {
  tools: 'AI 도구', workflow: '업무·자동화', research: '문서·리서치', image: '이미지·영상', offers: '무료 언급',
} as const;
export const curatedOn = '2026-09-16';
export const socialPosts: readonly SocialPost[] = [
  {
    id: 'ig-DdK6WNcTXh4', platform: 'instagram', author: 'withonessaem',
    title: 'AI 이미지, 카메라 시점을 바꾸는 프롬프트',
    summary: '피사체를 위·아래·옆에서 바라보는 구도로 AI 이미지의 분위기를 조절하는 활용 예시를 소개합니다.',
    topics: ['image'], url: 'https://www.instagram.com/withonessaem/p/DdK6WNcTXh4/',
    publishedOn: '2026-09-12', checkedOn: curatedOn,
    caveat: '게시자의 프롬프트 예시입니다. 공식 명령어나 동일 결과를 보장하는 기능으로 확인한 것은 아닙니다.',
  },
  {
    id: 'ig-DdGmmIJzlpz', platform: 'instagram', author: 'withonessaem',
    title: '작업 목적별로 살펴보는 AI 도구 모음',
    summary: '글쓰기와 검색, 디자인, 영상, 음성, 발표 자료, 자동화 등 작업에 따라 AI 도구를 고르는 출발점을 제시합니다.',
    topics: ['tools', 'workflow', 'image'], url: 'https://www.instagram.com/reel/DdGmmIJzlpz/',
    publishedOn: '2026-09-10', checkedOn: curatedOn,
    caveat: '공개 캡션을 요약했습니다. 영상에 소개된 모든 도구를 개별 검증한 목록은 아닙니다.',
  },
  {
    id: 'th-DcEKT_hGvER', platform: 'threads', author: 'k.jarvis_____',
    title: 'AI 자동화 전에 정리할 업무 흐름',
    summary: '도구를 늘리기 전에 입력 자료의 기준과 승인 절차를 정하고, 반복 입력·분류부터 자동화하자는 업무 활용 글입니다.',
    topics: ['workflow'], url: 'https://www.threads.com/@k.jarvis_____/post/DcEKT_hGvER',
    publishedOn: '2026-08-16', checkedOn: curatedOn,
    caveat: '개인 작성자의 업무 방식 제안이며 자동화 도구의 성능 검증 결과는 아닙니다.',
  },
  {
    id: 'ig-DJx5uiwpPu8', platform: 'instagram', author: 'reels_hwan',
    title: 'Pippit AI 아바타 영상 제작 소개',
    summary: '아바타나 사진을 고르고 스크립트·음성·자막을 설정하는 영상 제작 흐름을 소개한 게시글입니다.',
    topics: ['image', 'offers'], url: 'https://www.instagram.com/reel/DJx5uiwpPu8/',
    publishedOn: '2025-05-18', checkedOn: curatedOn,
    caveat: '2025년 글에서 한 달 무료 사용을 언급합니다. 현재 제공 여부·대상·카드 등록·추가 비용은 미확인입니다.',
  },
  {
    id: 'th-DFPzdrUPiaS', platform: 'threads', author: 'choi.openai',
    title: '글쓰기부터 코딩까지, 작업별 AI 도구 조합',
    summary: '기사 작성, 조사, 발표 자료, 이미지·영상, 코딩 등 여러 작업에 사용한 AI 도구를 작성자가 나누어 소개합니다.',
    topics: ['tools', 'workflow', 'research'], url: 'https://www.threads.com/@choi.openai/post/DFPzdrUPiaS',
    publishedOn: '2025-01-25', checkedOn: curatedOn,
    caveat: '과거 활용 사례입니다. 언급된 모델·기능·요금의 현재 제공 여부는 각 서비스에서 확인하세요.',
  },
  {
    id: 'th-DERqLfJpoOa', platform: 'threads', author: 'choi.openai',
    title: '자료 조사에 활용하는 AI 서비스 살펴보기',
    summary: '연결된 글에서 Perplexity, Genspark, Felo, Google Deep Research, NotebookLM, Stanford Storm을 리서치 도구로 소개합니다.',
    topics: ['research', 'tools'], url: 'https://www.threads.com/@choi.openai/post/DERqLfJpoOa',
    publishedOn: '2025-01-01', checkedOn: curatedOn,
    caveat: '2025년 소개글입니다. 게시자의 추천이며 현재 기능·가격을 검증한 순위가 아닙니다.',
  },
];

export function socialSearchUrl(platform: Platform, keyword: string, topic: Topic | 'all'): string {
  const domain = platform === 'threads' ? '(site:threads.com OR site:threads.net)' : 'site:instagram.com';
  const subject = topic === 'all' ? 'AI 도구 활용' : topic === 'offers' ? 'AI 무료 체험' : topics[topic];
  const url = new URL('https://www.google.com/search');
  url.searchParams.set('q', `${domain} (AI OR 인공지능) ${subject} ${keyword.trim()}`.trim());
  return url.toString();
}
