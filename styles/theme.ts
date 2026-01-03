/**
 * Theme Constants - Shared colors, spacing, and typography
 */

export const Colors = {
  // Primary Colors
  black: '#000000',
  white: '#FFFFFF',
  
  // Grays
  gray100: '#F5F5F5',
  gray200: '#E0E0E0',
  gray400: '#999999',
  gray600: '#666666',
  
  // Backgrounds
  background: '#FFFFFF',
  backgroundDark: '#000000',
  inputBackground: '#F5F5F5',
} as const;

export const Spacing = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
} as const;

export const Typography = {
  // Font Sizes
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 32,
  
  // Font Weights
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

export const BorderRadius = {
  sm: 6,
  md: 12,
  lg: 16,
  xl: 32,
  full: 9999,
} as const;

export const IconSizes = {
  sm: 20,
  md: 24,
  lg: 40,
} as const;

