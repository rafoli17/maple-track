import { cn } from "@/lib/utils";

interface MapleLeafProps {
  className?: string;
  size?: number;
}

export function MapleLeaf({ className, size = 32 }: MapleLeafProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
    >
      <path d="M32 2L28.5 12.5L22 8L24.5 17L16 14L20 22L10 20L18 27L8 28L17 32L10 38L20 36L16 44L24 39L22 48L28 42L32 62L36 42L42 48L40 39L48 44L44 36L54 38L47 32L56 28L46 27L54 20L44 22L48 14L39.5 17L42 8L35.5 12.5L32 2Z" />
    </svg>
  );
}
