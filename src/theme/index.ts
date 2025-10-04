// Spartan Fitness Theme System
import { colors } from './colors';
import { spacing } from './spacing';
import { typography } from './typography';
import { shadows } from './shadows';

// Main theme object
export const theme = {
  colors,
  spacing,
  typography,
  shadows,
} as const;

// Theme variants for different modes
export const lightTheme = {
  ...theme,
  colors: {
    ...colors,
    background: '#ffffff',
    surface: '#f5f5f5',
    surfaceLight: '#e0e0e0',
    text: '#000000',
    textSecondary: '#666666',
    textTertiary: '#999999',
    border: '#e0e0e0',
    borderLight: '#f0f0f0',
  },
} as const;

export const darkTheme = {
  ...theme,
  colors: {
    ...colors,
    // Dark theme colors are already defined in colors.ts
  },
} as const;

// Default theme (dark mode)
export const defaultTheme = darkTheme;

// Theme type for TypeScript
export type Theme = typeof theme;
export type LightTheme = typeof lightTheme;
export type DarkTheme = typeof darkTheme;

// Export individual modules
export { colors } from './colors';
export { spacing } from './spacing';
export { typography } from './typography';
export { shadows } from './shadows';
