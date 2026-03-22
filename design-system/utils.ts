// ════════════════════════════════════════════
// Design System Utilities
// Convert tokens to CSS custom properties
// ════════════════════════════════════════════

/**
 * Converts a camelCase token key to a CSS custom property name.
 * e.g., "primaryLight" → "--primary-light"
 */
export function tokenKeyToCssVar(key: string): string {
  const kebab = key.replace(/([A-Z])/g, "-$1").toLowerCase();
  return `--${kebab}`;
}

/**
 * Converts a sidebar token key to a CSS custom property name.
 * e.g., "primaryForeground" → "--sidebar-primary-foreground"
 */
export function sidebarKeyToCssVar(key: string): string {
  const kebab = key.replace(/([A-Z])/g, "-$1").toLowerCase();
  return `--sidebar-${kebab}`;
}

/**
 * Flattens nested token object into CSS variable declarations.
 * Returns array of [varName, value] pairs.
 */
export function flattenTokens(
  obj: Record<string, unknown>,
  prefix = "--"
): [string, string][] {
  const result: [string, string][] = [];

  for (const [key, value] of Object.entries(obj)) {
    const kebab = key.replace(/([A-Z])/g, "-$1").toLowerCase();
    const varName = `${prefix}${kebab}`;

    if (typeof value === "string") {
      result.push([varName, value]);
    } else if (typeof value === "object" && value !== null) {
      result.push(
        ...flattenTokens(value as Record<string, unknown>, `${varName}-`)
      );
    }
  }

  return result;
}
