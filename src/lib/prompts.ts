export interface Prompt {
  id: string;
  title: string;
  description: string;
  prompt: string;
  category: string;
  categoryIcon: string;
  tags: string[];
}

export const promptCategories = ['전체', '글쓰기', '업무', '학습', '코딩', '이미지'];

export const recommendedPrompts: Prompt[] = [
  // 글쓰기
  {
    id: 'email-polite',
    title: '정중한 업무 이메일 작성',
    description: '상사나 거래처에게 보내는 정중한 이메일을 자동으로 작성합니다.',
    prompt: '너는 10년 경력의 비즈니스 커뮤니케이션 전문가야.\n\n아래 상황에 맞게 정중하고 전문적인 이메일을 작성해줘:\n- 수신자: [상사/거래처/고객]\n- 목적: [휴가신청/미팅제안/보고서 제출]\n- 핵심 내용: [핵심 내용 입력]\n- 톤: 공손하지만 간결하게\n- 길이: 3문단 이내',
    category: '글쓰기',
    categoryIcon: '✉️',
    tags: ['이메일', '업무', '비즈니스'],
  },
  {
    id: 'blog-post',
    title: '블로그 포스팅 자동 작성',
    description: '주제만 입력하면 SEO에 최적화된 블로그 글을 작성해 줍니다.',
    prompt: '너는 인기 블로거이자 SEO 전문가야.\n\n아래 주제로 블로그 포스팅을 작성해줘:\n- 주제: [주제 입력]\n- 대상 독자: [초보자/일반인/전문가]\n- 글 길이: 800~1200자\n- 구성: 서론(왜 중요한가) → 본론(핵심 3가지) → 결론(요약 + 행동 유도)\n- SEO를 위해 핵심 키워드를 자연스럽게 반복\n- 소제목은 ## 으로 구분',
    category: '글쓰기',
    categoryIcon: '📝',
    tags: ['블로그', 'SEO', '콘텐츠'],
  },
  {
    id: 'self-intro',
    title: '자기소개서 작성',
    description: '취업/진학용 자기소개서를 AI가 감성적으로 작성해 줍니다.',
    prompt: '너는 10년 경력의 취업 컨설턴트야. 아래 정보를 바탕으로 감동적이고 진솔한 자기소개서를 작성해줘:\n\n- 지원 회사/학교: [입력]\n- 지원 직무/학과: [입력]\n- 나의 강점 3가지: [입력]\n- 관련 경험: [입력]\n- 지원 동기: [입력]\n\n형식: 성장과정 → 지원동기 → 강점 → 포부 순서로 1000자 내외로 작성',
    category: '글쓰기',
    categoryIcon: '📄',
    tags: ['자기소개서', '취업', '입시'],
  },
  // 업무
  {
    id: 'meeting-summary',
    title: '회의록 요약 정리',
    description: '길고 복잡한 회의 내용을 한눈에 볼 수 있게 정리해 줍니다.',
    prompt: '아래 회의 내용을 다음 형식으로 깔끔하게 요약해줘:\n\n[회의 내용을 여기에 붙여넣기]\n\n--- 요약 형식 ---\n📋 회의 주제:\n👥 참석자:\n✅ 결정된 사항:\n📌 Action Item (담당자 / 마감일):\n❓ 미결 사항:\n🗓 다음 회의 일정:',
    category: '업무',
    categoryIcon: '📋',
    tags: ['회의록', '요약', '생산성'],
  },
  {
    id: 'report-template',
    title: '보고서 구조 잡기',
    description: '어떤 주제든 논리적인 보고서 구조를 잡아줍니다.',
    prompt: '너는 McKinsey 출신 경영 컨설턴트야.\n\n아래 주제로 경영진에게 보고하는 보고서의 목차와 각 섹션의 핵심 포인트를 작성해줘:\n\n주제: [보고서 주제]\n목적: [문제 분석/제안/현황 보고]\n\n형식:\n- 제목 (핵심을 담은 강력한 제목)\n- 1. 현황 분석 (2-3 포인트)\n- 2. 문제점 / 기회 (2-3 포인트)\n- 3. 제안사항 (실행 가능한 3가지)\n- 4. 기대효과\n- 5. 결론 및 요청사항',
    category: '업무',
    categoryIcon: '📊',
    tags: ['보고서', '기획', '컨설팅'],
  },
  // 학습
  {
    id: 'explain-like-5',
    title: '어려운 개념 쉽게 설명',
    description: '복잡한 개념을 초등학생도 이해할 수 있게 설명해 달라고 합니다.',
    prompt: '아래 개념을 초등학교 5학년도 이해할 수 있는 말로 설명해줘. 어려운 전문 용어는 쓰지 말고, 일상생활의 예시를 들어서 설명해줘. 설명 후에는 "그래서 결론은?" 으로 한 줄 요약도 해줘.\n\n설명할 개념: [개념 입력]',
    category: '학습',
    categoryIcon: '🎓',
    tags: ['개념설명', '학습', '공부'],
  },
  {
    id: 'quiz-maker',
    title: '학습 퀴즈 만들기',
    description: '공부한 내용을 입력하면 복습용 퀴즈를 자동 생성합니다.',
    prompt: '아래 내용을 읽고, 이 내용을 제대로 이해했는지 확인하는 퀴즈 5문제를 만들어줘.\n\n[공부한 내용을 여기에 붙여넣기]\n\n--- 퀴즈 형식 ---\n- 객관식 3문제 (보기 4개)\n- 주관식 2문제\n- 각 문제 뒤에 정답과 해설을 [정답 보기] 형식으로 포함',
    category: '학습',
    categoryIcon: '🧩',
    tags: ['퀴즈', '복습', '시험준비'],
  },
  // 코딩
  {
    id: 'code-review',
    title: '코드 리뷰 요청',
    description: '내가 짠 코드를 전문가처럼 리뷰해 달라고 합니다.',
    prompt: '너는 10년 경력의 시니어 개발자야. 아래 코드를 리뷰해줘.\n\n```\n[코드 붙여넣기]\n```\n\n다음 항목을 체크해서 피드백 해줘:\n1. 🐛 버그 또는 잠재적 오류\n2. ⚡ 성능 개선 포인트\n3. 📖 가독성 / 코드 스타일\n4. 🔒 보안 취약점\n5. ✅ 잘 된 점\n\n수정이 필요한 부분은 수정된 코드 예시도 함께 알려줘.',
    category: '코딩',
    categoryIcon: '💻',
    tags: ['코드리뷰', '개발', '디버깅'],
  },
  {
    id: 'bug-fix',
    title: '오류 메시지 해결',
    description: '에러 메시지를 붙여넣으면 원인과 해결 방법을 알려줍니다.',
    prompt: '아래 오류 메시지가 발생했어. 원인이 무엇인지, 어떻게 해결하는지 한국어로 친절하게 설명해줘. 해결 방법은 단계별로 번호를 매겨서 알려줘.\n\n오류 메시지:\n```\n[오류 메시지 붙여넣기]\n```\n\n내가 사용 중인 언어/프레임워크: [예: Python / React / Next.js]',
    category: '코딩',
    categoryIcon: '🐛',
    tags: ['디버깅', '에러해결', '개발'],
  },
  // 이미지
  {
    id: 'image-portrait',
    title: '프로필 사진 스타일 생성',
    description: '멋진 프로필 사진이나 캐릭터 이미지를 생성하는 프롬프트입니다.',
    prompt: 'Portrait of a [나이]s [국적] [성별], [헤어스타일] hair, wearing [의상 스타일], [배경 묘사], professional lighting, sharp focus, photorealistic, 8k quality, cinematic',
    category: '이미지',
    categoryIcon: '🎨',
    tags: ['이미지생성', '초상화', '캐릭터'],
  },
  {
    id: 'image-wallpaper',
    title: '우주/판타지 배경화면 생성',
    description: '신비롭고 아름다운 배경화면용 이미지를 생성하는 프롬프트입니다.',
    prompt: 'A breathtaking [우주/판타지 풍경 묘사], ethereal atmosphere, glowing nebula in purple and cyan, shooting stars, cinematic composition, ultra-detailed, 4k resolution, digital art style',
    category: '이미지',
    categoryIcon: '🌌',
    tags: ['배경화면', '우주', '판타지'],
  },
];
