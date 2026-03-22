// ════════════════════════════════════════════
// MapleTrack Design Tokens — Single Source of Truth
// Paleta "Aurora Boreal" — Dark-mode first
// ════════════════════════════════════════════

export interface DesignTokens {
  colors: {
    // Base — Dark backgrounds
    background: string;
    surface: string;
    card: string;
    border: string;
    borderLight: string;

    // Primary — Teal (Canada northern lights)
    primary: string;
    primaryLight: string;
    primaryDark: string;
    primaryForeground: string;

    // Accent — Maple Red (Canada identity)
    accent: string;
    accentLight: string;
    accentForeground: string;

    // Semantic
    success: string;
    successForeground: string;
    warning: string;
    warningForeground: string;
    error: string;
    errorForeground: string;
    info: string;
    infoForeground: string;

    // Text
    foreground: string;
    foregroundMuted: string;
    foregroundDim: string;

    // Interactive
    ring: string;
    input: string;
    inputForeground: string;

    // Destructive
    destructive: string;
    destructiveForeground: string;

    // Muted
    muted: string;
    mutedForeground: string;

    // Popover / Dropdown
    popover: string;
    popoverForeground: string;

    // Secondary
    secondary: string;
    secondaryForeground: string;
  };

  sidebar: {
    background: string;
    foreground: string;
    border: string;
    primary: string;
    primaryForeground: string;
    accent: string;
    accentForeground: string;
    ring: string;
  };

  radius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };

  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    "2xl": string;
    "3xl": string;
  };

  typography: {
    fontSans: string;
    fontHeading: string;
    fontMono: string;
    sizes: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      "2xl": string;
      "3xl": string;
      "4xl": string;
      "5xl": string;
    };
    weights: {
      normal: string;
      medium: string;
      semibold: string;
      bold: string;
      extrabold: string;
    };
    lineHeights: {
      tight: string;
      normal: string;
      relaxed: string;
    };
  };
}

export const tokens: DesignTokens = {
  colors: {
    // Base — Slate deep
    background: "#020617", // slate-950
    surface: "#0F172A", // slate-900
    card: "#1E293B", // slate-800
    border: "#334155", // slate-700
    borderLight: "#475569", // slate-600

    // Primary — Teal (Aurora boreal)
    primary: "#0D9488", // teal-600
    primaryLight: "#14B8A6", // teal-500
    primaryDark: "#0F766E", // teal-700
    primaryForeground: "#F0FDFA", // teal-50

    // Accent — Maple Red
    accent: "#E11D48", // rose-600
    accentLight: "#FB7185", // rose-400
    accentForeground: "#FFF1F2", // rose-50

    // Semantic
    success: "#10B981", // emerald-500
    successForeground: "#ECFDF5", // emerald-50
    warning: "#F59E0B", // amber-500
    warningForeground: "#FFFBEB", // amber-50
    error: "#EF4444", // red-500
    errorForeground: "#FEF2F2", // red-50
    info: "#38BDF8", // sky-400
    infoForeground: "#F0F9FF", // sky-50

    // Text
    foreground: "#F1F5F9", // slate-100
    foregroundMuted: "#94A3B8", // slate-400
    foregroundDim: "#64748B", // slate-500

    // Interactive
    ring: "#0D9488", // teal-600
    input: "#334155", // slate-700
    inputForeground: "#F1F5F9", // slate-100

    // Destructive
    destructive: "#EF4444", // red-500
    destructiveForeground: "#FEF2F2", // red-50

    // Muted
    muted: "#1E293B", // slate-800
    mutedForeground: "#94A3B8", // slate-400

    // Popover
    popover: "#1E293B", // slate-800
    popoverForeground: "#F1F5F9", // slate-100

    // Secondary
    secondary: "#1E293B", // slate-800
    secondaryForeground: "#F1F5F9", // slate-100
  },

  sidebar: {
    background: "#0F172A", // slate-900
    foreground: "#94A3B8", // slate-400
    border: "#1E293B", // slate-800
    primary: "#14B8A6", // teal-500
    primaryForeground: "#F0FDFA", // teal-50
    accent: "#1E293B", // slate-800
    accentForeground: "#F1F5F9", // slate-100
    ring: "#0D9488", // teal-600
  },

  radius: {
    sm: "0.375rem", // 6px
    md: "0.5rem", // 8px
    lg: "0.75rem", // 12px
    xl: "1rem", // 16px
    full: "9999px",
  },

  spacing: {
    xs: "0.25rem", // 4px
    sm: "0.5rem", // 8px
    md: "1rem", // 16px
    lg: "1.5rem", // 24px
    xl: "2rem", // 32px
    "2xl": "3rem", // 48px
    "3xl": "4rem", // 64px
  },

  typography: {
    fontSans: '"Inter", ui-sans-serif, system-ui, sans-serif',
    fontHeading: '"Inter", ui-sans-serif, system-ui, sans-serif',
    fontMono:
      '"JetBrains Mono", ui-monospace, SFMono-Regular, "Menlo", monospace',
    sizes: {
      xs: "0.75rem", // 12px
      sm: "0.875rem", // 14px
      base: "1rem", // 16px
      lg: "1.125rem", // 18px
      xl: "1.25rem", // 20px
      "2xl": "1.5rem", // 24px
      "3xl": "1.875rem", // 30px
      "4xl": "2.25rem", // 36px
      "5xl": "3rem", // 48px
    },
    weights: {
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
      extrabold: "800",
    },
    lineHeights: {
      tight: "1.25",
      normal: "1.5",
      relaxed: "1.75",
    },
  },
};

export default tokens;
