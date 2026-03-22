// ════════════════════════════════════════════
// MapleTrack Design Tokens — Single Source of Truth
// Modern Light Theme — Inspired by Airbnb
// ════════════════════════════════════════════

export interface DesignTokens {
  colors: {
    background: string;
    surface: string;
    card: string;
    border: string;
    borderLight: string;
    primary: string;
    primaryLight: string;
    primaryDark: string;
    primaryForeground: string;
    accent: string;
    accentLight: string;
    accentForeground: string;
    success: string;
    successForeground: string;
    warning: string;
    warningForeground: string;
    error: string;
    errorForeground: string;
    info: string;
    infoForeground: string;
    foreground: string;
    foregroundMuted: string;
    foregroundDim: string;
    ring: string;
    input: string;
    inputForeground: string;
    destructive: string;
    destructiveForeground: string;
    muted: string;
    mutedForeground: string;
    popover: string;
    popoverForeground: string;
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
    sizes: Record<string, string>;
    weights: Record<string, string>;
    lineHeights: Record<string, string>;
  };
}

export const tokens: DesignTokens = {
  colors: {
    // Base — Clean whites and light grays
    background: "#FFFFFF",
    surface: "#F7F7F7",
    card: "#FFFFFF",
    border: "#EBEBEB",
    borderLight: "#DDDDDD",

    // Primary — Warm coral/red (Airbnb-inspired with maple identity)
    primary: "#E31C5F",
    primaryLight: "#FF385C",
    primaryDark: "#C81E4E",
    primaryForeground: "#FFFFFF",

    // Accent — Teal (secondary actions)
    accent: "#008489",
    accentLight: "#00A699",
    accentForeground: "#FFFFFF",

    // Semantic
    success: "#008A05",
    successForeground: "#FFFFFF",
    warning: "#E07912",
    warningForeground: "#FFFFFF",
    error: "#C13515",
    errorForeground: "#FFFFFF",
    info: "#428BFF",
    infoForeground: "#FFFFFF",

    // Text
    foreground: "#222222",
    foregroundMuted: "#717171",
    foregroundDim: "#B0B0B0",

    // Interactive
    ring: "#222222",
    input: "#EBEBEB",
    inputForeground: "#222222",

    // Destructive
    destructive: "#C13515",
    destructiveForeground: "#FFFFFF",

    // Muted
    muted: "#F7F7F7",
    mutedForeground: "#717171",

    // Popover
    popover: "#FFFFFF",
    popoverForeground: "#222222",

    // Secondary
    secondary: "#F7F7F7",
    secondaryForeground: "#222222",
  },

  sidebar: {
    background: "#FFFFFF",
    foreground: "#717171",
    border: "#EBEBEB",
    primary: "#E31C5F",
    primaryForeground: "#FFFFFF",
    accent: "#F7F7F7",
    accentForeground: "#222222",
    ring: "#222222",
  },

  radius: {
    sm: "0.5rem",
    md: "0.75rem",
    lg: "1rem",
    xl: "1.5rem",
    full: "9999px",
  },

  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
    "3xl": "4rem",
  },

  typography: {
    fontSans: '"Cereal", "Circular", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    fontHeading: '"Cereal", "Circular", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    fontMono: '"JetBrains Mono", ui-monospace, SFMono-Regular, "Menlo", monospace',
    sizes: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
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
