"use client";

import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Check, Circle } from "lucide-react";

interface DocumentItem {
  id: string;
  name: string;
  done: boolean;
}

interface PersonDocuments {
  personName: string;
  documents: DocumentItem[];
}

interface DocumentChecklistProps {
  persons: PersonDocuments[];
  className?: string;
}

export function DocumentChecklist({ persons, className }: DocumentChecklistProps) {
  return (
    <div className={cn("grid gap-6 sm:grid-cols-2", className)}>
      {persons.map((person) => {
        const total = person.documents.length;
        const done = person.documents.filter((d) => d.done).length;
        const pct = total > 0 ? (done / total) * 100 : 0;

        return (
          <div
            key={person.personName}
            className="rounded-xl border border-border bg-card p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">
                {person.personName}
              </h3>
              <span className="text-xs text-foreground-muted">
                {done}/{total}
              </span>
            </div>

            <Progress value={pct} className="mb-4" />

            <ul className="space-y-2">
              {person.documents.map((doc) => (
                <li key={doc.id} className="flex items-center gap-2">
                  {doc.done ? (
                    <Check className="h-4 w-4 shrink-0 text-success" />
                  ) : (
                    <Circle className="h-4 w-4 shrink-0 text-foreground-dim" />
                  )}
                  <span
                    className={cn(
                      "text-sm",
                      doc.done
                        ? "text-foreground-muted line-through"
                        : "text-foreground"
                    )}
                  >
                    {doc.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
