"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Map,
  Route,
  FileText,
  Languages,
  Calculator,
  Trophy,
  Settings,
  ChevronLeft,
  ChevronRight,
  Compass,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/programs", label: "Programas", icon: Compass },
  { href: "/plans", label: "Meus Planos", icon: Map },
  { href: "/journey", label: "Jornada", icon: Route },
  { href: "/documents", label: "Documentos", icon: FileText },
  { href: "/languages", label: "Idiomas", icon: Languages },
  { href: "/simulator", label: "Simulador CRS", icon: Calculator },
  { href: "/achievements", label: "Conquistas", icon: Trophy },
  { href: "/settings", label: "Configuracoes", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <aside
      className={cn(
        "hidden h-screen flex-col border-r border-sidebar-border bg-sidebar-background transition-all duration-300 md:flex",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-4">
        <svg
          viewBox="0 0 24 24"
          className="h-8 w-8 shrink-0 text-accent"
          fill="currentColor"
        >
          <path d="M12 2C12 2 4 7 4 13c0 3 1.5 5.5 4 7l1-3c-1.5-1-2.5-2.8-2.5-5C6.5 8.5 12 4.5 12 4.5S17.5 8.5 17.5 12c0 2.2-1 4-2.5 5l1 3c2.5-1.5 4-4 4-7C20 7 12 2 12 2z" />
        </svg>
        {!isCollapsed && (
          <span className="text-lg font-bold text-foreground">MapleTrack</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-4">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname?.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="flex h-12 items-center justify-center border-t border-sidebar-border text-sidebar-foreground transition-colors hover:text-foreground"
      >
        {isCollapsed ? (
          <ChevronRight className="h-5 w-5" />
        ) : (
          <ChevronLeft className="h-5 w-5" />
        )}
      </button>
    </aside>
  );
}
