// Spartan Fitness Color Palette
export const colors = {
  // Primary Colors
  primary: '#ff6b35',        // Spartan Orange
  primaryDark: '#e55a2b',    // Darker Orange
  primaryLight: '#ff8a5c',   // Lighter Orange
  
  // Background Colors
  background: '#1a1a1a',      // Dark Background
  surface: '#2a2a2a',         // Card/Surface Background
  surfaceLight: '#3a3a3a',   // Lighter Surface
  
  // Text Colors
  text: '#ffffff',           // Primary Text
  textSecondary: '#cccccc',  // Secondary Text
  textTertiary: '#999999',   // Tertiary Text
  
  // Status Colors
  success: '#4caf50',        // Green
  error: '#f44336',          // Red
  warning: '#ff9800',        // Orange
  info: '#2196f3',          // Blue
  
  // Border Colors
  border: '#444444',        // Default Border
  borderLight: '#555555',   // Light Border
  
  // Social Media Colors
  google: '#4285f4',         // Google Blue
  facebook: '#1877f2',      // Facebook Blue
  
  // Transparent Colors
  overlay: 'rgba(0, 0, 0, 0.5)',
  backdrop: 'rgba(0, 0, 0, 0.3)',
  
  // Gradient Colors
  gradientStart: '#ff6b35',
  gradientEnd: '#ff8a5c',
} as const;

// Color variants for different states
export const colorVariants = {
  primary: {
    default: colors.primary,
    hover: colors.primaryDark,
    pressed: colors.primaryDark,
    disabled: colors.textTertiary,
  },
  secondary: {
    default: colors.surface,
    hover: colors.surfaceLight,
    pressed: colors.surfaceLight,
    disabled: colors.textTertiary,
  },
  text: {
    primary: colors.text,
    secondary: colors.textSecondary,
    tertiary: colors.textTertiary,
    disabled: colors.textTertiary,
  },
} as const;

export type ColorKey = keyof typeof colors;
export type ColorVariantKey = keyof typeof colorVariants;
