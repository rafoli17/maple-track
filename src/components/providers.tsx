"use client";

import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { useState, type ReactNode } from "react";
import { AchievementCelebrationProvider } from "@/components/gamification/achievement-celebration-provider";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <AchievementCelebrationProvider>
          {children}
        </AchievementCelebrationProvider>
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: "var(--card)",
              border: "1px solid var(--border)",
              color: "var(--foreground)",
              fontFamily: "var(--font-sans)",
            },
          }}
          offset={16}
          gap={8}
        />
      </QueryClientProvider>
    </SessionProvider>
  );
}
