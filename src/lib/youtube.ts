export interface YouTubeChannel {
  id: string;
  name: string;
  description: string;
  channelUrl: string;
  thumbnailEmoji: string;
  subscribers: string;
  language: 'ko' | 'en';
  tags: string[];
  color: string;
  latestVideos: {
    title: string;
    url: string;
    thumbnail: string;
    duration: string;
  }[];
}

export const youtubeChannels: YouTubeChannel[] = [
  // ===== 한국어 채널 =====
  {
    id: 'teddy-note',
    name: '테디노트',
    description: '데이터 사이언스, 머신러닝, AI 실습을 쉽게 알려주는 채널. 초보자도 따라할 수 있는 실습 중심 강의.',
    channelUrl: 'https://www.youtube.com/@teddynote',
    thumbnailEmoji: '🐻',
    subscribers: '17만+',
    language: 'ko',
    tags: ['데이터사이언스', 'Python', '머신러닝', '실습'],
    color: 'from-orange-500 to-red-600',
    latestVideos: [{ title: '랭체인 완전 정복', url: 'https://www.youtube.com/@teddynote', thumbnail: '', duration: '실습 강의' }],
  },
  {
    id: 'nomad-coders',
    name: '노마드 코더',
    description: '니꼴라스가 진행하는 웹개발 & AI 실습 채널. ChatGPT API 활용, AI 클론 코딩 등 트렌디한 강의.',
    channelUrl: 'https://www.youtube.com/@nomadcoders',
    thumbnailEmoji: '💻',
    subscribers: '44만+',
    language: 'ko',
    tags: ['웹개발', 'ChatGPT API', 'AI 앱', '클론코딩'],
    color: 'from-yellow-500 to-orange-600',
    latestVideos: [{ title: 'ChatGPT로 앱 만들기', url: 'https://www.youtube.com/@nomadcoders', thumbnail: '', duration: '프로젝트 강의' }],
  },
  {
    id: 'modulabs',
    name: '모두의연구소',
    description: '국내 최대 AI 연구 커뮤니티의 공식 채널. AI 논문 리뷰, 최신 기술 트렌드, 전문가 인터뷰.',
    channelUrl: 'https://www.youtube.com/@modulabs',
    thumbnailEmoji: '🔬',
    subscribers: '3만+',
    language: 'ko',
    tags: ['AI 연구', '논문 리뷰', 'ML', '딥러닝'],
    color: 'from-blue-500 to-indigo-600',
    latestVideos: [{ title: 'GPT-4o 완전분석', url: 'https://www.youtube.com/@modulabs', thumbnail: '', duration: '전문 강의' }],
  },
  {
    id: 'ai-yoon',
    name: '인공지능 파워유저',
    description: 'ChatGPT, Claude, Gemini 등 AI 도구를 업무에 바로 활용하는 팁. 직장인, 프리랜서 대상.',
    channelUrl: 'https://www.youtube.com/results?search_query=chatgpt+활용법+한국어',
    thumbnailEmoji: '⚡',
    subscribers: '구독 추천',
    language: 'ko',
    tags: ['ChatGPT 활용', '업무자동화', '프롬프트', '생산성'],
    color: 'from-emerald-500 to-teal-600',
    latestVideos: [{ title: 'ChatGPT 업무 활용법', url: 'https://www.youtube.com/results?search_query=chatgpt+업무+활용법', thumbnail: '', duration: '실용 팁' }],
  },
  {
    id: 'boostcamp',
    name: '부스트캠프 AI Tech',
    description: '네이버 커넥트재단의 AI 부트캠프 공식 채널. 딥러닝 이론부터 실전 프로젝트까지 체계적 커리큘럼.',
    channelUrl: 'https://www.youtube.com/@boostcamp_ai',
    thumbnailEmoji: '🚀',
    subscribers: '2만+',
    language: 'ko',
    tags: ['AI 교육', '딥러닝', '취업', '부트캠프'],
    color: 'from-green-500 to-emerald-600',
    latestVideos: [{ title: 'AI 엔지니어 취업 로드맵 2025', url: 'https://www.youtube.com/@boostcamp_ai', thumbnail: '', duration: '커리어 가이드' }],
  },
  // ===== 자막 있는 영어 채널 =====
  {
    id: 'andrej-karpathy',
    name: 'Andrej Karpathy',
    description: 'Tesla AI 전 디렉터이자 OpenAI 창립 멤버. GPT 원리부터 직접 만들기까지 심층 강의. 한국어 자막 제공.',
    channelUrl: 'https://www.youtube.com/@AndrejKarpathy',
    thumbnailEmoji: '🧠',
    subscribers: '100만+',
    language: 'en',
    tags: ['GPT 원리', '딥러닝', '자막', '전문가'],
    color: 'from-purple-500 to-violet-600',
    latestVideos: [{ title: 'Let\'s build GPT: from scratch', url: 'https://www.youtube.com/watch?v=kCc8FmEb1nY', thumbnail: '', duration: '2시간' }],
  },
  {
    id: 'two-minute-papers',
    name: 'Two Minute Papers',
    description: '최신 AI 논문을 2분으로 요약해주는 채널. 한국어 자동자막 지원. AI 트렌드를 빠르게 파악 가능.',
    channelUrl: 'https://www.youtube.com/@TwoMinutePapers',
    thumbnailEmoji: '📄',
    subscribers: '170만+',
    language: 'en',
    tags: ['AI 논문', '자막', '트렌드', '빠른 요약'],
    color: 'from-cyan-500 to-blue-600',
    latestVideos: [{ title: 'AI가 스스로 AI를 만드는 세상이 왔다', url: 'https://www.youtube.com/@TwoMinutePapers', thumbnail: '', duration: '5분' }],
  },
];

export interface YouTubeSearch {
  keyword: string;
  description: string;
  searchUrl: string;
  icon: string;
}

export const popularSearches: YouTubeSearch[] = [
  { keyword: 'ChatGPT 사용법', description: '챗GPT 기초부터 활용까지', searchUrl: 'https://www.youtube.com/results?search_query=chatgpt+사용법', icon: '🤖' },
  { keyword: 'AI 그림 만들기', description: '미드저니, Stable Diffusion', searchUrl: 'https://www.youtube.com/results?search_query=ai+이미지+생성+사용법', icon: '🎨' },
  { keyword: 'Claude 사용법', description: '클로드 AI 활용 가이드', searchUrl: 'https://www.youtube.com/results?search_query=claude+ai+사용법+한국어', icon: '✍️' },
  { keyword: 'AI 업무 자동화', description: '직장인을 위한 AI 활용', searchUrl: 'https://www.youtube.com/results?search_query=ai+업무+자동화+활용법', icon: '⚡' },
  { keyword: 'Cursor AI 코딩', description: 'AI로 코드 짜는 법', searchUrl: 'https://www.youtube.com/results?search_query=cursor+ai+사용법', icon: '💻' },
  { keyword: '프롬프트 엔지니어링', description: 'AI 질문 잘하는 법', searchUrl: 'https://www.youtube.com/results?search_query=프롬프트+엔지니어링+한국어', icon: '📝' },
];
