"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

// ════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════
export interface AchievementCelebrationData {
  name: string;
  description?: string;
  xp?: number;
  level?: number;
  /** "epic" = full 3D trophy + confetti, "normal" = smaller trophy, "minor" = quick flash */
  tier?: "epic" | "normal" | "minor";
}

interface Props {
  data: AchievementCelebrationData | null;
  onClose: () => void;
}

// ════════════════════════════════════════════
// CONFETTI CANVAS
// ════════════════════════════════════════════
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  shape: "rect" | "circle" | "star";
  life: number;
}

const CONFETTI_COLORS = [
  "#FFD700", "#FFA500", "#FF6B6B", "#4ECDC4", "#45B7D1",
  "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8", "#F7DC6F",
  "#BB8FCE", "#85C1E9", "#F8C471", "#82E0AA",
];

function useConfetti(canvasRef: React.RefObject<HTMLCanvasElement | null>, active: boolean) {
  const particles = useRef<Particle[]>([]);
  const animFrame = useRef<number>(0);

  const burst = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const cx = canvas.width / 2;
    const cy = canvas.height * 0.35;

    for (let i = 0; i < 120; i++) {
      const angle = (Math.PI * 2 * i) / 120 + (Math.random() - 0.5) * 0.5;
      const speed = 4 + Math.random() * 10;
      particles.current.push({
        x: cx + (Math.random() - 0.5) * 60,
        y: cy + (Math.random() - 0.5) * 30,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        size: 4 + Math.random() * 8,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        opacity: 1,
        shape: (["rect", "circle", "star"] as const)[Math.floor(Math.random() * 3)],
        life: 1,
      });
    }
  }, [canvasRef]);

  // Secondary softer burst
  const shimmerBurst = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const cx = canvas.width / 2;
    const cy = canvas.height * 0.35;

    for (let i = 0; i < 40; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 4;
      particles.current.push({
        x: cx + (Math.random() - 0.5) * 120,
        y: cy + (Math.random() - 0.5) * 80,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1,
        size: 2 + Math.random() * 4,
        color: "#FFD700",
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 8,
        opacity: 0.8,
        shape: "circle",
        life: 1,
      });
    }
  }, [canvasRef]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !active) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Initial burst
    setTimeout(burst, 400);
    setTimeout(shimmerBurst, 900);
    setTimeout(shimmerBurst, 1600);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15; // gravity
        p.vx *= 0.99;
        p.rotation += p.rotationSpeed;
        p.life -= 0.008;
        p.opacity = Math.max(0, p.life);

        if (p.life <= 0) {
          particles.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;

        if (p.shape === "rect") {
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        } else if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
        } else {
          // Star
          ctx.fillStyle = p.color;
          drawStar(ctx, 0, 0, 5, p.size / 2, p.size / 4);
        }

        ctx.restore();
      }

      animFrame.current = requestAnimationFrame(draw);
    };

    animFrame.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animFrame.current);
      window.removeEventListener("resize", resize);
      particles.current = [];
    };
  }, [active, burst, shimmerBurst, canvasRef]);
}

function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  spikes: number,
  outerR: number,
  innerR: number
) {
  let rot = (Math.PI / 2) * 3;
  const step = Math.PI / spikes;
  ctx.beginPath();
  ctx.moveTo(cx, cy - outerR);
  for (let i = 0; i < spikes; i++) {
    ctx.lineTo(cx + Math.cos(rot) * outerR, cy + Math.sin(rot) * outerR);
    rot += step;
    ctx.lineTo(cx + Math.cos(rot) * innerR, cy + Math.sin(rot) * innerR);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerR);
  ctx.closePath();
  ctx.fill();
}

