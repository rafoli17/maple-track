"use client";

import { useQuery } from "@tanstack/react-query";
import type { Achievement } from "@/types";

async function fetchAchievements(): Promise<Achievement[]> {
  const res = await fetch("/api/achievements");
  if (!res.ok) {
    throw new Error("Failed to fetch achievements");
  }
  return res.json();
}

export function useAchievements() {
  const query = useQuery({
    queryKey: ["achievements"],
    queryFn: fetchAchievements,
  });

  return {
    ...query,
  };
}
