export interface Guide {
  slug: string;
  title: string;
  description: string;
  icon: string;
  difficulty: 1 | 2 | 3;
  readTime: number;
  tags: string[];
  steps: {
    title: string;
    content: string;
    tip?: string;
  }[];
}

export const guides: Guide[] = [
  {
    slug: 'chatgpt-start',
    title: 'ChatGPT 처음 시작하기',
    description: '회원가입부터 첫 대화까지 단계별로 따라해 보세요.',
    icon: '🤖',
    difficulty: 1,
    readTime: 5,
    tags: ['ChatGPT', '입문', '대화형AI'],
    steps: [
      {
        title: 'chat.openai.com 접속하기',
        content: '구글에 "ChatGPT"를 검색하거나 주소창에 chat.openai.com 을 입력합니다. 오른쪽 위 "Sign up" 버튼을 누르세요.',
        tip: '구글 계정으로 바로 가입할 수 있어서 훨씬 편해요!',
      },
      {
        title: '회원가입 하기',
        content: '이메일 주소를 입력하거나, "Continue with Google"을 클릭해서 구글 계정으로 간편 가입합니다.',
      },
      {
        title: '첫 번째 질문 해보기',
        content: '하단의 입력창에 원하는 것을 입력하세요. 예: "안녕! 자기소개 해줘" 또는 "김치찌개 레시피 알려줘"',
        tip: '한국어로 질문해도 한국어로 잘 답해줍니다!',
      },
      {
        title: '더 좋은 답변 받기',
        content: '질문을 구체적으로 할수록 답변이 좋아집니다. "이메일 써줘" 보다 "친구에게 생일 축하 이메일을 2문단으로 따뜻하게 써줘"가 훨씬 좋아요.',
        tip: '역할을 설정하면 더 좋아요! "너는 요리사야. 초보자도 쉽게 만들 수 있는 파스타 레시피 알려줘"',
      },
    ],
  },
  {
    slug: 'good-prompt',
    title: '좋은 프롬프트 쓰는 법',
    description: 'AI에게 질문을 잘해야 답이 좋아집니다. 핵심 노하우를 알아보세요.',
    icon: '✍️',
    difficulty: 1,
    readTime: 7,
    tags: ['프롬프트', '활용법', '팁'],
    steps: [
      {
        title: '구체적으로 말하기',
        content: '❌ "이메일 써줘"\n✅ "30대 직장인이 상사에게 휴가 신청하는 정중한 이메일을 3문단으로 써줘"',
        tip: '누가, 무엇을, 어떻게, 얼마나 — 4가지를 포함하면 됩니다.',
      },
      {
        title: '역할 설정하기',
        content: '"너는 10년 경력의 영어 선생님이야" 처럼 AI에게 역할을 주면 그 분야 전문가처럼 답해줍니다.',
        tip: '"너는 친절한 의사야, 두통이 있는데 어떻게 하면 좋을까?" 처럼 활용해 보세요.',
      },
      {
        title: '예시 들어주기',
        content: '"이런 스타일로 써줘: [예시 문장]" 처럼 원하는 형식의 예시를 보여주면 그대로 따라서 만들어줍니다.',
      },
      {
        title: '단계별로 나눠서 부탁하기',
        content: '복잡한 작업은 한번에 부탁하지 말고 나눠서 요청하세요. "먼저 계획만 잡아줘" → 확인 → "이제 각 항목을 자세히 써줘"',
        tip: '한 번에 다 부탁하면 오히려 중간에 포기하거나 품질이 낮아질 수 있어요.',
      },
    ],
  },
  {
    slug: 'ai-image',
    title: 'AI로 이미지 만들기',
    description: '텍스트만 입력하면 멋진 그림이 생성됩니다. 처음 시작하는 법을 알아보세요.',
    icon: '🎨',
    difficulty: 2,
    readTime: 8,
    tags: ['이미지생성', 'DALL-E', '미드저니'],
    steps: [
      {
        title: '어떤 도구를 쓸까?',
        content: '• ChatGPT Plus (유료): DALL-E 3 내장, 가장 쉬움\n• Bing Image Creator (무료): DALL-E 기반, 무료로 사용 가능\n• Midjourney (유료): 가장 퀄리티 높음, Discord에서 사용',
        tip: '처음이라면 무료인 Bing Image Creator(bing.com/images/create)부터 시작하세요!',
      },
      {
        title: 'Bing Image Creator 시작하기',
        content: 'bing.com/images/create 접속 → 마이크로소프트 계정으로 로그인 → 입력창에 원하는 이미지 설명 입력',
      },
      {
        title: '이미지 프롬프트 작성하기',
        content: '영어로 쓰면 더 좋지만 한국어도 됩니다.\n예: "귀여운 고양이가 우주에서 커피를 마시는 모습, 수채화 스타일"',
        tip: '스타일을 추가하면 훨씬 좋아져요: 수채화, 유화, 사진, 만화, 픽셀아트 등',
      },
      {
        title: '결과물 저장하기',
        content: '마음에 드는 이미지를 클릭하고 다운로드 버튼을 누르면 저장됩니다. 4가지 버전이 생성되니 그 중 최고를 골라보세요!',
      },
    ],
  },
  {
    slug: 'ai-tools-compare',
    title: 'ChatGPT vs Claude vs Gemini 비교',
    description: '3대 AI의 장단점을 비교해서 나에게 맞는 AI를 찾아보세요.',
    icon: '⚖️',
    difficulty: 1,
    readTime: 6,
    tags: ['비교', 'ChatGPT', 'Claude', 'Gemini'],
    steps: [
      {
        title: 'ChatGPT — 가장 유명한 만능 AI',
        content: '✅ 장점: 가장 많이 사용됨, 자료와 커뮤니티 풍부, 이미지 생성(Plus) 가능\n❌ 단점: 무료 버전은 가끔 막힘, 최신 정보 부족할 때 있음\n💡 추천 대상: AI 처음 쓰는 분, 뭐든 다 해보고 싶은 분',
      },
      {
        title: 'Claude — 글쓰기와 분석의 왕',
        content: '✅ 장점: 긴 문서 분석 탁월, 글쓰기 품질 최상, 한국어 매우 자연스러움\n❌ 단점: 이미지 생성 불가, 인터넷 검색 제한적\n💡 추천 대상: 긴 문서 분석, 좋은 글 쓰고 싶은 분',
      },
      {
        title: 'Gemini — 구글과 연동되는 AI',
        content: '✅ 장점: 최신 정보 검색 가능, 구글 문서/드라이브 연동, 무료\n❌ 단점: 창의적 글쓰기는 상대적으로 약함\n💡 추천 대상: 구글 서비스 많이 쓰는 분, 최신 정보가 중요한 분',
      },
      {
        title: '어떤 걸 써야 할까?',
        content: '처음이라면: ChatGPT\n글쓰기/문서분석: Claude\n최신 정보 검색: Gemini 또는 Perplexity\n이미지 만들기: DALL-E(ChatGPT Plus) 또는 Midjourney',
        tip: '다 무료로 가입할 수 있으니 직접 써보고 가장 편한 것을 쓰세요!',
      },
    ],
  },
  {
    slug: 'antigravity-guide',
    title: 'Antigravity AI 코딩 도우미 사용법',
    description: 'VS Code에서 AI가 코드를 직접 짜줍니다. 코딩 경험이 없어도 OK!',
    icon: '🚀',
    difficulty: 2,
    readTime: 8,
    tags: ['Antigravity', 'AI코딩', 'VS Code'],
    steps: [
      {
        title: 'Antigravity란?',
        content: 'Antigravity는 VS Code(코드 편집기) 안에서 작동하는 AI 코딩 도우미입니다.\n\n✅ 코드를 자동으로 작성해 줌\n✅ 버그를 찾아서 고쳐줌\n✅ "이런 기능 만들어줘"라고 말하면 직접 파일을 수정해줌\n✅ 웹사이트, 앱, 데이터 분석까지 뭐든 가능',
        tip: 'ChatGPT가 말로 답해준다면, Antigravity는 직접 코드 파일을 열고 수정해 줍니다!',
      },
      {
        title: 'VS Code 설치하기',
        content: '1. code.visualstudio.com 접속\n2. 운영체제에 맞는 버전 다운로드 (Windows / Mac / Linux)\n3. 설치 파일 실행 → 기본 설정으로 설치\n4. VS Code 실행!',
        tip: 'VS Code는 전 세계 개발자가 가장 많이 쓰는 무료 코드 편집기예요.',
      },
      {
        title: 'Antigravity 확장 설치하기',
        content: '1. VS Code 왼쪽 사이드바에서 퍼즐 조각 아이콘 (Extensions) 클릭\n2. 검색창에 "Antigravity" 입력\n3. "Antigravity AI" 확장 찾기 → Install 버튼 클릭\n4. 설치 완료 후 VS Code 재시작',
        tip: 'Google DeepMind 팀이 만든 공식 확장입니다.',
      },
      {
        title: '첫 번째 요청 해보기',
        content: '1. VS Code에서 채팅창 열기 (단축키: Ctrl + Shift + P → "Antigravity" 검색)\n2. 채팅창에 원하는 것 입력:\n   예: "간단한 웹 페이지 만들어줘"\n   예: "이 코드에서 오류 찾아줘"\n   예: "To-Do 리스트 앱 만들어줘"\n3. AI가 자동으로 파일을 생성하고 코드를 작성해 줍니다!',
        tip: '한국어로 요청해도 완벽하게 이해합니다. 구체적으로 말할수록 더 좋은 결과가 나와요.',
      },
      {
        title: '잘 활용하는 팁',
        content: '💡 작업 승인/거절: AI가 코드를 수정할 때 미리보기를 보여줍니다. "승인"하면 적용, "거절"하면 취소.\n\n💡 계속 대화하기: 결과가 마음에 안 들면 "더 간단하게 해줘" "색깔을 파란색으로 바꿔줘" 처럼 이어서 요청하면 됩니다.\n\n💡 오류 발생 시: 오류 메시지를 그대로 복사해서 "이 오류 해결해줘" 라고 붙여넣으면 자동으로 고쳐줍니다.',
        tip: '처음엔 작은 것부터 시작하세요! "버튼 하나 있는 HTML 페이지 만들어줘"처럼 간단한 요청부터.',
      },
    ],
  },
  {
    slug: 'github-copilot-start',
    title: 'GitHub Copilot 시작하기',
    description: '코드 자동완성 AI. VS Code에서 코드를 반만 쓰면 나머지를 채워줍니다.',
    icon: '🐙',
    difficulty: 2,
    readTime: 7,
    tags: ['GitHub', 'Copilot', 'AI코딩'],
    steps: [
      {
        title: 'GitHub Copilot이란?',
        content: 'GitHub Copilot은 코드를 쓰는 중에 다음에 올 코드를 자동으로 제안해 주는 AI입니다.\n\n✅ 코드 자동완성 (마치 스마트폰 키보드 예측처럼)\n✅ 함수 이름만 써도 내용을 채워줌\n✅ 주석(설명글)을 쓰면 코드로 변환\n✅ 월 $10 (약 14,000원), 학생은 무료',
      },
      {
        title: 'GitHub 계정 만들기',
        content: 'github.com 접속 → "Sign up" 클릭 → 이메일, 비밀번호, 사용자명 입력 → 가입 완료\n\n학생이라면: education.github.com 에서 학생 인증을 받으면 Copilot이 무료!',
        tip: '재학 중인 학교 이메일(.ac.kr 등)로 가입하면 학생 혜택을 받을 수 있어요.',
      },
      {
        title: 'GitHub Copilot 구독하기',
        content: 'github.com/features/copilot 접속 → "Start a free trial" 클릭 → 30일 무료 체험\n\n이후: 개인 $10/월 또는 학생 무료 (GitHub Education 인증 필요)',
      },
      {
        title: 'VS Code에서 활성화하기',
        content: '1. VS Code Extensions에서 "GitHub Copilot" 설치\n2. VS Code 오른쪽 아래 Copilot 아이콘 클릭 → GitHub 계정으로 로그인\n3. 이제 코드를 쓰면 회색 글씨로 제안이 나타남\n4. Tab 키를 누르면 제안 수락, Esc로 거절',
        tip: '제안이 마음에 들면 Tab, 다른 제안을 보려면 Alt + ] 를 누르세요.',
      },
    ],
  },
];
