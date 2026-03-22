import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

interface ExpiryAlertProps {
  documentName: string;
  daysLeft: number;
  className?: string;
}

export function ExpiryAlert({ documentName, daysLeft, className }: ExpiryAlertProps) {
  const urgency =
    daysLeft > 90
      ? { color: "text-success", bg: "bg-success/10", border: "border-success/20" }
      : daysLeft > 30
        ? { color: "text-warning", bg: "bg-warning/10", border: "border-warning/20" }
        : { color: "text-error", bg: "bg-error/10", border: "border-error/20" };

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border p-3",
        urgency.bg,
        urgency.border,
        className
      )}
    >
      <Clock className={cn("h-5 w-5 shrink-0", urgency.color)} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">{documentName}</p>
        <p className={cn("text-xs font-semibold", urgency.color)}>
          {daysLeft > 0 ? `${daysLeft} dias restantes` : "Expirado"}
        </p>
      </div>
    </div>
  );
}
