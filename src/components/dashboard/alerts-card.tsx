"use client";

import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  Info,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";

interface Alert {
  id: string;
  type: "warning" | "info" | "success" | "error";
  title: string;
  createdAt: string;
}

interface AlertsCardProps {
  alerts: Alert[];
  className?: string;
}

const alertConfig: Record<
  string,
  { icon: React.ElementType; color: string }
> = {
  warning: { icon: AlertTriangle, color: "text-warning" },
  info: { icon: Info, color: "text-info" },
  success: { icon: CheckCircle2, color: "text-success" },
  error: { icon: XCircle, color: "text-error" },
};

export function AlertsCard({ alerts, className }: AlertsCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-4",
        className
      )}
    >
      <h3 className="mb-4 text-sm font-semibold text-foreground">
        Alertas Recentes
      </h3>

      <ul className="space-y-3">
        {alerts.map((alert) => {
          const config = alertConfig[alert.type];
          const Icon = config.icon;

          return (
            <li key={alert.id} className="flex items-start gap-3">
              <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", config.color)} />
              <div className="min-w-0 flex-1">
                <p className="text-sm text-foreground">{alert.title}</p>
                <p className="mt-0.5 text-xs text-foreground-dim">
                  {formatRelativeTime(alert.createdAt)}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
