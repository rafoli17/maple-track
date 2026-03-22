"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  icon: React.ReactNode;
  name: string;
  description?: string;
}

const confettiColors = [
  "bg-primary",
  "bg-accent",
  "bg-success",
  "bg-warning",
  "bg-info",
];

function ConfettiPiece({ index }: { index: number }) {
  const color = confettiColors[index % confettiColors.length];
  const left = Math.random() * 100;
  const delay = Math.random() * 0.5;
  const duration = 1 + Math.random() * 1.5;

  return (
    <motion.div
      className={`absolute h-2 w-2 rounded-full ${color}`}
      style={{ left: `${left}%`, top: 0 }}
      initial={{ y: -10, opacity: 1, rotate: 0 }}
      animate={{
        y: 300,
        opacity: 0,
        rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
        x: (Math.random() - 0.5) * 200,
      }}
      transition={{
        duration,
        delay,
        ease: "easeOut",
      }}
    />
  );
}

export function CelebrationModal({
  isOpen,
  onClose,
  icon,
  name,
  description,
}: CelebrationModalProps) {
  React.useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            onClick={onClose}
          >
            <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 text-center shadow-2xl">
              {/* Confetti */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                {Array.from({ length: 20 }).map((_, i) => (
                  <ConfettiPiece key={i} index={i} />
                ))}
              </div>

              {/* Content */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="relative z-10"
              >
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-4xl">
                  {icon}
                </div>
                <h2 className="text-xl font-bold text-foreground">{name}</h2>
                {description && (
                  <p className="mt-2 text-sm text-foreground-muted">
                    {description}
                  </p>
                )}
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
