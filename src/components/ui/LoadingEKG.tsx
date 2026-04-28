'use client';

/**
 * LoadingEKG.tsx
 * 엔젤비트 감성의 심전도(EKG) 맥박 애니메이션 로딩 컴포넌트
 * - SVG path 기반 실제 심전도 파형
 * - 네온 사이언 글로우 효과
 * - stroke-dashoffset 애니메이션으로 "선이 그려지며 흘러가는" 효과
 * - 배경 투명 — 어디서든 overlay로 사용 가능
 */

interface LoadingEKGProps {
  /** SVG 너비 (px 또는 Tailwind 클래스로 조절 가능) */
  width?: number;
  /** SVG 높이 */
  height?: number;
  /** 글로우 색상 (기본: cyan) */
  color?: 'cyan' | 'blue' | 'green' | 'pink';
  /** 텍스트 표시 여부 */
  showLabel?: boolean;
  className?: string;
}

const COLOR_MAP = {
  cyan:  { stroke: '#22d3ee', glow: '#06b6d4', text: 'text-cyan-400' },
  blue:  { stroke: '#60a5fa', glow: '#3b82f6', text: 'text-blue-400' },
  green: { stroke: '#34d399', glow: '#10b981', text: 'text-emerald-400' },
  pink:  { stroke: '#f472b6', glow: '#ec4899', text: 'text-pink-400' },
};

// EKG 파형 경로: 평탄 → 작은 P파 → 급격한 QRS군 → T파 → 평탄 반복
// viewBox: "0 0 400 100"
const EKG_PATH =
  'M0,50 L60,50 L70,45 L80,50 ' +          // 평탄 + P파
  'L90,50 L100,10 L110,90 L120,20 L130,50 ' + // QRS 군 (급격한 상하)
  'L145,50 L160,35 L175,50 ' +               // T파
  'L400,50';                                  // 평탄 (반복)

// 경로 총 길이 (근사값 — 실제보다 넉넉히)
const PATH_LENGTH = 520;

export default function LoadingEKG({
  width = 320,
  height = 80,
  color = 'cyan',
  showLabel = true,
  className = '',
}: LoadingEKGProps) {
  const c = COLOR_MAP[color];

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 400 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="로딩 중"
      >
        <defs>
          {/* 글로우 필터 */}
          <filter id={`ekg-glow-${color}`} x="-20%" y="-80%" width="140%" height="260%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* 마스크: 왼→오른쪽으로 보이는 영역 제한 (fade tail) */}
          <linearGradient id={`ekg-fade-${color}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="25%" stopColor="white" stopOpacity="1" />
            <stop offset="75%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <mask id={`ekg-mask-${color}`}>
            <rect x="0" y="0" width="400" height="100" fill={`url(#ekg-fade-${color})`} />
          </mask>
        </defs>

        {/* 배경 기준선 (희미) */}
        <line
          x1="0" y1="50" x2="400" y2="50"
          stroke={c.stroke}
          strokeWidth="0.5"
          strokeOpacity="0.15"
        />

        {/* EKG 파형 — 흘러가는 애니메이션 */}
        <path
          d={EKG_PATH}
          stroke={c.stroke}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={`url(#ekg-glow-${color})`}
          mask={`url(#ekg-mask-${color})`}
          style={{
            strokeDasharray: PATH_LENGTH,
            strokeDashoffset: PATH_LENGTH,
            animation: 'ekgDraw 1.6s linear infinite',
          }}
        />

        {/* 끝 점 (pulse dot) */}
        <circle
          cx="0" cy="50" r="4"
          fill={c.stroke}
          filter={`url(#ekg-glow-${color})`}
          style={{ animation: 'ekgDot 1.6s linear infinite' }}
        />
      </svg>

      {showLabel && (
        <span className={`text-xs font-mono tracking-widest animate-pulse ${c.text}`}>
          로딩 중...
        </span>
      )}

      {/* 인라인 keyframe 주입 */}
      <style>{`
        @keyframes ekgDraw {
          0%   { stroke-dashoffset: ${PATH_LENGTH}; }
          100% { stroke-dashoffset: -${PATH_LENGTH}; }
        }
        @keyframes ekgDot {
          0%   { transform: translateX(0px); opacity: 1; }
          100% { transform: translateX(400px); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
