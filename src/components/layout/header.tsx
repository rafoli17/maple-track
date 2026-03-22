"use client";

import * as React from "react";
import Link from "next/link";
import { Bell, Search } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";

interface HeaderProps {
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function Header({ user }: HeaderProps) {
  const [showDropdown, setShowDropdown] = React.useState(false);
  const displayName = user.name?.split(" ")[0] || "Usuario";

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-surface px-4 md:px-6">
      {/* Mobile logo */}
      <div className="flex items-center gap-2 md:hidden">
        <svg
          viewBox="0 0 24 24"
          className="h-7 w-7 text-accent"
          fill="currentColor"
        >
          <path d="M12 2C12 2 4 7 4 13c0 3 1.5 5.5 4 7l1-3c-1.5-1-2.5-2.8-2.5-5C6.5 8.5 12 4.5 12 4.5S17.5 8.5 17.5 12c0 2.2-1 4-2.5 5l1 3c2.5-1.5 4-4 4-7C20 7 12 2 12 2z" />
        </svg>
        <span className="text-base font-bold text-foreground">MapleTrack</span>
      </div>

      {/* Search bar - desktop only */}
      <div className="hidden md:flex md:flex-1 md:max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-dim" />
          <input
            type="text"
            placeholder="Buscar..."
            className="h-9 w-full rounded-lg border border-border bg-card pl-9 pr-4 text-sm text-foreground placeholder:text-foreground-dim focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <Link
          href="/notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg text-foreground-muted transition-colors hover:bg-card hover:text-foreground"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent" />
        </Link>

        {/* User dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 rounded-lg p-1 transition-colors hover:bg-card"
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
              <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-lg border border-border bg-popover p-1 shadow-lg">
                <Link
                  href="/settings"
                  className="block rounded-md px-3 py-2 text-sm text-popover-foreground hover:bg-card"
                  onClick={() => setShowDropdown(false)}
                >
                  Meu Perfil
                </Link>
                <Link
                  href="/settings/household"
                  className="block rounded-md px-3 py-2 text-sm text-popover-foreground hover:bg-card"
                  onClick={() => setShowDropdown(false)}
                >
                  Household
                </Link>
                <hr className="my-1 border-border" />
                <form action="/api/auth/signout" method="POST">
                  <button
                    type="submit"
                    className="w-full rounded-md px-3 py-2 text-left text-sm text-error hover:bg-card"
                  >
                    Sair
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
