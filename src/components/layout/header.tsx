"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  Search,
  Menu,
  FileText,
  Clock,
  TrendingUp,
  AlertTriangle,
  Trophy,
  Calendar,
  CheckCircle2,
  Circle,
  ChevronRight,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { Avatar } from "@/components/ui/avatar";

interface HeaderProps {
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  onMenuToggle?: () => void;
}

// ────────────────────────────────────────
// Notification type config
// ────────────────────────────────────────
const typeConfig: Record<string, { icon: typeof Bell; color: string; bg: string }> = {
  DOCUMENT_EXPIRING: { icon: FileText, color: "text-warning", bg: "bg-warning/10" },
  STEP_DUE: { icon: Clock, color: "text-info", bg: "bg-info/10" },
  SCORE_UPDATE: { icon: TrendingUp, color: "text-primary", bg: "bg-primary/10" },
  PROGRAM_CHANGE: { icon: AlertTriangle, color: "text-error", bg: "bg-error/10" },
  MILESTONE: { icon: Trophy, color: "text-warning", bg: "bg-warning/10" },
  REMINDER: { icon: Calendar, color: "text-accent", bg: "bg-accent/10" },
};

function formatTimeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "agora";
  if (mins < 60) return `${mins}min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return new Date(dateStr).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

export function Header({ user, onMenuToggle }: HeaderProps) {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [notifications, setNotifications] = React.useState<any[]>([]);
  const [loadingNotifs, setLoadingNotifs] = React.useState(false);
  const [hasFetched, setHasFetched] = React.useState(false);
  const displayName = user.name?.split(" ")[0] || "Usuario";
  const notifRef = React.useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Fetch notifications when dropdown opens
  const openNotifications = React.useCallback(async () => {
    setShowNotifications(true);
    setShowDropdown(false);
    if (!hasFetched) {
      setLoadingNotifs(true);
      try {
        const res = await fetch("/api/notifications");
        if (res.ok) {
          const data = await res.json();
          setNotifications(data);
        }
      } catch {
        // silent
      } finally {
        setLoadingNotifs(false);
        setHasFetched(true);
      }
    }
  }, [hasFetched]);

  // Close dropdown on outside click
  React.useEffect(() => {
    if (!showNotifications) return;
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showNotifications]);

  // Mark single notification as read
  const markAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true, readAt: new Date().toISOString() } : n))
    );
    try {
      await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationIds: [id] }),
      });
    } catch {
      // silent
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    const unreadIds = notifications.filter((n) => !n.isRead).map((n) => n.id);
    if (unreadIds.length === 0) return;
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, isRead: true, readAt: new Date().toISOString() }))
    );
    try {
      await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationIds: unreadIds }),
      });
    } catch {
      // silent
    }
  };

  const previewNotifications = notifications.slice(0, 5);

  return (
    <header className="flex h-14 items-center justify-between border-b border-border/60 bg-white px-4 shadow-sm md:h-16 md:px-6">
      {/* Mobile: hamburger + logo */}
      <div className="flex items-center gap-3 md:hidden">
        <button
          onClick={onMenuToggle}
          className="flex h-9 w-9 items-center justify-center rounded-xl text-foreground-muted hover:bg-surface hover:text-foreground transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6 text-primary"
          fill="currentColor"
        >
          <path d="M12 2C12 2 4 7 4 13c0 3 1.5 5.5 4 7l1-3c-1.5-1-2.5-2.8-2.5-5C6.5 8.5 12 4.5 12 4.5S17.5 8.5 17.5 12c0 2.2-1 4-2.5 5l1 3c2.5-1.5 4-4 4-7C20 7 12 2 12 2z" />
        </svg>
        <span className="text-sm font-bold text-foreground">MapleTrack</span>
      </div>

      {/* Search bar - desktop only */}
      <div className="hidden md:flex md:flex-1 md:max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted" />
          <input
            type="text"
            placeholder="Buscar..."
            className="h-10 w-full rounded-full border border-border/80 bg-surface pl-10 pr-4 text-sm text-foreground placeholder:text-foreground-muted transition-shadow focus:border-primary/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-1.5">
        {/* Notifications dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={openNotifications}
            className="relative flex h-9 w-9 items-center justify-center rounded-full text-foreground-muted transition-colors hover:bg-surface hover:text-foreground"
          >
            <Bell className="h-[18px] w-[18px]" />
            {(unreadCount > 0 || !hasFetched) && (
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-white" />
            )}
          </button>

          {/* Notification dropdown panel */}
          {showNotifications && (
            <div className="absolute right-0 top-full z-50 mt-2 w-80 sm:w-96 rounded-2xl border border-border/60 bg-white shadow-xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border/40 px-4 py-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-foreground">Notificacoes</h3>
                  {unreadCount > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-white">
                      {unreadCount}
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[11px] font-medium text-primary hover:text-primary-light transition-colors"
                  >
                    Marcar todas como lidas
                  </button>
                )}
              </div>

              {/* Notification list */}
              <div className="max-h-[360px] overflow-y-auto">
                {loadingNotifs ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  </div>
                ) : previewNotifications.length > 0 ? (
                  <div className="py-1">
                    {previewNotifications.map((notif) => {
                      const config = typeConfig[notif.type] || {
                        icon: Bell,
                        color: "text-foreground-muted",
                        bg: "bg-surface",
                      };
                      const Icon = config.icon;
                      const isUnread = !notif.isRead;

                      return (
                        <button
                          key={notif.id}
                          onClick={() => {
                            if (isUnread) markAsRead(notif.id);
                            if (notif.link) {
                              setShowNotifications(false);
                              router.push(notif.link);
                            }
                          }}
                          className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-surface/80 ${
                            isUnread ? "bg-primary/[0.03]" : ""
                          }`}
                        >
                          <div
                            className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                              isUnread ? config.bg : "bg-surface"
                            }`}
                          >
                            <Icon
                              className={`h-3.5 w-3.5 ${
                                isUnread ? config.color : "text-foreground-dim"
                              }`}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <p
                                className={`text-xs leading-snug ${
                                  isUnread
                                    ? "font-semibold text-foreground"
                                    : "font-medium text-foreground-muted"
                                }`}
                              >
                                {notif.title}
                              </p>
                              {isUnread && (
                                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                              )}
                            </div>
                            <p className="mt-0.5 text-[11px] text-foreground-dim line-clamp-2">
                              {notif.message}
                            </p>
                            <p className="mt-1 text-[10px] text-foreground-dim/70">
                              {formatTimeAgo(notif.createdAt)}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 px-4">
                    <Bell className="mb-2 h-8 w-8 text-foreground-dim/40" />
                    <p className="text-xs font-medium text-foreground-muted">
                      Sem notificacoes
                    </p>
                    <p className="mt-0.5 text-[11px] text-foreground-dim">
                      Voce sera notificado sobre prazos e atualizacoes.
                    </p>
                  </div>
                )}
              </div>

              {/* Footer: See all */}
              <div className="border-t border-border/40">
                <Link
                  href="/notifications"
                  onClick={() => setShowNotifications(false)}
                  className="flex items-center justify-center gap-1.5 py-3 text-xs font-semibold text-primary hover:text-primary-light transition-colors hover:bg-surface/50"
                >
                  Ver todas as notificacoes
                  <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowDropdown(!showDropdown);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 rounded-full border border-border/60 p-1 pr-1 md:pr-3 transition-shadow hover:shadow-md"
          >
            <Avatar
              src={user.image || undefined}
              fallback={displayName}
              size="sm"
            />
            <span className="hidden text-sm font-medium text-foreground md:block">
              {displayName}
            </span>
          </button>

          {showDropdown && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowDropdown(false)}
              />
              <div className="absolute right-0 top-full z-50 mt-2 w-48 sm:w-52 rounded-xl border border-border/60 bg-white p-1.5 shadow-lg">
                <Link
                  href="/settings"
                  className="block rounded-lg px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-surface"
                  onClick={() => setShowDropdown(false)}
                >
                  Meu Perfil
                </Link>
                <Link
                  href="/settings/household"
                  className="block rounded-lg px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-surface"
                  onClick={() => setShowDropdown(false)}
                >
                  Familia
                </Link>
                <hr className="my-1.5 border-border/60" />
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="w-full rounded-lg px-3 py-2.5 text-left text-sm text-error transition-colors hover:bg-surface"
                >
                  Sair
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
