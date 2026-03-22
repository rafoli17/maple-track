"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { X, CheckCircle2, Clock, AlertCircle, Ban } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type StepStatus = "completed" | "in_progress" | "not_started" | "blocked";

interface StepModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  instructions?: string;
  status: StepStatus;
  assignee?: { name: string; avatar?: string; role?: string };
  onStatusChange?: (status: StepStatus) => void;
}

const statusConfig: Record<
  StepStatus,
  { icon: React.ElementType; label: string; color: string }
> = {
  completed: { icon: CheckCircle2, label: "Concluido", color: "text-success" },
  in_progress: { icon: Clock, label: "Em andamento", color: "text-primary" },
  not_started: { icon: AlertCircle, label: "Pendente", color: "text-foreground-muted" },
  blocked: { icon: Ban, label: "Bloqueado", color: "text-error" },
};

export function StepModal({
  isOpen,
  onClose,
  title,
  description,
  instructions,
  status,
  assignee,
  onStatusChange,
}: StepModalProps) {
  const current = statusConfig[status];
  const StatusIcon = current.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-4 top-[10%] z-50 mx-auto max-w-lg rounded-xl border border-border bg-card shadow-xl sm:inset-x-auto"
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-border p-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  {title}
                </h2>
                <div className="mt-1 flex items-center gap-1.5">
                  <StatusIcon className={cn("h-4 w-4", current.color)} />
                  <span className={cn("text-xs font-medium", current.color)}>
                    {current.label}
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-1 text-foreground-muted hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="space-y-4 p-4">
              <div>
                <h4 className="mb-1 text-xs font-semibold uppercase text-foreground-muted">
                  Descricao
                </h4>
                <p className="text-sm text-foreground">{description}</p>
              </div>

              {instructions && (
                <div>
                  <h4 className="mb-1 text-xs font-semibold uppercase text-foreground-muted">
                    Instrucoes
                  </h4>
                  <p className="text-sm text-foreground whitespace-pre-line">
                    {instructions}
                  </p>
                </div>
              )}

              {assignee && (
                <div>
                  <h4 className="mb-2 text-xs font-semibold uppercase text-foreground-muted">
                    Responsavel
                  </h4>
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={assignee.avatar}
                      fallback={assignee.name}
                      size="default"
                    />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {assignee.name}
                      </p>
                      {assignee.role && (
                        <p className="text-xs text-foreground-muted">
                          {assignee.role}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            {onStatusChange && (
              <div className="flex flex-wrap gap-2 border-t border-border p-4">
                {status !== "completed" && (
                  <Button
                    size="sm"
                    onClick={() => onStatusChange("completed")}
                  >
                    <CheckCircle2 className="mr-1 h-4 w-4" />
                    Marcar Concluido
                  </Button>
                )}
                {status !== "in_progress" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onStatusChange("in_progress")}
                  >
                    <Clock className="mr-1 h-4 w-4" />
                    Em Andamento
                  </Button>
                )}
                {status !== "blocked" && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onStatusChange("blocked")}
                    className="text-error hover:text-error"
                  >
                    <Ban className="mr-1 h-4 w-4" />
                    Bloqueado
                  </Button>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
