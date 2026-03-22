"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CheckCheck } from "lucide-react";
import { NotificationItem } from "./notification-item";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  link?: string | null;
}

interface NotificationCenterProps {
  notifications: Notification[];
  onMarkAllRead?: () => void;
  onMarkRead?: (id: string) => void;
  className?: string;
}

export function NotificationCenter({
  notifications,
  onMarkAllRead,
  onMarkRead,
  className,
}: NotificationCenterProps) {
  const unread = notifications.filter((n) => !n.isRead);
  const read = notifications.filter((n) => n.isRead);

  return (
    <div className={cn("rounded-xl border border-border bg-card", className)}>
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold text-foreground">
          Notificacoes
          {unread.length > 0 && (
            <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground">
              {unread.length}
            </span>
          )}
        </h2>
        {unread.length > 0 && (
          <Button variant="ghost" size="sm" onClick={onMarkAllRead}>
            <CheckCheck className="mr-1 h-4 w-4" />
            Marcar todas como lidas
          </Button>
        )}
      </div>

      <div className="max-h-[60vh] overflow-y-auto">
        {unread.length > 0 && (
          <div>
            <p className="px-4 pt-3 text-[10px] font-semibold uppercase text-foreground-dim">
              Novas
            </p>
            {unread.map((n) => (
              <NotificationItem
                key={n.id}
                type={n.type}
                title={n.title}
                message={n.message}
                isRead={n.isRead}
                createdAt={n.createdAt}
                onClick={() => onMarkRead?.(n.id)}
              />
            ))}
          </div>
        )}

        {read.length > 0 && (
          <div>
            <p className="px-4 pt-3 text-[10px] font-semibold uppercase text-foreground-dim">
              Anteriores
            </p>
            {read.map((n) => (
              <NotificationItem
                key={n.id}
                type={n.type}
                title={n.title}
                message={n.message}
                isRead={n.isRead}
                createdAt={n.createdAt}
              />
            ))}
          </div>
        )}

        {notifications.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-foreground-muted">
            Nenhuma notificacao
          </p>
        )}
      </div>
    </div>
  );
}
