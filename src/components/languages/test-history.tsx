import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import { Calendar } from "lucide-react";

interface TestAttempt {
  id: string;
  testName: string;
  date: string;
  overallScore: number;
  scores: {
    speaking: number;
    listening: number;
    reading: number;
    writing: number;
  };
}

interface TestHistoryProps {
  attempts: TestAttempt[];
  className?: string;
}

export function TestHistory({ attempts, className }: TestHistoryProps) {
  return (
    <div className={cn("rounded-xl border border-border bg-card", className)}>
      <div className="border-b border-border px-4 py-3">
        <h3 className="text-sm font-semibold text-foreground">
          Historico de Testes
        </h3>
      </div>

      {attempts.length === 0 ? (
        <p className="px-4 py-6 text-center text-sm text-foreground-muted">
          Nenhum teste registrado
        </p>
      ) : (
        <ul className="divide-y divide-border/50">
          {attempts.map((attempt) => (
            <li
              key={attempt.id}
              className="flex items-center justify-between px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium text-foreground">
                  {attempt.testName}
                </p>
                <span className="flex items-center gap-1 text-xs text-foreground-dim">
                  <Calendar className="h-3 w-3" />
                  {formatDate(attempt.date)}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden gap-1 text-xs text-foreground-muted sm:flex">
                  <span>S:{attempt.scores.speaking}</span>
                  <span>L:{attempt.scores.listening}</span>
                  <span>R:{attempt.scores.reading}</span>
                  <span>W:{attempt.scores.writing}</span>
                </div>
                <span className="rounded-lg bg-surface px-2.5 py-1 text-sm font-bold text-foreground">
                  {attempt.overallScore}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
