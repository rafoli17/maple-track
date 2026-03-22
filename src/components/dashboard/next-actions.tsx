"use client";

import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Calendar, AlertCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Action {
  id: string;
  title: string;
  dueDate: string;
  priority: "alta" | "media" | "baixa";
  assignee?: {
    name: string;
    avatar?: string;
  };
}

interface NextActionsProps {
  actions: Action[];
  className?: string;
}

const priorityStyles: Record<string, string> = {
  alta: "bg-error/10 text-error",
  media: "bg-warning/10 text-warning",
  baixa: "bg-info/10 text-info",
};

export function NextActions({ actions, className }: NextActionsProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-4",
        className
      )}
    >
      <h3 className="mb-4 text-sm font-semibold text-foreground">
        Proximas Acoes
      </h3>

      <ul className="space-y-3">
        {actions.slice(0, 3).map((action) => (
          <li
            key={action.id}
            className="flex items-start gap-3 rounded-lg border border-border/50 bg-surface p-3"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-foreground-muted" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground">
                {action.title}
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1 text-xs text-foreground-muted">
                  <Calendar className="h-3 w-3" />
                  {formatDate(action.dueDate)}
                </span>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase",
                    priorityStyles[action.priority]
                  )}
                >
                  {action.priority}
                </span>
              </div>
            </div>
            {action.assignee && (
              <Avatar
                src={action.assignee.avatar}
                fallback={action.assignee.name}
                size="sm"
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
