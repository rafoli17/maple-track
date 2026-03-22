"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Document } from "@/types";

async function fetchDocuments(planId?: string): Promise<Document[]> {
  const url = planId ? `/api/documents?planId=${planId}` : "/api/documents";
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch documents");
  }
  return res.json();
}

async function createDocument(
  data: Record<string, unknown>
): Promise<Document> {
  const res = await fetch("/api/documents", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("Failed to create document");
  }
  return res.json();
}

async function updateDocument(params: {
  documentId: string;
  data: Record<string, unknown>;
}): Promise<Document> {
  const res = await fetch(`/api/documents/${params.documentId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params.data),
  });
  if (!res.ok) {
    throw new Error("Failed to update document");
  }
  return res.json();
}

async function deleteDocument(documentId: string): Promise<void> {
  const res = await fetch(`/api/documents/${documentId}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error("Failed to delete document");
  }
}

export function useDocuments(planId?: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["documents", planId],
    queryFn: () => fetchDocuments(planId),
  });

  const createMutation = useMutation({
    mutationFn: createDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });

  return {
    ...query,
    createDocument: createMutation.mutate,
    createDocumentAsync: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateDocument: updateMutation.mutate,
    updateDocumentAsync: updateMutation.mutateAsync,
    isUpdatingDocument: updateMutation.isPending,
    deleteDocument: deleteMutation.mutate,
    deleteDocumentAsync: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
