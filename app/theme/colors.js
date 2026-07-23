/**
 * EnGuete color tokens — single source of truth.
 * Use Tailwind classes (`bg-brand-orange`, `text-ink-muted`) in UI when possible.
 * Import from here only when a prop needs a raw hex (icons, Switch, StyleSheet).
 */
const colors = {
  brand: {
    yellow: '#ffd043',
    orange: '#ea580c',
    orangeLight: '#f97316',
    orangeSoft: '#FFDAC2',
    orangeMuted: '#ffedd5',
    yellowSoft: '#FFEAAD',
    yellowMuted: '#fef9c3',
  },
  ink: {
    DEFAULT: '#18181b',
    soft: '#3f3f46',
    muted: '#71717a',
    faint: '#a1a1aa',
  },
  surface: {
    DEFAULT: '#ffffff',
    soft: '#fafafa',
    muted: '#f4f4f5',
    border: '#e4e4e7',
  },
  status: {
    success: '#22c55e',
    successSoft: '#dcfce7',
    warning: '#f59e0b',
    warningSoft: '#fffbeb',
    error: '#ef4444',
    errorSoft: '#fef2f2',
    info: '#3b82f6',
    infoSoft: '#eff6ff',
    closed: '#64748b',
    closedSoft: '#e2e8f0',
  },
  gray: {
    50: '#fafafa',
    100: '#f4f4f5',
    200: '#e4e4e7',
    300: '#d4d4d8',
    400: '#a1a1aa',
    500: '#71717a',
    600: '#52525b',
    700: '#3f3f46',
    800: '#27272a',
    900: '#18181b',
  },
};

module.exports = {colors};
