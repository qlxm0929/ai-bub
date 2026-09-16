export const feeds = [
  { id: 'openai', name: 'OpenAI 공식 소식', url: 'https://openai.com/news/rss.xml', home: 'https://openai.com/', kind: 'official', uses: ['문서', '코딩', '이미지'] },
  { id: 'google', name: 'Google AI 공식 블로그', url: 'https://blog.google/technology/ai/rss/', home: 'https://ai.google/', kind: 'official', uses: ['문서', '이미지', '리서치'] },
  { id: 'huggingface', name: 'Hugging Face 블로그', url: 'https://huggingface.co/blog/feed.xml', home: 'https://huggingface.co/', kind: 'official', uses: ['코딩', '리서치'] },
  { id: 'ollama', name: 'Ollama 개발자 릴리스', url: 'https://github.com/ollama/ollama/releases.atom', home: 'https://ollama.com/', kind: 'developer', product: 'Ollama', uses: ['코딩', '자동화'] },
  { id: 'cline', name: 'Cline 개발자 릴리스', url: 'https://github.com/cline/cline/releases.atom', home: 'https://cline.bot/', kind: 'developer', product: 'Cline', uses: ['코딩', '자동화'] },
  { id: 'open-webui', name: 'Open WebUI 개발자 릴리스', url: 'https://github.com/open-webui/open-webui/releases.atom', home: 'https://openwebui.com/', kind: 'developer', product: 'Open WebUI', uses: ['문서', '자동화'] },
] satisfies readonly Feed[];

export type Feed = {
  readonly id: string; readonly name: string; readonly url: string; readonly home: string;
  readonly kind: 'official' | 'developer'; readonly product?: string; readonly uses: readonly string[];
};

export const offers = [
  {
    kind: 'trial', id: 'google-cloud-trial', productId: 'google-cloud', product: 'Google Cloud',
    name: 'Google Cloud 공식 무료 체험', url: 'https://docs.cloud.google.com/free/docs/free-cloud-features?hl=en',
    home: 'https://cloud.google.com/free', uses: ['코딩', '자동화'],
    required: [/\$300 Welcome credit/i, /90 days/i, /credit card or other payment method/i, /No automatic charges/i, /resources will be stopped/i],
    quote: '$300 Welcome credit / 90 days',
    scope: '첫 체험 대상 신규 사용자에게 90일간 300달러 크레딧. 과거 유료 이용 또는 체험 이력이 있으면 대상에서 제외됩니다.',
    summary: '생성형 AI와 클라우드 앱을 시험할 수 있는 크레딧입니다. 적용 서비스가 제한되므로 사용하려는 AI 서비스의 대상 여부를 확인하세요.',
    card: '신용카드 또는 유효한 결제 수단 필요',
    expiry: '90일 또는 크레딧 소진 시 종료. 직접 유료 전환하지 않으면 자동 청구 없이 리소스 중지.',
    extra: '유료 전환 후 초과 사용은 과금. AI Studio Gemini API 및 외부 파트너 모델에는 크레딧 사용 불가.',
  },
  {
    kind: 'free', card: '미확인', expiry: '미확인', id: 'copilot-price', productId: 'github-copilot', product: 'GitHub Copilot',
    name: 'GitHub Copilot 공식 요금 안내', url: 'https://docs.github.com/en/copilot/get-started/plans',
    home: 'https://github.com/features/copilot', uses: ['코딩'],
    required: [/Copilot Free/i, /2000 completions per month/i],
    quote: '2000 completions per month',
    scope: 'Copilot Free: 월 코드 완성 2,000회. 채팅·AI 크레딧 한도는 공식 요금표에서 별도 확인.',
    summary: '편집기에서 코드 작성과 질문을 돕는 도구입니다. 무료 플랜의 코드 완성 한도를 공식 문서에서 확인합니다.',
    extra: '상위 플랜·추가 사용량의 비용은 별도 요금표 확인',
  },
  {
    kind: 'free', card: '미확인', expiry: '미확인', id: 'gemini-price', productId: 'gemini-api', product: 'Gemini API',
    name: 'Gemini API 공식 요금표', url: 'https://ai.google.dev/gemini-api/docs/pricing?hl=en',
    home: 'https://ai.google.dev/', uses: ['코딩', '문서', '이미지', '자동화'],
    required: [/Free Tier/i, /Free of charge/i], quote: 'Free of charge',
    scope: '일부 모델·항목에 무료 티어 제공. 모델별 지원 여부와 호출 한도는 요금표에서 확인.',
    summary: '앱에 텍스트·이미지 등 AI 기능을 연결하는 개발자 API입니다. 전체 모델이 무료인 것은 아닙니다.',
    extra: '유료 티어 및 검색·캐싱 등 부가 기능은 모델별 별도 요금 확인',
  },
] as const;

export const disconnected = [
  { id: 'producthunt', name: 'Product Hunt', url: 'https://www.producthunt.com/v2/docs', message: '미연결 · API 토큰 및 사이트 이용 목적에 맞는 이용 조건 확인 필요' },
  { id: 'threads', name: 'Threads', url: 'https://www.threads.com/', message: '미연결 · 공개 검색 서비스 연동 및 접근 범위 확인 필요' },
  { id: 'instagram', name: 'Instagram', url: 'https://www.instagram.com/', message: '미연결 · 공개 검색 서비스 연동 및 접근 범위 확인 필요' },
] as const;
