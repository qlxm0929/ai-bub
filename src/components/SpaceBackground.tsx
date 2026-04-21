'use client';

import { useEffect, useRef } from 'react';

export default function SpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = window.innerWidth;
    let height = document.documentElement.scrollHeight;

    const resize = () => {
      width = window.innerWidth;
      height = document.documentElement.scrollHeight;
      canvas.width = width;
      canvas.height = height;
    };
    resize();
    window.addEventListener('resize', resize);

    // ── 별 생성 ──────────────────────────────
    const STAR_COUNT = 220;
    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.6 + 0.2,
      alpha: Math.random(),
      speed: Math.random() * 0.008 + 0.002,
      dir: Math.random() > 0.5 ? 1 : -1,
      // 색조: 흰색, 연보라, 연시안
      hue: [0, 270, 190][Math.floor(Math.random() * 3)],
      sat: Math.random() > 0.6 ? 80 : 0,
    }));

    // ── 유성 ─────────────────────────────────
    interface Meteor {
      x: number; y: number;
      vx: number; vy: number;
      len: number; alpha: number; life: number; maxLife: number;
    }
    let meteors: Meteor[] = [];

    const spawnMeteor = () => {
      const startX = Math.random() * width;
      const angle = Math.PI / 5 + Math.random() * 0.3;
      const speed = 8 + Math.random() * 6;
      meteors.push({
        x: startX, y: -20,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        len: 80 + Math.random() * 80,
        alpha: 0,
        life: 0,
        maxLife: 60 + Math.random() * 40,
      });
    };

    // 2~5초마다 유성
    let meteorTimer = 0;
    let nextMeteor = 120 + Math.random() * 180;

    // ── 성운 (고정 블롭) ──────────────────────
    const nebulae = [
      { x: 0.15, y: 0.1,  r: 0.28, color: 'rgba(124,58,237,0.045)' },
      { x: 0.80, y: 0.25, r: 0.22, color: 'rgba(34,211,238,0.035)' },
      { x: 0.50, y: 0.60, r: 0.30, color: 'rgba(139,92,246,0.03)'  },
      { x: 0.10, y: 0.80, r: 0.20, color: 'rgba(6,182,212,0.03)'   },
      { x: 0.85, y: 0.75, r: 0.24, color: 'rgba(167,139,250,0.04)' },
    ];

    const drawNebulae = () => {
      nebulae.forEach(n => {
        const gx = ctx.createRadialGradient(
          n.x * width, n.y * height, 0,
          n.x * width, n.y * height, n.r * width,
        );
        gx.addColorStop(0, n.color);
        gx.addColorStop(1, 'transparent');
        ctx.fillStyle = gx;
        ctx.beginPath();
        ctx.arc(n.x * width, n.y * height, n.r * width, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    // ── 메인 루프 ────────────────────────────
    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // 배경 그라디언트
      const bg = ctx.createLinearGradient(0, 0, 0, height);
      bg.addColorStop(0,   '#000000');
      bg.addColorStop(0.4, '#03000d');
      bg.addColorStop(1,   '#000509');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      // 성운
      drawNebulae();

      // 별 그리기 + 반짝임
      stars.forEach(s => {
        s.alpha += s.speed * s.dir;
        if (s.alpha >= 1)   { s.alpha = 1;   s.dir = -1; }
        if (s.alpha <= 0.1) { s.alpha = 0.1; s.dir = 1;  }

        ctx.save();
        ctx.globalAlpha = s.alpha;
        ctx.fillStyle = s.sat > 0
          ? `hsl(${s.hue},${s.sat}%,90%)`
          : '#ffffff';
        ctx.shadowColor = s.sat > 0
          ? `hsl(${s.hue},80%,80%)`
          : '#aaaaff';
        ctx.shadowBlur = s.r * 3;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // 유성
      meteorTimer++;
      if (meteorTimer >= nextMeteor) {
        spawnMeteor();
        meteorTimer = 0;
        nextMeteor = 120 + Math.random() * 180;
      }

      meteors = meteors.filter(m => m.life < m.maxLife);
      meteors.forEach(m => {
        m.life++;
        m.x += m.vx;
        m.y += m.vy;

        // 페이드인/아웃
        const progress = m.life / m.maxLife;
        m.alpha = progress < 0.2
          ? progress / 0.2
          : progress > 0.7
            ? 1 - (progress - 0.7) / 0.3
            : 1;

        const tailX = m.x - m.vx * (m.len / 10);
        const tailY = m.y - m.vy * (m.len / 10);

        const grad = ctx.createLinearGradient(tailX, tailY, m.x, m.y);
        grad.addColorStop(0, 'transparent');
        grad.addColorStop(0.7, `rgba(167,139,250,${m.alpha * 0.6})`);
        grad.addColorStop(1,   `rgba(255,255,255,${m.alpha})`);

        ctx.save();
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.shadowColor = 'rgba(167,139,250,0.8)';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(m.x, m.y);
        ctx.stroke();
        ctx.restore();
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}
