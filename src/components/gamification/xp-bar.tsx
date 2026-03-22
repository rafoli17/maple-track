"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

interface XpBarProps {
  currentXp: number;
  nextLevelXp: number;
  levelName: string;
  className?: string;
}

export function XpBar({
  currentXp,
  nextLevelXp,
  levelName,
  className,
}: XpBarProps) {
  const pct = Math.min(100, (currentXp / nextLevelXp) * 100);

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
          <Star className="h-3 w-3" />
          {levelName}
        </span>
        <span className="text-xs text-foreground-muted">
          {currentXp} / {nextLevelXp} XP
        </span>
      </div>

      <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface">
        <motion.div
          className="h-full rounded-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
