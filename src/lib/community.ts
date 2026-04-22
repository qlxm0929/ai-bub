export interface CommunityResource {
  id: string;
  title: string;
  titleKo: string;
  description: string;
  descriptionKo: string;
  type: 'instruction' | 'prompt' | 'agent' | 'workflow' | 'tool';
  typeLabel: string;
  tags: string[];
  githubUrl: string;
  author?: string;
  stars?: string;
  color: string;
  icon: string;
  usageKo: string;
  uses: number;
}

export const communityResources: CommunityResource[] = [
  {
    id: 'nextjs-instructions',
    title: 'Next.js Best Practices',
    titleKo: 'Next.js 개발 규칙',
    description: 'Coding guidelines for Next.js App Router projects with TypeScript.',
    descriptionKo: 'Next.js App Router 프로젝트에서 TypeScript를 사용할 때 따라야 할 코딩 규칙 모음입니다.',
    type: 'instruction',
    typeLabel: '📋 인스트럭션',
    tags: ['Next.js', 'TypeScript', 'React'],
    githubUrl: 'https://awesome-copilot.github.com/instructions?q=nextjs',
    stars: '⭐ 커뮤니티 인기',
    color: 'from-black to-gray-800',
    icon: '▲',
    usageKo: '.github/copilot-instructions.md 파일에 붙여넣으면 GitHub Copilot이 이 규칙에 따라 코드를 작성해 줍니다.',
    uses: 24500,
  },
  {
    id: 'typescript-strict',
    title: 'TypeScript Strict Mode Guidelines',
    titleKo: 'TypeScript 엄격 모드 가이드',
    description: 'Instructions for writing type-safe TypeScript with strict mode enabled.',
    descriptionKo: 'TypeScript strict 모드에서 타입 안전한 코드를 작성하는 방법을 AI에게 알려주는 인스트럭션입니다.',
    type: 'instruction',
    typeLabel: '📋 인스트럭션',
    tags: ['TypeScript', '타입안전성'],
    githubUrl: 'https://awesome-copilot.github.com/instructions?q=typescript',
    color: 'from-blue-700 to-blue-900',
    icon: 'TS',
    usageKo: 'TypeScript 프로젝트에서 any 타입 사용을 줄이고 타입 오류를 줄여줍니다.',
    uses: 18200,
  },
  {
    id: 'unit-test-generator',
    title: 'Generate Unit Tests',
    titleKo: '유닛 테스트 자동 생성',
    description: 'Automatically generate comprehensive unit tests for any function or component.',
    descriptionKo: '함수나 컴포넌트를 선택하고 실행하면 단위 테스트 코드를 자동으로 만들어 줍니다.',
    type: 'prompt',
    typeLabel: '⚡ 프롬프트',
    tags: ['테스트', '자동화', 'Jest'],
    githubUrl: 'https://awesome-copilot.github.com/skills?q=test',
    color: 'from-green-700 to-emerald-800',
    icon: '🧪',
    usageKo: '.github/prompts/generate-tests.prompt.md 로 저장하고 Copilot Chat에서 /generate-tests 로 실행.',
    uses: 32100,
  },
  {
    id: 'fullstack-agent',
    title: 'Full-Stack Developer Agent',
    titleKo: '풀스택 개발자 에이전트',
    description: 'An AI agent specialized in full-stack web development with React, Node.js, and databases.',
    descriptionKo: 'React, Node.js, 데이터베이스를 아우르는 풀스택 개발 전담 AI 에이전트입니다.',
    type: 'agent',
    typeLabel: '🤖 에이전트',
    tags: ['풀스택', 'React', 'Node.js'],
    githubUrl: 'https://awesome-copilot.github.com/agents',
    stars: '⭐ 인기 에이전트',
    color: 'from-rose-700 to-pink-800',
    icon: '👨‍💻',
    usageKo: '.github/agents/ 폴더에 저장하면 Copilot이 이 역할로 코드 작업을 도와줍니다.',
    uses: 45600,
  },
  {
    id: 'ci-cd-workflow',
    title: 'CI/CD Pipeline Setup',
    titleKo: 'CI/CD 자동화 파이프라인',
    description: 'Automatically set up GitHub Actions for testing and deployment.',
    descriptionKo: 'GitHub Actions를 이용해서 코드를 올리면 자동으로 테스트하고 배포하는 파이프라인을 만들어 줍니다.',
    type: 'workflow',
    typeLabel: '⚙️ 워크플로우',
    tags: ['GitHub Actions', 'CI/CD', '자동배포'],
    githubUrl: 'https://awesome-copilot.github.com/workflows',
    color: 'from-teal-700 to-cyan-800',
    icon: '🔄',
    usageKo: '.github/workflows/ 폴더에 추가하면 PR 생성 시 자동으로 빌드/테스트가 실행됩니다.',
    uses: 15400,
  },
];

export const resourceTypes = ['전체', '인스트럭션', '프롬프트', '에이전트', '워크플로우'];

export const typeMap: Record<string, string> = {
  '인스트럭션': 'instruction',
  '프롬프트': 'prompt',
  '에이전트': 'agent',
  '워크플로우': 'workflow',
  '도구': 'tool',
};
