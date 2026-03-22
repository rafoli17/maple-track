#!/usr/bin/env tsx
// ════════════════════════════════════════════
// CSS Generator — Reads tokens.ts and writes :root {} block to globals.css
// Usage: npx tsx design-system/generate-css.ts [--check]
// ════════════════════════════════════════════

import * as fs from "fs";
import * as path from "path";
import { tokens } from "./tokens";

const GLOBALS_CSS_PATH = path.resolve(
  __dirname,
  "../src/app/globals.css"
);
const START_MARKER = "/* === DESIGN TOKENS START === */";
const END_MARKER = "/* === DESIGN TOKENS END === */";

function generateCssBlock(): string {
  const lines: string[] = [];

  lines.push(START_MARKER);
  lines.push(":root {");

  // Colors
  lines.push("  /* Colors — Base */");
  lines.push(`  --background: ${tokens.colors.background};`);
  lines.push(`  --surface: ${tokens.colors.surface};`);
  lines.push(`  --card: ${tokens.colors.card};`);
  lines.push(`  --card-foreground: ${tokens.colors.foreground};`);
  lines.push(`  --border: ${tokens.colors.border};`);
  lines.push(`  --border-light: ${tokens.colors.borderLight};`);
  lines.push("");

  lines.push("  /* Colors — Primary (Teal) */");
  lines.push(`  --primary: ${tokens.colors.primary};`);
  lines.push(`  --primary-light: ${tokens.colors.primaryLight};`);
  lines.push(`  --primary-dark: ${tokens.colors.primaryDark};`);
  lines.push(`  --primary-foreground: ${tokens.colors.primaryForeground};`);
  lines.push("");

  lines.push("  /* Colors — Accent (Maple Red) */");
  lines.push(`  --accent: ${tokens.colors.accent};`);
  lines.push(`  --accent-light: ${tokens.colors.accentLight};`);
  lines.push(`  --accent-foreground: ${tokens.colors.accentForeground};`);
  lines.push("");

  lines.push("  /* Colors — Semantic */");
  lines.push(`  --success: ${tokens.colors.success};`);
  lines.push(`  --success-foreground: ${tokens.colors.successForeground};`);
  lines.push(`  --warning: ${tokens.colors.warning};`);
  lines.push(`  --warning-foreground: ${tokens.colors.warningForeground};`);
  lines.push(`  --error: ${tokens.colors.error};`);
  lines.push(`  --error-foreground: ${tokens.colors.errorForeground};`);
  lines.push(`  --info: ${tokens.colors.info};`);
  lines.push(`  --info-foreground: ${tokens.colors.infoForeground};`);
  lines.push("");

  lines.push("  /* Colors — Text */");
  lines.push(`  --foreground: ${tokens.colors.foreground};`);
  lines.push(`  --foreground-muted: ${tokens.colors.foregroundMuted};`);
  lines.push(`  --foreground-dim: ${tokens.colors.foregroundDim};`);
  lines.push("");

  lines.push("  /* Colors — Interactive */");
  lines.push(`  --ring: ${tokens.colors.ring};`);
  lines.push(`  --input: ${tokens.colors.input};`);
  lines.push(`  --input-foreground: ${tokens.colors.inputForeground};`);
  lines.push("");

  lines.push("  /* Colors — Destructive */");
  lines.push(`  --destructive: ${tokens.colors.destructive};`);
  lines.push(`  --destructive-foreground: ${tokens.colors.destructiveForeground};`);
  lines.push("");

  lines.push("  /* Colors — Muted */");
  lines.push(`  --muted: ${tokens.colors.muted};`);
  lines.push(`  --muted-foreground: ${tokens.colors.mutedForeground};`);
  lines.push("");

  lines.push("  /* Colors — Popover */");
  lines.push(`  --popover: ${tokens.colors.popover};`);
  lines.push(`  --popover-foreground: ${tokens.colors.popoverForeground};`);
  lines.push("");

  lines.push("  /* Colors — Secondary */");
  lines.push(`  --secondary: ${tokens.colors.secondary};`);
  lines.push(`  --secondary-foreground: ${tokens.colors.secondaryForeground};`);
  lines.push("");

  // Sidebar
  lines.push("  /* Sidebar */");
  lines.push(`  --sidebar-background: ${tokens.sidebar.background};`);
  lines.push(`  --sidebar-foreground: ${tokens.sidebar.foreground};`);
  lines.push(`  --sidebar-border: ${tokens.sidebar.border};`);
  lines.push(`  --sidebar-primary: ${tokens.sidebar.primary};`);
  lines.push(`  --sidebar-primary-foreground: ${tokens.sidebar.primaryForeground};`);
  lines.push(`  --sidebar-accent: ${tokens.sidebar.accent};`);
  lines.push(`  --sidebar-accent-foreground: ${tokens.sidebar.accentForeground};`);
  lines.push(`  --sidebar-ring: ${tokens.sidebar.ring};`);
  lines.push("");

  // Radius
  lines.push("  /* Radius */");
  lines.push(`  --radius-sm: ${tokens.radius.sm};`);
  lines.push(`  --radius-md: ${tokens.radius.md};`);
  lines.push(`  --radius-lg: ${tokens.radius.lg};`);
  lines.push(`  --radius-xl: ${tokens.radius.xl};`);
  lines.push(`  --radius: ${tokens.radius.lg};`);
  lines.push("");

  // Typography
  lines.push("  /* Typography */");
  lines.push(`  --font-sans: ${tokens.typography.fontSans};`);
  lines.push(`  --font-heading: ${tokens.typography.fontHeading};`);
  lines.push(`  --font-mono: ${tokens.typography.fontMono};`);
  lines.push("}");
  lines.push(END_MARKER);

  return lines.join("\n");
}

function run() {
  const isCheck = process.argv.includes("--check");
  const cssBlock = generateCssBlock();

  let existing = "";
  if (fs.existsSync(GLOBALS_CSS_PATH)) {
    existing = fs.readFileSync(GLOBALS_CSS_PATH, "utf-8");
  }

  const startIdx = existing.indexOf(START_MARKER);
  const endIdx = existing.indexOf(END_MARKER);

  let newContent: string;

  if (startIdx !== -1 && endIdx !== -1) {
    // Replace existing block
    const before = existing.substring(0, startIdx);
    const after = existing.substring(endIdx + END_MARKER.length);
    newContent = before + cssBlock + after;
  } else {
    // Inject after @import "tailwindcss";
    const importIdx = existing.indexOf('@import "tailwindcss";');
    if (importIdx !== -1) {
      const afterImport = importIdx + '@import "tailwindcss";'.length;
      const before = existing.substring(0, afterImport);
      const after = existing.substring(afterImport);
      newContent = before + "\n\n" + cssBlock + "\n" + after;
    } else {
      // Prepend
      newContent = cssBlock + "\n\n" + existing;
    }
  }

  if (isCheck) {
    if (newContent.trim() !== existing.trim()) {
      console.error(
        "❌ Design tokens are out of sync! Run `npm run tokens` to update."
      );
      process.exit(1);
    } else {
      console.log("✅ Design tokens are in sync.");
      process.exit(0);
    }
  } else {
    fs.writeFileSync(GLOBALS_CSS_PATH, newContent, "utf-8");
    console.log("✅ Design tokens written to globals.css");
  }
}

run();
