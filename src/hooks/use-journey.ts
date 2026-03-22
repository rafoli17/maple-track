"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ImmigrationPlan, JourneyPhase, JourneyStep } from "@/types";

interface JourneyData {
  plan: ImmigrationPlan;
  phases: (JourneyPhase & { steps: JourneyStep[] })[];
}

async function fetchJourney(planId: string): Promise<JourneyData> {
  const res = await fetch(`/api/journey?planId=${planId}`);
  if (!res.ok) {
    throw new Error("Failed to fetch journey");
  }
  return res.json();
}

async function updateStep(params: {
  stepId: string;
  status: string;
}): Promise<JourneyStep> {
  const res = await fetch(`/api/journey/steps/${params.stepId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: params.status }),
  });
  if (!res.ok) {
    throw new Error("Failed to update step");
  }
  return res.json();
}

export function useJourney(planId: string | undefined) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["journey", planId],
    queryFn: () => fetchJourney(planId!),
    enabled: !!planId,
  });

  const stepMutation = useMutation({
    mutationFn: updateStep,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journey", planId] });
    },
  });

  return {
    ...query,
    updateStep: stepMutation.mutate,
    updateStepAsync: stepMutation.mutateAsync,
    isUpdatingStep: stepMutation.isPending,
  };
}
