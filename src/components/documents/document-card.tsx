"use client";

import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { FileText, File, Image, Clock } from "lucide-react";
import { daysUntil, formatDate } from "@/lib/utils";

type DocStatus = "pending" | "uploaded" | "verified" | "expired" | "rejected";

interface DocumentCardProps {
  name: string;
  type: "pdf" | "image" | "other";
  status: DocStatus;
  person?: { name: string; avatar?: string };
  expiryDate?: string;
  className?: string;
}

const statusStyles: Record<DocStatus, { bg: string; text: string; label: string }> = {
  pending: { bg: "bg-warning/10", text: "text-warning", label: "Pendente" },
  uploaded: { bg: "bg-info/10", text: "text-info", label: "Enviado" },
  verified: { bg: "bg-success/10", text: "text-success", label: "Verificado" },
  expired: { bg: "bg-error/10", text: "text-error", label: "Expirado" },
  rejected: { bg: "bg-error/10", text: "text-error", label: "Rejeitado" },
};

const typeIcons = {
  pdf: FileText,
  image: Image,
  other: File,
};

export function DocumentCard({
  name,
  type,
  status,
  person,
  expiryDate,
  className,
}: DocumentCardProps) {
  const s = statusStyles[status];
  const Icon = typeIcons[type];
  const daysLeft = expiryDate ? daysUntil(expiryDate) : null;

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-4",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface">
          <Icon className="h-5 w-5 text-foreground-muted" />
        </div>

        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-medium text-foreground">{name}</h4>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase",
                s.bg,
                s.text
              )}
            >
              {s.label}
            </span>

            {daysLeft !== null && daysLeft > 0 && (
              <span className="flex items-center gap-1 text-xs text-foreground-dim">
                <Clock className="h-3 w-3" />
                {daysLeft} dias
              </span>
            )}

            {expiryDate && (
              <span className="text-xs text-foreground-dim">
                Validade: {formatDate(expiryDate)}
              </span>
            )}
          </div>
        </div>

        {person && (
          <Avatar
            src={person.avatar}
            fallback={person.name}
            size="sm"
          />
        )}
      </div>
    </div>
  );
}
