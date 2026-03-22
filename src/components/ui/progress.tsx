"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  color?: string;
  showLabel?: boolean;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, color, showLabel = false, ...props }, ref) => {
    const pct = Math.min(100, Math.max(0, (value / max) * 100));

    return (
      <div className={cn("relative", className)} ref={ref} {...props}>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-border/50">
          <motion.div
            className={cn("h-full rounded-full bg-gradient-to-r", color || "from-primary to-primary-light")}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
        {showLabel && (
          <span className="mt-1 block text-right text-xs text-foreground-muted">
            {Math.round(pct)}%
          </span>
        )}
      </div>
    );
  }
);
Progress.displayName = "Progress";

export { Progress };
