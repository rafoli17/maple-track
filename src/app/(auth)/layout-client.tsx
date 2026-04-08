"use client";

import * as React from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";

interface AuthLayoutClientProps {
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  children: React.ReactNode;
}

export function AuthLayoutClient({ user, children }: AuthLayoutClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F7F7F7]">
      {/* Sidebar - hidden on mobile */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Header */}
        <Header
          user={user}
          onMenuToggle={() => setMobileMenuOpen(true)}
        />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6">
          {children}
        </main>
      </div>

      {/* Mobile slide-out navigation */}
      <MobileNav
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </div>
  );
}
