/**
 * Storevia design tokens — single source of truth.
 * See /docs/design.md for rationale. Consumed by:
 *  - tailwind.config.js (via require, CommonJS) for NativeWind className usage
 *  - theme/index.ts (via import) for StyleSheet/inline style usage in components
 * Keep this file plain CommonJS (no TS-only syntax) so it can be required()
 * directly by tailwind.config.js with no build step.
 */
module.exports = {
  color: {
    primary: {
      50: '#fff7ed',
      100: '#ffedd5',
      500: '#f97316',
      600: '#ea580c',
      700: '#c2410c',
      DEFAULT: '#f97316',
    },
    secondary: {
      500: '#2563eb',
      DEFAULT: '#2563eb',
    },
    success: {
      DEFAULT: '#16a34a',
      bg: '#dcfce7',
    },
    danger: {
      DEFAULT: '#dc2626',
      bg: '#fee2e2',
    },
    warning: {
      DEFAULT: '#f59e0b',
      bg: '#fef3c7',
    },
    star: '#f59e0b',
    neutral: {
      0: '#ffffff',
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
      1000: '#000000',
    },
    text: {
      primary: '#111827',
      secondary: '#6b7280',
      disabled: '#9ca3af',
      inverse: '#ffffff',
    },
    background: {
      DEFAULT: '#ffffff',
      subtle: '#f9fafb',
    },
    surface: {
      DEFAULT: '#ffffff',
    },
    border: {
      DEFAULT: '#e5e7eb',
      focus: '#f97316',
    },
    overlay: 'rgba(0,0,0,0.5)',
  },
  font: {
    family: {
      light: 'PoppinsLight',
      regular: 'PoppinsRegular',
      medium: 'PoppinsMedium',
      semibold: 'PoppinsSemiBold',
      bold: 'PoppinsBold',
    },
    size: {
      xs: 12,
      sm: 13,
      base: 14,
      md: 15,
      lg: 16,
      xl: 18,
      '2xl': 20,
      '3xl': 24,
      '4xl': 28,
    },
    weight: {
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeight: {
      xs: 16,
      sm: 18,
      base: 20,
      md: 22,
      lg: 24,
      xl: 26,
      '2xl': 28,
      '3xl': 32,
      '4xl': 36,
    },
  },
  space: {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    8: 32,
    10: 40,
    12: 48,
  },
  radius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 20,
    full: 999,
  },
  shadow: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.14,
      shadowRadius: 12,
      elevation: 8,
    },
  },
  hitSlop: {
    min: 44,
  },
};
