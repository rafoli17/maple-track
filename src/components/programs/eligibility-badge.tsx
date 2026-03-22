import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

interface EligibilityBadgeProps {
  eligible: boolean;
  className?: string;
}

export function EligibilityBadge({ eligible, className }: EligibilityBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
        eligible
          ? "bg-success/10 text-success"
          : "bg-error/10 text-error",
        className
      )}
    >
      {eligible ? (
        <>
          <Check className="h-3.5 w-3.5" />
          Elegivel
        </>
      ) : (
        <>
          <X className="h-3.5 w-3.5" />
          Nao Elegivel
        </>
      )}
    </span>
  );
}