// ════════════════════════════════════════════
// 3D TROPHY SVG (all CSS, no external assets)
// ════════════════════════════════════════════
function Trophy3D({ tier }: { tier: "epic" | "normal" | "minor" }) {
  const scale = tier === "epic" ? 1 : tier === "normal" ? 0.8 : 0.6;

  return (
    <motion.div
      className="relative"
      style={{
        perspective: "800px",
        transformStyle: "preserve-3d",
      }}
    >
      {/* Glow behind trophy */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255,215,0,0.4) 0%, rgba(255,165,0,0.15) 40%, transparent 70%)",
          filter: "blur(30px)",
          transform: `scale(${scale * 2.2})`,
        }}
        animate={{
          opacity: [0.5, 0.9, 0.5],
          scale: [scale * 2, scale * 2.4, scale * 2],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Light rays */}
      {tier === "epic" && (
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute left-1/2 top-1/2"
              style={{
                width: "2px",
                height: "120px",
                background: "linear-gradient(to bottom, rgba(255,215,0,0.5), transparent)",
                transformOrigin: "top center",
                transform: `rotate(${i * 45}deg)`,
                marginLeft: "-1px",
              }}
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: [0, 0.6, 0.2] }}
              transition={{
                delay: 0.8 + i * 0.05,
                duration: 1.5,
                opacity: { duration: 2.5, repeat: Infinity, repeatType: "reverse" },
              }}
            />
          ))}
        </motion.div>
      )}

      {/* Trophy body */}
      <motion.div
        style={{ transform: `scale(${scale})`, transformStyle: "preserve-3d" }}
        initial={{ rotateY: -30, rotateX: 10, scale: 0, opacity: 0 }}
        animate={{
          rotateY: [null, 0, 15, -5, 0],
          rotateX: [null, 0, -5, 2, 0],
          scale: [null, scale * 1.15, scale],
          opacity: 1,
        }}
        transition={{
          duration: 1.8,
          ease: [0.34, 1.56, 0.64, 1],
          times: [0, 0.4, 0.6, 0.8, 1],
        }}
      >
        <svg
          width="160"
          height="180"
          viewBox="0 0 160 180"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-2xl"
          style={{ filter: "drop-shadow(0 8px 24px rgba(255,170,0,0.35))" }}
        >
          <defs>
            {/* Trophy body gradient */}
            <linearGradient id="trophyGold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFE066" />
              <stop offset="25%" stopColor="#FFD700" />
              <stop offset="50%" stopColor="#FFC200" />
              <stop offset="75%" stopColor="#FFB300" />
              <stop offset="100%" stopColor="#FF9500" />
            </linearGradient>

            {/* Shine gradient */}
            <linearGradient id="trophyShine" x1="0.3" y1="0" x2="0.7" y2="1">
              <stop offset="0%" stopColor="white" stopOpacity="0.5" />
              <stop offset="50%" stopColor="white" stopOpacity="0.05" />
              <stop offset="100%" stopColor="white" stopOpacity="0.2" />
            </linearGradient>

            {/* Base gradient */}
            <linearGradient id="baseGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#B8860B" />
              <stop offset="100%" stopColor="#8B6914" />
            </linearGradient>

            <linearGradient id="baseTop" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#DAA520" />
              <stop offset="100%" stopColor="#B8860B" />
            </linearGradient>

            {/* Star in center */}
            <linearGradient id="starGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFF8DC" />
              <stop offset="100%" stopColor="#FFD700" />
            </linearGradient>
          </defs>

          {/* Base bottom */}
          <rect x="35" y="160" width="90" height="12" rx="3" fill="url(#baseGrad)" />

          {/* Base middle */}
          <rect x="45" y="148" width="70" height="14" rx="3" fill="url(#baseTop)" />

          {/* Stem */}
          <rect x="70" y="115" width="20" height="35" rx="4" fill="url(#trophyGold)" />
          <rect x="70" y="115" width="10" height="35" rx="4" fill="url(#trophyShine)" />

          {/* Cup body */}
          <path
            d="M30 20 C30 20, 32 100, 65 115 L95 115 C128 100, 130 20, 130 20 Z"
            fill="url(#trophyGold)"
          />
          <path
            d="M30 20 C30 20, 32 100, 65 115 L80 115 C80 115, 55 98, 50 20 Z"
            fill="url(#trophyShine)"
          />

          {/* Cup rim */}
          <ellipse cx="80" cy="20" rx="52" ry="12" fill="url(#trophyGold)" />
          <ellipse cx="80" cy="20" rx="52" ry="12" fill="url(#trophyShine)" />
          <ellipse cx="80" cy="20" rx="44" ry="8" fill="#B8860B" opacity="0.3" />

          {/* Left handle */}
          <path
            d="M30 35 C10 35, 5 55, 15 70 C22 80, 30 75, 32 65"
            stroke="url(#trophyGold)"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />

          {/* Right handle */}
          <path
            d="M130 35 C150 35, 155 55, 145 70 C138 80, 130 75, 128 65"
            stroke="url(#trophyGold)"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />

          {/* Star emblem */}
          <polygon
            points="80,50 86,66 104,66 90,76 95,92 80,82 65,92 70,76 56,66 74,66"
            fill="url(#starGrad)"
            opacity="0.9"
          />

          {/* Highlight reflection */}
          <ellipse cx="62" cy="55" rx="6" ry="18" fill="white" opacity="0.15" transform="rotate(-15, 62, 55)" />
        </svg>
      </motion.div>

      {/* Floating sparkles */}
      {[...Array(tier === "epic" ? 12 : tier === "normal" ? 6 : 3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            width: 4 + Math.random() * 4,
            height: 4 + Math.random() * 4,
            borderRadius: "50%",
            background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
            left: `${20 + Math.random() * 60}%`,
            top: `${15 + Math.random() * 60}%`,
            boxShadow: `0 0 ${4 + Math.random() * 6}px ${CONFETTI_COLORS[i % CONFETTI_COLORS.length]}`,
          }}
          animate={{
            y: [0, -15 - Math.random() * 20, 0],
            x: [(Math.random() - 0.5) * 10, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 10],
            opacity: [0, 1, 0],
            scale: [0.5, 1.2, 0.5],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: 0.5 + i * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </motion.div>
  );
}

// ════════════════════════════════════════════
// MAIN CELEBRATION COMPONENT
// ════════════════════════════════════════════
export function AchievementCelebration({ data, onClose }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tier = data?.tier || "normal";

  useConfetti(canvasRef, !!data);

  // Auto-close after duration based on tier
  useEffect(() => {
    if (!data) return;
    const duration = tier === "epic" ? 7000 : tier === "normal" ? 5000 : 3500;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [data, tier, onClose]);

  // ESC to close
  useEffect(() => {
    if (!data) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [data, onClose]);

  return (
    <AnimatePresence>
      {data && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Confetti canvas — above backdrop, above modal */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none"
            style={{ zIndex: 30 }}
          />

          {/* Modal card */}
          <motion.div
            className="relative z-20 w-full max-w-sm rounded-3xl border border-white/10 bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f0f23] shadow-2xl overflow-hidden"
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 30 }}
            transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
          >
            {/* Inner glow top edge */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />

            {/* Close button */}
            <motion.button
              className="absolute top-3 right-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/70 transition-colors"
              onClick={onClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="h-4 w-4" />
            </motion.button>

            {/* Modal content */}
            <div className="flex flex-col items-center px-6 pt-8 pb-7">
              {/* Trophy */}
              <div className="relative flex items-center justify-center" style={{ width: 200, height: 200 }}>
                <Trophy3D tier={tier} />
              </div>

              {/* Title: "CONQUISTA DESBLOQUEADA" */}
              <motion.div
                className="mt-1 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <motion.p
                  className="text-[11px] sm:text-xs font-bold tracking-[0.25em] uppercase text-amber-400/90"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Conquista Desbloqueada
                </motion.p>
              </motion.div>

              {/* Divider */}
              <motion.div
                className="mt-3 h-px w-16 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              />

              {/* Achievement name */}
              <motion.h2
                className="mt-3 text-center text-xl sm:text-2xl font-bold text-white"
                initial={{ opacity: 0, y: 15, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.9, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
              >
                {data.name}
              </motion.h2>

              {/* Description */}
              {data.description && (
                <motion.p
                  className="mt-2 text-center text-sm text-white/60 max-w-xs"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1, duration: 0.4 }}
                >
                  {data.description}
                </motion.p>
              )}

              {/* XP badge */}
              {data.xp && (
                <motion.div
                  className="mt-5 flex items-center gap-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3, duration: 0.4 }}
                >
                  <motion.div
                    className="rounded-full bg-gradient-to-r from-amber-500/15 to-amber-600/15 border border-amber-400/25 px-5 py-2"
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className="text-sm font-bold text-amber-300">
                      +{data.xp} XP
                    </span>
                  </motion.div>
                </motion.div>
              )}

              {/* Level indicator */}
              {data.level && (
                <motion.div
                  className="mt-2"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.5, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
                >
                  <span className="text-xs text-amber-200/50">
                    Nivel {data.level}
                  </span>
                </motion.div>
              )}

              {/* Motivational line */}
              <motion.p
                className="mt-5 text-center text-[11px] text-white/30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8, duration: 0.5 }}
              >
                Continue avancando na sua jornada!
              </motion.p>
            </div>

            {/* Bottom glow edge */}
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-400/20 to-transparent" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
