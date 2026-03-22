"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Route,
  FileText,
  Calculator,
  Trophy,
} from "lucide-react";

const mobileNavItems = [
  { href: "/dashboard", label: "Inicio", icon: LayoutDashboard },
  { href: "/journey", label: "Jornada", icon: Route },
  { href: "/documents", label: "Docs", icon: FileText },
  { href: "/simulator", label: "CRS", icon: Calculator },
  { href: "/achievements", label: "Conquistas", icon: Trophy },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 flex h-16 items-center justify-around border-t border-border bg-surface md:hidden">
      {mobileNavItems.map((item) => {
        const isActive =
          pathname === item.href || pathname?.startsWith(item.href + "/");
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 px-2 py-1 text-[10px] font-medium transition-colors",
              isActive
                ? "text-primary"
                : "text-foreground-muted hover:text-foreground"
            )}
          >
            <Icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
