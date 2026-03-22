"use client";

import { cn } from "@/lib/utils";
import { Award } from "lucide-react";

interface CrsProfile {
  name: string;
  totalScore: number;
  breakdown: {
    label: string;
    value: number;
    max: number;
  }[];
}

interface CrsComparisonProps {
  profile1: CrsProfile;
  profile2: CrsProfile;
  className?: string;
}

export function CrsComparison({
  profile1,
  profile2,
  className,
}: CrsComparisonProps) {
  const bestProfile =
    profile1.totalScore >= profile2.totalScore ? profile1 : profile2;

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-4",
        className
      )}
    >
      <h3 className="mb-4 text-sm font-semibold text-foreground">
        Comparacao CRS
      </h3>

      <div className="grid grid-cols-2 gap-6">
        {[profile1, profile2].map((profile) => {
          const isBest = profile.name === bestProfile.name;
          return (
            <div key={profile.name} className="space-y-4">
              <div className="text-center">
                <p className="text-sm font-medium text-foreground-muted">
                  {profile.name}
                </p>
                <p className="mt-1 text-3xl font-bold text-foreground">
                  {profile.totalScore}
                </p>
                {isBest && (
                  <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-semibold text-success">
                    <Award className="h-3 w-3" />
                    Melhor aplicante
                  </span>
                )}
              </div>

              <div className="space-y-2">
                {profile.breakdown.map((item) => {
                  const pct = (item.value / item.max) * 100;
                  return (
                    <div key={item.label}>
                      <div className="flex items-center justify-between text-xs text-foreground-muted">
                        <span>{item.label}</span>
                        <span>
                          {item.value}/{item.max}
                        </span>
                      </div>
                      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-surface">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
