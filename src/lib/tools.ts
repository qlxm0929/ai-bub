export interface Tool {
  id: string;
  name: string;
  nameKo: string;
  description: string;
  url: string;
  category: string;
  categoryIcon: string;
  difficulty: 1 | 2 | 3;
  hasFree: boolean;
  tags: string[];
  color: string;
}

export const categories = ['대화형 AI', '이미지 생성', '문서/글쓰기', '업무 생산성'];

export const tools: Tool[] = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    nameKo: '챗GPT',
    description: '가장 유명한 대화형 AI. 코딩, 글쓰기, 번역 등 거의 모든 작업이 가능합니다.',
    url: 'https://chat.openai.com',
    category: '대화형 AI',
    categoryIcon: '🤖',
    difficulty: 1,
    hasFree: true,
    tags: ['만능', '대화형', '필수도구'],
    color: 'from-emerald-600 to-teal-800',
  },
  {
    id: 'claude',
    name: 'Claude',
    nameKo: '클로드',
    description: '자연스러운 한국어 구사와 긴 문서 분석에 특화된 AI. 프로그래밍과 글쓰기에 뛰어납니다.',
    url: 'https://claude.ai',
    category: '대화형 AI',
    categoryIcon: '🧠',
    difficulty: 1,
    hasFree: true,
    tags: ['문서분석', '글쓰기', '코딩'],
    color: 'from-amber-600 to-orange-800',
  },
  {
    id: 'gemini',
    name: 'Gemini',
    nameKo: '제미나이',
    description: '구글이 만든 AI. 구글 워크스페이스(문서, 드라이브)와 연동되며 최신 정보 검색이 빠릅니다.',
    url: 'https://gemini.google.com',
    category: '대화형 AI',
    categoryIcon: '✨',
    difficulty: 1,
    hasFree: true,
    tags: ['구글연동', '최신정보', '무료'],
    color: 'from-blue-600 to-indigo-800',
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    nameKo: '퍼플렉시티',
    description: '검색 엔진에 특화된 AI. 질문하면 여러 웹사이트를 찾아서 출처와 함께 정확한 답변을 줍니다.',
    url: 'https://www.perplexity.ai',
    category: '업무 생산성',
    categoryIcon: '🔍',
    difficulty: 1,
    hasFree: true,
    tags: ['검색', '논문조사', '출처제공'],
    color: 'from-cyan-600 to-blue-800',
  },
  {
    id: 'midjourney',
    name: 'Midjourney',
    nameKo: '미드저니',
    description: '최고의 퀄리티를 자랑하는 이미지 생성 AI. 디스코드를 통해 텍스트로 명령어를 입력합니다.',
    url: 'https://www.midjourney.com',
    category: '이미지 생성',
    categoryIcon: '🎨',
    difficulty: 3,
    hasFree: false,
    tags: ['고퀄리티', '예술', '디자인'],
    color: 'from-purple-600 to-fuchsia-800',
  },
  {
    id: 'dalle3',
    name: 'DALL-E 3',
    nameKo: '달리 3',
    description: 'ChatGPT 안에서 바로 쓸 수 있는 이미지 생성 AI. 복잡한 명령도 아주 잘 알아듣습니다.',
    url: 'https://chat.openai.com',
    category: '이미지 생성',
    categoryIcon: '🖼️',
    difficulty: 1,
    hasFree: false,
    tags: ['쉽다', 'ChatGPT연동', '스토리보드'],
    color: 'from-rose-600 to-pink-800',
  },
  {
    id: 'notion-ai',
    name: 'Notion AI',
    nameKo: '노션 AI',
    description: '노션 앱 안에서 문서 요약, 글 다듬기, 아이디어 생성을 도와주는 내장 AI입니다.',
    url: 'https://www.notion.so/product/ai',
    category: '문서/글쓰기',
    categoryIcon: '📝',
    difficulty: 2,
    hasFree: false,
    tags: ['노션', '문서요약', '아이디어'],
    color: 'from-stone-600 to-stone-800',
  },
  {
    id: 'cursor',
    name: 'Cursor',
    nameKo: '커서',
    description: 'AI가 내장된 코드 에디터. 코드를 자동으로 짜주고, 버그를 찾아주며, 질문에 답해줍니다.',
    url: 'https://cursor.sh',
    category: '업무 생산성',
    categoryIcon: '💻',
    difficulty: 3,
    hasFree: true,
    tags: ['코딩', '개발자', 'VSCode호환'],
    color: 'from-slate-700 to-slate-900',
  },
  {
    id: 'vrew',
    name: 'Vrew',
    nameKo: '브루',
    description: '영상 음성을 인식해 자동으로 자막을 달아주는 한국 AI 도구. 대본으로 영상 만들기도 가능합니다.',
    url: 'https://vrew.voyagerx.com/ko/',
    category: '업무 생산성',
    categoryIcon: '🎬',
    difficulty: 1,
    hasFree: true,
    tags: ['영상편집', '자막', '유튜버'],
    color: 'from-red-600 to-rose-800',
  },
  {
    id: 'gamma',
    name: 'Gamma',
    nameKo: '감마',
    description: '주제만 입력하면 예쁜 디자인의 PPT(프레젠테이션)를 1분 만에 자동으로 만들어줍니다.',
    url: 'https://gamma.app',
    category: '문서/글쓰기',
    categoryIcon: '📊',
    difficulty: 1,
    hasFree: true,
    tags: ['PPT', '발표자료', '디자인'],
    color: 'from-violet-600 to-purple-800',
  }
];
