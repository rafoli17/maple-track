"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { HouseholdWithMembers } from "@/types";

async function fetchHousehold(): Promise<HouseholdWithMembers> {
  const res = await fetch("/api/household");
  if (!res.ok) {
    throw new Error("Failed to fetch household");
  }
  return res.json();
}

async function sendInvite(email: string): Promise<{ success: boolean }> {
  const res = await fetch("/api/household/invite", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) {
    throw new Error("Failed to send invite");
  }
  return res.json();
}

export function useHousehold() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["household"],
    queryFn: fetchHousehold,
  });

  const inviteMutation = useMutation({
    mutationFn: sendInvite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["household"] });
    },
  });

  return {
    ...query,
    inviteSpouse: inviteMutation.mutate,
    inviteSpouseAsync: inviteMutation.mutateAsync,
    isInviting: inviteMutation.isPending,
  };
}
