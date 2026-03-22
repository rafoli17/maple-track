import { cn } from "@/lib/utils";
import { Lock } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface AchievementCardProps {
  icon: React.ReactNode;
  name: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: string;
  className?: string;
}

export function AchievementCard({
  icon,
  name,
  description,
  unlocked,
  unlockedAt,
  className,
}: AchievementCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-xl border p-4 transition-colors",
        unlocked
          ? "border-primary/30 bg-card"
          : "border-border bg-card opacity-60 grayscale",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl",
            unlocked ? "bg-primary/10" : "bg-surface"
          )}
        >
          {unlocked ? icon : <Lock className="h-5 w-5 text-foreground-dim" />}
        </div>

        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-semibold text-foreground">{name}</h4>
          <p className="mt-0.5 text-xs text-foreground-muted">{description}</p>
          {unlocked && unlockedAt && (
            <p className="mt-1 text-[10px] text-foreground-dim">
              Desbloqueado em {formatDate(unlockedAt)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
