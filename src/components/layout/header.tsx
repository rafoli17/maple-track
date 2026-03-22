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
    <header className="flex h-16 items-center justify-between border-b border-border/60 bg-white px-4 shadow-sm md:px-6">
      {/* Mobile logo */}
      <div className="flex items-center gap-2 md:hidden">
        <svg
          viewBox="0 0 24 24"
          className="h-7 w-7 text-primary"
          fill="currentColor"
        >
          <path d="M12 2C12 2 4 7 4 13c0 3 1.5 5.5 4 7l1-3c-1.5-1-2.5-2.8-2.5-5C6.5 8.5 12 4.5 12 4.5S17.5 8.5 17.5 12c0 2.2-1 4-2.5 5l1 3c2.5-1.5 4-4 4-7C20 7 12 2 12 2z" />
        </svg>
        <span className="text-base font-bold text-[#222222]">MapleTrack</span>
      </div>

      {/* Search bar - desktop only */}
      <div className="hidden md:flex md:flex-1 md:max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#717171]" />
          <input
            type="text"
            placeholder="Buscar..."
            className="h-10 w-full rounded-full border border-border/80 bg-[#F7F7F7] pl-10 pr-4 text-sm text-[#222222] placeholder:text-[#717171] transition-shadow focus:border-primary/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <Link
          href="/notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-full text-[#717171] transition-colors hover:bg-[#F7F7F7] hover:text-[#222222]"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary ring-2 ring-white" />
        </Link>

        {/* User dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 rounded-full border border-border/60 p-1 pr-3 transition-shadow hover:shadow-md"
          >
            <Avatar
              src={user.image || undefined}
              fallback={displayName}
              size="sm"
            />
            <span className="hidden text-sm font-medium text-[#222222] md:block">
              {displayName}
            </span>
          </button>

          {showDropdown && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowDropdown(false)}
              />
              <div className="absolute right-0 top-full z-50 mt-2 w-52 rounded-xl border border-border/60 bg-white p-1.5 shadow-lg">
                <Link
                  href="/settings"
                  className="block rounded-lg px-3 py-2.5 text-sm text-[#222222] transition-colors hover:bg-[#F7F7F7]"
                  onClick={() => setShowDropdown(false)}
                >
                  Meu Perfil
                </Link>
                <Link
                  href="/settings/household"
                  className="block rounded-lg px-3 py-2.5 text-sm text-[#222222] transition-colors hover:bg-[#F7F7F7]"
                  onClick={() => setShowDropdown(false)}
                >
                  Household
                </Link>
                <hr className="my-1.5 border-border/60" />
                <form action="/api/auth/signout" method="POST">
                  <button
                    type="submit"
                    className="w-full rounded-lg px-3 py-2.5 text-left text-sm text-error transition-colors hover:bg-[#F7F7F7]"
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
