export interface Guide {
  slug: string;
  title: string;
  description: string;
  icon: string;
  difficulty: 1 | 2 | 3;
  level: '초급' | '중급' | '심화';
  readTime: number;
  tags: string[];
  steps: {
    title: string;
    content: string;
    tip?: string;
    image?: string;
  }[];
}

export const levelConfig = {
  '초급': { label: '초급', color: 'badge-green', emoji: '🌱', desc: 'AI가 처음인 분들을 위한 기초 가이드' },
  '중급': { label: '중급', color: 'badge-cyan',  emoji: '🔥', desc: 'AI를 조금 써본 분들을 위한 활용 가이드' },
  '심화': { label: '심화', color: 'badge-orange', emoji: '⚡', desc: 'AI를 능숙하게 다루고 싶은 분들을 위한 심화 가이드' },
};

export const guides: Guide[] = [

  // ── 초급 ─────────────────────────────────────────────────────
  {
    slug: 'chatgpt-start',
    title: 'ChatGPT 처음 시작하기',
    description: '회원가입부터 첫 대화까지 단계별로 따라해 보세요.',
    icon: '🤖',
    difficulty: 1,
    level: '초급',
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
    slug: 'ai-tools-compare',
    title: 'ChatGPT vs Claude vs Gemini 비교',
    description: '3대 AI의 장단점을 비교해서 나에게 맞는 AI를 찾아보세요.',
    icon: '⚖️',
    difficulty: 1,
    level: '초급',
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
    slug: 'ai-image',
    title: 'AI로 이미지 만들기',
    description: '텍스트만 입력하면 멋진 그림이 생성됩니다. 처음 시작하는 법을 알아보세요.',
    icon: '🎨',
    difficulty: 1,
    level: '초급',
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

  // ── 중급 ─────────────────────────────────────────────────────
  {
    slug: 'good-prompt',
    title: '좋은 프롬프트 쓰는 법',
    description: 'AI에게 질문을 잘해야 답이 좋아집니다. 핵심 노하우를 알아보세요.',
    icon: '✍️',
    difficulty: 2,
    level: '중급',
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
    slug: 'ai-music',
    title: 'AI로 나만의 노래 만들기 (Suno/Udio)',
    description: '가사와 장르만 입력하면 진짜 가수가 부른 것 같은 완성된 노래가 탄생합니다.',
    icon: '🎵',
    difficulty: 2,
    level: '중급',
    readTime: 8,
    tags: ['Suno', 'Udio', '음악생성', 'AI작곡'],
    steps: [
      {
        title: 'Suno AI 가입하기',
        content: 'suno.com 접속 → Sign in 클릭 → 구글 또는 디스코드 계정으로 로그인\n무료 플랜: 하루 5곡 생성 가능 (크레딧 기반)',
        tip: 'Udio(udio.com)도 비슷한 서비스입니다. 둘 다 써보고 더 마음에 드는 것을 쓰세요!',
      },
      {
        title: '노래 스타일 설정하기',
        content: '"Style of Music" 입력란에 원하는 음악 장르를 영어로 적어주세요.\n예시:\n• "Korean ballad, emotional piano"\n• "K-pop, upbeat, synth"\n• "Lo-fi hip hop, chill, rain sounds"',
        tip: '한국어 가사를 만들고 싶다면 "Korean lyrics" 를 꼭 추가해 주세요.',
      },
      {
        title: '가사 입력하기 (선택)',
        content: '"Lyrics" 란에 직접 가사를 입력하거나, 비워두면 AI가 알아서 만들어 줍니다.\n\n[Verse]\n달빛 아래 너를 기다려\n\n[Chorus]\n사라지지 않는 기억처럼',
        tip: '[Verse], [Chorus], [Bridge] 태그로 구성을 지정하면 훨씬 자연스러운 노래가 나와요.',
      },
      {
        title: 'Create 버튼 눌러서 생성하기',
        content: 'Create 버튼을 누르면 약 30초~1분 내에 2가지 버전의 노래가 생성됩니다.\n마음에 드는 버전을 선택하고 다운로드 또는 공유 버튼을 누르세요!',
      },
    ],
  },
  {
    slug: 'ai-video',
    title: 'AI로 영상 만들기 (Runway/HeyGen)',
    description: '이미지나 텍스트를 넣으면 AI가 실제처럼 움직이는 영상을 만들어 줍니다.',
    icon: '🎥',
    difficulty: 2,
    level: '중급',
    readTime: 10,
    tags: ['Runway', 'HeyGen', '영상생성', 'AI영상'],
    steps: [
      {
        title: '어떤 도구를 쓸까?',
        content: '• Runway Gen-2 (runwayml.com): 텍스트/이미지 → 영상. 특수효과, 영화 느낌에 강함\n• HeyGen (heygen.com): 사진 한 장으로 말하는 아바타 영상 제작. 발표자료, 유튜브에 최적\n• CapCut AI (capcut.com): 간단한 영상 편집 + AI 자막 + 효과',
        tip: '유튜브나 SNS용 짧은 영상이라면 HeyGen이 가장 쉽고 빠릅니다!',
      },
      {
        title: 'HeyGen으로 아바타 영상 만들기',
        content: '1. heygen.com 접속 → 무료 가입\n2. "Create Video" 클릭 → "Avatar" 선택\n3. 원하는 아바타 캐릭터 선택 (또는 내 사진 업로드)\n4. 텍스트 입력: 아바타가 말할 스크립트 작성\n5. 언어/목소리 선택 → Generate 클릭',
        tip: '무료 플랜으로 월 1분짜리 영상 1개를 만들 수 있어요.',
      },
      {
        title: 'Runway로 이미지를 영상으로 변환하기',
        content: '1. runwayml.com 접속 → 가입\n2. "Gen-2" 선택\n3. 이미지 업로드 또는 텍스트로 설명 입력\n예: "A purple nebula slowly expanding in space, cinematic"\n4. 4초 영상 생성 → 마음에 들면 연장 가능',
      },
      {
        title: '영상 다운로드 및 활용',
        content: '생성된 영상은 MP4 형태로 다운로드 가능합니다.\n• 유튜브 쇼츠 / 인스타 릴스에 업로드\n• CapCut에서 음악/자막 추가 편집\n• 발표자료에 삽입',
      },
    ],
  },

  // ── 심화 ─────────────────────────────────────────────────────
  {
    slug: 'antigravity-guide',
    title: 'Antigravity AI 코딩 도우미 사용법',
    description: 'VS Code에서 AI가 코드를 직접 짜줍니다. 코딩 경험이 없어도 OK!',
    icon: '🚀',
    difficulty: 3,
    level: '심화',
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
    difficulty: 3,
    level: '심화',
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
  {
    slug: 'ai-automation',
    title: 'AI로 업무 자동화하기 (Zapier/Make)',
    description: '반복되는 업무를 AI 봇이 알아서 처리하게 만들어 보세요.',
    icon: '⚡',
    difficulty: 3,
    level: '심화',
    readTime: 12,
    tags: ['자동화', 'Zapier', 'Make', '업무효율'],
    steps: [
      {
        title: '업무 자동화가 뭔가요?',
        content: '자동화란 "A가 발생하면 B를 자동으로 실행해"라는 규칙을 만드는 것입니다.\n\n실제 예시:\n• 이메일이 오면 → 슬랙 채널에 자동 알림\n• 구글 폼 응답이 오면 → 구글 시트에 자동 저장 + 자동 답장 이메일 발송\n• 유튜브에 새 영상이 올라오면 → 트위터에 자동 공유',
        tip: 'Zapier(zapier.com)와 Make(make.com) 둘 다 무료 플랜이 있어요.',
      },
      {
        title: 'Zapier 가입 및 첫 Zap 만들기',
        content: '1. zapier.com 접속 → 무료 가입\n2. "Create Zap" 클릭\n3. Trigger(시작 조건) 선택: 예) "Gmail — New Email"\n4. Action(실행할 작업) 선택: 예) "Slack — Send Message"\n5. 두 앱을 연결하고 테스트 → 켜기!',
      },
      {
        title: 'AI를 자동화에 연결하기',
        content: 'Zapier에서 "ChatGPT by OpenAI" 액션을 추가하면:\n\n이메일 수신 → ChatGPT로 내용 요약 → 슬랙에 요약본 전송\n구글 폼 답변 수신 → ChatGPT로 자동 답장 문구 생성 → 이메일 발송\n\n이처럼 AI를 자동화 중간에 끼워 넣어 더 스마트한 자동화가 가능합니다.',
        tip: 'OpenAI API 키가 필요합니다. platform.openai.com에서 발급받으세요.',
      },
      {
        title: '실전 자동화 예시 따라하기',
        content: '📧 고객 문의 자동화:\n1. 구글 폼으로 문의 접수\n2. Zapier가 ChatGPT에게 답변 초안 생성 요청\n3. 초안을 담당자에게 이메일로 자동 전달\n4. 담당자가 수정 후 발송\n\n⏱ 절약 시간: 답변 작성 15분 → 검토 2분으로 단축!',
        tip: '처음에는 간단한 것부터: 이메일 수신 → 노션에 자동 저장 처럼 2단계 자동화부터 시작하세요.',
      },
    ],
  },
  {
    slug: 'community-prompt-guide',
    title: '추천 프롬프트 200% 활용하기',
    description: '커뮤니티의 추천 프롬프트를 복사해서 ChatGPT, Claude 등에서 제대로 사용하는 방법을 알려드립니다.',
    icon: '🔮',
    difficulty: 1,
    level: '초급',
    readTime: 3,
    tags: ['프롬프트', '활용법', 'ChatGPT', 'Claude'],
    steps: [
      {
        title: '1. 프롬프트 복사하기',
        content: '커뮤니티 우측 사이드바(또는 하단)에 있는 "추천 프롬프트" 목록에서 마음에 드는 프롬프트를 찾습니다.\n우측의 **[복사]** 버튼을 누르면 프롬프트 내용이 클립보드에 저장됩니다.',
        tip: '인기순(🔥)으로 정렬하면 다른 사람들이 많이 쓰는 유용한 프롬프트를 쉽게 찾을 수 있어요!',
        image: '/guides/prompt_copy_ui.png',
      },
      {
        title: '2. AI 서비스 열기',
        content: '자주 사용하는 AI 서비스(ChatGPT, Claude, Gemini 등)를 엽니다.\n대화 입력창을 클릭하고 **붙여넣기(Ctrl+V / Cmd+V)** 하세요.',
      },
      {
        title: '3. 괄호 [ ] 안의 내용 수정하기',
        content: '복사된 프롬프트에는 [핵심 내용 입력], [주제 입력] 처럼 대괄호로 표시된 부분이 있습니다.\n이 부분을 지우고 **내가 원하는 실제 내용**으로 바꿔서 입력해 주세요.\n\n예시:\n- 수정 전: 주제: [주제 입력]\n- 수정 후: 주제: 인공지능이 마케팅에 미치는 영향',
        tip: '대괄호 안의 내용을 최대한 구체적으로 적어줄수록 AI가 내 입맛에 딱 맞는 답변을 줍니다.',
        image: '/guides/ai_edit_ui.png',
      },
      {
        title: '4. 답변 확인하고 이어서 요청하기',
        content: 'Enter를 눌러 AI의 답변을 받습니다.\n만약 결과가 조금 아쉽다면, 다시 처음부터 쓰지 말고 **이어서 수정 요청**을 하세요.\n\n"말투를 조금 더 부드럽게 바꿔줘", "2번 항목을 더 자세히 설명해줘" 처럼 대화하듯 고쳐나가면 완벽한 결과를 얻을 수 있습니다.',
      },
    ],
  },
  {
    slug: 'community-resource-guide',
    title: 'GitHub 리소스(에이전트) 적용 방법',
    description: '커뮤니티에서 추천하는 GitHub 리소스(인스트럭션, 에이전트 등)를 내 프로젝트에 적용하는 방법입니다.',
    icon: '⭐',
    difficulty: 2,
    level: '중급',
    readTime: 5,
    tags: ['GitHub', '리소스', 'Copilot', '인스트럭션'],
    steps: [
      {
        title: '1. 리소스 종류 이해하기',
        content: '커뮤니티의 "GitHub 리소스"에는 크게 세 가지가 있습니다.\n\n• **📋 인스트럭션**: AI 코딩 도우미(GitHub Copilot 등)에게 "이런 규칙으로 코드를 짜줘"라고 알려주는 지침서입니다.\n• **🤖 에이전트**: 특정 프레임워크나 언어(예: Next.js, 풀스택)에 특화된 AI 설정 파일입니다.\n• **⚡ 프롬프트/워크플로우**: 자동화된 테스트 생성이나 배포를 도와주는 설정 파일입니다.',
      },
      {
        title: '2. GitHub 리포지토리 방문',
        content: '마음에 드는 리소스를 클릭하면 원본 **GitHub 사이트**로 이동합니다.\n대부분의 리소스는 마크다운(.md) 형태의 파일로 되어 있습니다.\n해당 파일의 내용을 복사하거나 파일을 다운로드 받으세요.',
        image: '/guides/github_repo_ui.png',
      },
      {
        title: '3. 인스트럭션(.github/copilot-instructions.md) 적용하기',
        content: '인스트럭션(규칙)을 적용하려면 내 코드 프로젝트 폴더 최상단에 `.github` 폴더를 만들고, 그 안에 `copilot-instructions.md` 파일을 생성합니다.\n\n그리고 복사해 온 인스트럭션 내용을 이 파일 안에 붙여넣고 저장하세요.',
        tip: '파일을 저장한 후부터는 GitHub Copilot Chat 등에서 코드 제안을 할 때 이 규칙을 자동으로 따르게 됩니다!',
        image: '/guides/vscode_github_folder.png',
      },
      {
        title: '4. 에이전트(.github/agents/) 적용하기',
        content: '특정 역할(풀스택 개발자 등)을 부여하는 에이전트 파일이라면, `.github/agents/` 폴더를 만들고 그 안에 `[이름].md` 로 저장합니다.\n이후 Copilot Chat 등에서 `@풀스택` 처럼 해당 에이전트를 멘션해서 대화하면, 특화된 답변을 받을 수 있습니다.',
        tip: 'AI 도구(VS Code Copilot, Cursor 등)마다 지원하는 에이전트 설정 방식이 다를 수 있으니 각 도구의 문서를 참고하세요.',
      },
    ],
  },
  {
    slug: 'ai-paper-reading',
    title: 'AI로 복잡한 논문 쉽게 요약하기',
    description: '어려운 영어 논문과 수식을 AI의 도움을 받아 빠르고 정확하게 분석하는 방법을 배웁니다.',
    icon: '📚',
    difficulty: 2,
    level: '중급',
    readTime: 4,
    tags: ['논문', 'SciSpace', 'ChatPDF', '연구'],
    steps: [
      {
        title: '1. 용도에 맞는 AI 도구 선택하기',
        content: '논문을 읽기 위해 쓸 수 있는 주요 도구는 다음과 같습니다.\n\n• **SciSpace**: 논문 검색과 수식/표 해석에 가장 강력합니다.\n• **ChatPDF**: 가지고 있는 PDF 파일을 올려서 대화하기 좋습니다.\n• **Consensus**: "커피가 건강에 좋은가?" 같은 질문을 논문 기반으로 팩트체크할 때 씁니다.',
        tip: '처음이라면 내가 가진 논문 PDF를 쉽게 분석해주는 ChatPDF를 추천합니다.',
      },
      {
        title: '2. ChatPDF에 논문 업로드하기',
        content: 'chatpdf.com 에 접속한 뒤, 읽고 싶은 논문이나 두꺼운 전공 서적(PDF 형식)을 화면에 드래그 앤 드롭해서 업로드합니다.\n업로드가 완료되면 AI가 즉시 핵심 내용을 3~4줄로 요약해 주고, 시작하기 좋은 질문들을 추천해 줍니다.',
      },
      {
        title: '3. 구체적으로 질문하며 핵심 뽑아내기',
        content: '단순히 "이 논문 요약해 줘"라고 하기보다는 구체적으로 물어보는 것이 좋습니다.\n\n**[추천 프롬프트]**\n• 이 논문의 핵심 연구 결과(Conclusion) 3가지만 한글로 요약해 줘.\n• 연구에서 사용한 실험 방법(Methodology)을 초보자도 이해할 수 있게 설명해 줘.\n• 3페이지에 있는 두 번째 표가 의미하는 바가 뭐야?',
        tip: '답변 밑에 작게 표시된 번호(페이지 수)를 클릭하면, AI가 참고한 논문 원문 위치로 바로 이동합니다!',
      },
      {
        title: '4. SciSpace로 어려운 수식과 그래프 해석하기',
        content: '논문을 읽다가 도저히 이해되지 않는 복잡한 수학 공식이나 복잡한 표가 있다면 SciSpace(typeset.io)를 활용해 보세요.\n화면의 형광펜(Copilot) 기능으로 수식을 드래그하면, AI가 그 수식이 어떤 의미인지 수식 기호 하나하나 아주 쉽게 풀어서 설명해 줍니다.',
      },
    ],
  }
];
