export interface ColorScale {
  50?: string;
  100?: string;
  500?: string;
  600?: string;
  700?: string;
  DEFAULT: string;
}

export interface DesignTokens {
  color: {
    primary: ColorScale;
    secondary: ColorScale;
    success: { DEFAULT: string; bg: string };
    danger: { DEFAULT: string; bg: string };
    warning: { DEFAULT: string; bg: string };
    star: string;
    neutral: {
      0: string;
      50: string;
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
      1000: string;
    };
    text: {
      primary: string;
      secondary: string;
      disabled: string;
      inverse: string;
    };
    background: { DEFAULT: string; subtle: string };
    surface: { DEFAULT: string };
    border: { DEFAULT: string; focus: string };
    overlay: string;
  };
  font: {
    family: {
      light: string;
      regular: string;
      medium: string;
      semibold: string;
      bold: string;
    };
    size: {
      xs: number;
      sm: number;
      base: number;
      md: number;
      lg: number;
      xl: number;
      '2xl': number;
      '3xl': number;
      '4xl': number;
    };
    weight: {
      regular: '400';
      medium: '500';
      semibold: '600';
      bold: '700';
    };
    lineHeight: {
      xs: number;
      sm: number;
      base: number;
      md: number;
      lg: number;
      xl: number;
      '2xl': number;
      '3xl': number;
      '4xl': number;
    };
  };
  space: {
    0: number;
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
    6: number;
    8: number;
    10: number;
    12: number;
  };
  radius: {
    none: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    '2xl': number;
    full: number;
  };
  shadow: {
    sm: ShadowStyle;
    md: ShadowStyle;
    lg: ShadowStyle;
  };
  hitSlop: {
    min: number;
  };
}

export interface ShadowStyle {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}

declare const tokens: DesignTokens;
export default tokens;
