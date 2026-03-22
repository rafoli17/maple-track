import { cn } from "@/lib/utils";
import { Flame } from "lucide-react";

interface StreakCounterProps {
  count: number;
  className?: string;
}

export function StreakCounter({ count, className }: StreakCounterProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full bg-warning/10 px-4 py-2",
        className
      )}
    >
      <Flame
        className={cn(
          "h-5 w-5",
          count > 0 ? "text-warning" : "text-foreground-dim"
        )}
      />
      <div>
        <span className="text-lg font-bold text-foreground">{count}</span>
        <span className="ml-1 text-xs text-foreground-muted">
          {count === 1 ? "dia consecutivo" : "dias consecutivos"}
        </span>
      </div>
    </div>
  );
}
