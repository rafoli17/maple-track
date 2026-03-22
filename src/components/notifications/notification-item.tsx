"use client";

import { cn } from "@/lib/utils";
import { FileText, Clock, TrendingUp, AlertTriangle, Trophy, Bell } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";

interface NotificationItemProps {
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  link?: string | null;
  onClick?: () => void;
}

const typeIcons: Record<string, typeof Bell> = {
  DOCUMENT_EXPIRING: FileText,
  STEP_DUE: Clock,
  SCORE_UPDATE: TrendingUp,
  PROGRAM_CHANGE: AlertTriangle,
  MILESTONE: Trophy,
  REMINDER: Bell,
};

export function NotificationItem({ type, title, message, isRead, createdAt, onClick }: NotificationItemProps) {
  const Icon = typeIcons[type] || Bell;

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-start gap-3 rounded-lg p-3 text-left transition-colors hover:bg-surface",
        !isRead && "bg-primary/5"
      )}
    >
      <div className={cn("mt-0.5 rounded-lg p-2", !isRead ? "bg-primary/10 text-primary" : "bg-muted text-foreground-muted")}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 space-y-0.5">
        <div className="flex items-center gap-2">
          <p className={cn("text-sm font-medium", !isRead ? "text-foreground" : "text-foreground-muted")}>{title}</p>
          {!isRead && <div className="h-2 w-2 rounded-full bg-primary" />}
        </div>
        <p className="text-xs text-foreground-dim">{message}</p>
        <p className="text-xs text-foreground-dim">{formatRelativeTime(createdAt)}</p>
      </div>
    </button>
  );
}
