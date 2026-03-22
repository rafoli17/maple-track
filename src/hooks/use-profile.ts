"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ProfileWithTests } from "@/types";

async function fetchProfile(): Promise<ProfileWithTests> {
  const res = await fetch("/api/profile");
  if (!res.ok) {
    throw new Error("Failed to fetch profile");
  }
  return res.json();
}

async function updateProfile(
  data: Record<string, unknown>
): Promise<ProfileWithTests> {
  const res = await fetch("/api/profile", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("Failed to update profile");
  }
  return res.json();
}

export function useProfile() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  return {
    ...query,
    updateProfile: mutation.mutate,
    updateProfileAsync: mutation.mutateAsync,
    isUpdating: mutation.isPending,
  };
}
