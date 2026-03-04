// DukandaR Color Constants

// Brand Colors
export const PRIMARY = '#16a34a';
export const PRIMARY_DARK = '#15803d';
export const PRIMARY_LIGHT = '#22c55e';
export const PRIMARY_LIGHTER = '#dcfce7';

export const ACCENT = '#f59e0b';
export const ACCENT_DARK = '#d97706';
export const ACCENT_LIGHT = '#fcd34d';

// Semantic Colors
export const SUCCESS = '#16a34a';
export const ERROR = '#dc2626';
export const DANGER = '#dc2626';
export const WARNING = '#f97316';
export const INFO = '#3b82f6';

// Surface Colors
export const SURFACE = '#ffffff';
export const BACKGROUND = '#f3f4f6';
export const BACKGROUND_DARK = '#e5e7eb';
export const BORDER = '#d1d5db';
export const BORDER_LIGHT = '#e5e7eb';

// Text Colors
export const TEXT_PRIMARY = '#111827';
export const TEXT_SECONDARY = '#6b7280';
export const TEXT_TERTIARY = '#9ca3af';
export const TEXT_DISABLED = '#d1d5db';
export const TEXT_INVERSE = '#ffffff';

// Status Colors
export const STATUS_OPEN = '#16a34a';
export const STATUS_CLOSED = '#dc2626';
export const STATUS_IN_STOCK = '#16a34a';
export const STATUS_OUT_OF_STOCK = '#dc2626';
export const STATUS_UNVERIFIED = '#f59e0b';

// Complete Colors Object
export const COLORS = {
  primary: {
    DEFAULT: PRIMARY,
    dark: PRIMARY_DARK,
    light: PRIMARY_LIGHT,
    lighter: PRIMARY_LIGHTER,
  },
  accent: {
    DEFAULT: ACCENT,
    dark: ACCENT_DARK,
    light: ACCENT_LIGHT,
  },
  semantic: {
    success: SUCCESS,
    error: ERROR,
    danger: DANGER,
    warning: WARNING,
    info: INFO,
  },
  surface: {
    DEFAULT: SURFACE,
    background: BACKGROUND,
    backgroundDark: BACKGROUND_DARK,
    border: BORDER,
    borderLight: BORDER_LIGHT,
  },
  text: {
    primary: TEXT_PRIMARY,
    secondary: TEXT_SECONDARY,
    tertiary: TEXT_TERTIARY,
    disabled: TEXT_DISABLED,
    inverse: TEXT_INVERSE,
  },
  status: {
    open: STATUS_OPEN,
    closed: STATUS_CLOSED,
    inStock: STATUS_IN_STOCK,
    outOfStock: STATUS_OUT_OF_STOCK,
    unverified: STATUS_UNVERIFIED,
  },
} as const;

export type ColorKey = keyof typeof COLORS;
