"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Check, Calendar, Circle } from "lucide-react";

type StepStatus = "completed" | "in_progress" | "not_started" | "blocked";

interface StepItemProps {
  title: string;
  status: StepStatus;
  assignee?: { name: string; avatar?: string };
  dueDate?: string;
  priority?: "alta" | "media" | "baixa";
  onToggle?: () => void;
  onClick?: () => void;
  className?: string;
}

const priorityColors: Record<string, string> = {
  alta: "text-error",
  media: "text-warning",
  baixa: "text-info",
};

export function StepItem({
  title,
  status,
  assignee,
  dueDate,
  priority,
  onToggle,
  onClick,
  className,
}: StepItemProps) {
  const isCompleted = status === "completed";

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-surface/50",
        className
      )}
    >
      {/* Checkbox */}
      <button
        onClick={onToggle}
        className={cn(
          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors",
          isCompleted
            ? "border-success bg-success text-success-foreground"
            : "border-border hover:border-primary"
        )}
      >
        {isCompleted && <Check className="h-3 w-3" />}
      </button>

      {/* Content */}
      <button
        onClick={onClick}
        className="min-w-0 flex-1 text-left"
      >
        <p
          className={cn(
            "text-sm font-medium",
            isCompleted
              ? "text-foreground-muted line-through"
              : "text-foreground"
          )}
        >
          {title}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          {dueDate && (
            <span className="flex items-center gap-1 text-xs text-foreground-dim">
              <Calendar className="h-3 w-3" />
              {dueDate}
            </span>
          )}
          {priority && (
            <span
              className={cn(
                "flex items-center gap-1 text-xs",
                priorityColors[priority]
              )}
            >
              <Circle className="h-2 w-2 fill-current" />
              {priority}
            </span>
          )}
        </div>
      </button>

      {/* Assignee */}
      {assignee && (
        <Avatar
          src={assignee.avatar}
          fallback={assignee.name}
          size="sm"
        />
      )}
    </div>
  );
}
