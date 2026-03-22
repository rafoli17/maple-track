"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  FileText,
  Clock,
  TrendingUp,
  AlertTriangle,
  Trophy,
  Calendar,
  CheckCircle2,
  Circle,
} from "lucide-react";

interface NotificationsClientProps {
  notifications: any[];
}

const typeConfig: Record<string, { icon: any; color: string }> = {
  DOCUMENT_EXPIRING: { icon: FileText, color: "text-warning" },
  STEP_DUE: { icon: Clock, color: "text-info" },
  SCORE_UPDATE: { icon: TrendingUp, color: "text-primary" },
  PROGRAM_CHANGE: { icon: AlertTriangle, color: "text-error" },
  MILESTONE: { icon: Trophy, color: "text-warning" },
  REMINDER: { icon: Calendar, color: "text-foreground-muted" },
};

export function NotificationsClient({ notifications }: NotificationsClientProps) {
  const router = useRouter();
  const [marking, setMarking] = React.useState<string | null>(null);

  const unreadCount = notifications.filter((n: any) => !n.isRead).length;

  const markAsRead = async (id: string) => {
    setMarking(id);
    try {
      await fetch(`/api/notifications/${id}/read`, {
        method: "PATCH",
      });
      router.refresh();
    } catch {
      // Error
    } finally {
      setMarking(null);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch("/api/notifications/read-all", {
        method: "PATCH",
      });
      router.refresh();
    } catch {
      // Error
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notificacoes</h1>
          <p className="text-sm text-foreground-muted">
            {unreadCount > 0
              ? `${unreadCount} nao lida${unreadCount > 1 ? "s" : ""}`
              : "Todas lidas"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="rounded-xl border border-border px-4 py-2 text-xs font-medium text-foreground-muted shadow-sm transition-all hover:shadow-md hover:text-foreground"
          >
            Marcar todas como lidas
          </button>
        )}
      </div>

      {notifications.length > 0 ? (
        <ul className="space-y-2">
          {notifications.map((notif: any) => {
            const config =
              typeConfig[notif.type] || { icon: Bell, color: "text-foreground-muted" };
            const Icon = config.icon;
            const isUnread = !notif.isRead;

            return (
              <li
                key={notif.id}
                className={`rounded-2xl p-5 transition-all ${
                  isUnread
                    ? "bg-white shadow-md border-l-4 border-primary"
                    : "bg-white shadow-sm"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface`}
                  >
                    <Icon className={`h-4 w-4 ${config.color}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={`text-sm ${
                          isUnread
                            ? "font-semibold text-foreground"
                            : "font-medium text-foreground-muted"
                        }`}
                      >
                        {notif.title}
                      </p>
                      <button
                        onClick={() => markAsRead(notif.id)}
                        disabled={!isUnread || marking === notif.id}
                        className="shrink-0 p-1"
                      >
                        {isUnread ? (
                          <Circle className="h-3 w-3 text-primary" />
                        ) : (
                          <CheckCircle2 className="h-3 w-3 text-foreground-dim" />
                        )}
                      </button>
                    </div>
                    <p className="mt-0.5 text-xs text-foreground-muted">
                      {notif.message}
                    </p>
                    <div className="mt-2 flex items-center gap-3">
                      {notif.createdAt && (
                        <span className="text-[10px] text-foreground-dim">
                          {new Date(notif.createdAt).toLocaleDateString(
                            "pt-BR",
                            {
                              day: "2-digit",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                      )}
                      {notif.link && (
                        <Link
                          href={notif.link}
                          className="text-[10px] font-medium text-primary hover:text-primary-light"
                        >
                          Ver detalhes
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-16 shadow-sm">
          <Bell className="mb-3 h-10 w-10 text-foreground-dim" />
          <p className="mb-1 text-base font-medium text-foreground">
            Sem notificacoes
          </p>
          <p className="text-sm text-foreground-muted">
            Voce sera notificado sobre prazos, documentos e atualizacoes.
          </p>
        </div>
      )}
    </div>
  );
}
