import { StyleSheet } from 'react-native';
import { Theme } from '../theme';

// Type for style functions that receive theme
export type StyleFunction<T> = (theme: Theme) => T;

// Utility function to create theme-aware styles
export const createStyles = <T extends Record<string, any>>(
  styleFunction: StyleFunction<T>
): StyleFunction<T> => {
  return styleFunction;
};

// Helper function to create styles with theme
export const makeStyles = <T extends Record<string, any>>(
  styleFunction: StyleFunction<T>
) => {
  return (theme: Theme) => StyleSheet.create(styleFunction(theme));
};

// Common style patterns
export const commonStyles = {
  // Container styles
  container: (theme: Theme) => ({
    flex: 1,
    backgroundColor: theme.colors.background,
  }),
  
  safeContainer: (theme: Theme) => ({
    flex: 1,
    backgroundColor: theme.colors.background,
  }),
  
  centeredContainer: (theme: Theme) => ({
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    backgroundColor: theme.colors.background,
  }),
  
  // Card styles
  card: (theme: Theme) => ({
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.borderRadius.lg,
    padding: theme.spacing.cardPadding,
    ...theme.shadows.card,
  }),
  
  // Button styles
  primaryButton: (theme: Theme) => ({
    backgroundColor: theme.colors.primary,
    borderRadius: theme.spacing.borderRadius.lg,
    paddingVertical: theme.spacing.buttonPadding,
    paddingHorizontal: theme.spacing.lg,
    ...theme.shadows.button,
  }),
  
  secondaryButton: (theme: Theme) => ({
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: theme.spacing.borderRadius.lg,
    paddingVertical: theme.spacing.buttonPadding,
    paddingHorizontal: theme.spacing.lg,
  }),
  
  // Input styles
  input: (theme: Theme) => ({
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.borderRadius.md,
    padding: theme.spacing.inputPadding,
    borderWidth: 1,
    borderColor: theme.colors.border,
  }),
  
  // Text styles
  title: (theme: Theme) => ({
    ...theme.typography.styles.h1,
    color: theme.colors.text,
  }),
  
  subtitle: (theme: Theme) => ({
    ...theme.typography.styles.h2,
    color: theme.colors.textSecondary,
  }),
  
  body: (theme: Theme) => ({
    ...theme.typography.styles.body,
    color: theme.colors.text,
  }),
  
  caption: (theme: Theme) => ({
    ...theme.typography.styles.caption,
    color: theme.colors.textSecondary,
  }),
  
  // Layout styles
  row: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  
  column: {
    flexDirection: 'column' as const,
  },
  
  spaceBetween: {
    justifyContent: 'space-between' as const,
  },
  
  spaceAround: {
    justifyContent: 'space-around' as const,
  },
  
  center: {
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  
  // Spacing utilities
  marginTop: (value: number) => ({ marginTop: value }),
  marginBottom: (value: number) => ({ marginBottom: value }),
  marginLeft: (value: number) => ({ marginLeft: value }),
  marginRight: (value: number) => ({ marginRight: value }),
  marginHorizontal: (value: number) => ({ marginHorizontal: value }),
  marginVertical: (value: number) => ({ marginVertical: value }),
  
  paddingTop: (value: number) => ({ paddingTop: value }),
  paddingBottom: (value: number) => ({ paddingBottom: value }),
  paddingLeft: (value: number) => ({ paddingLeft: value }),
  paddingRight: (value: number) => ({ paddingRight: value }),
  paddingHorizontal: (value: number) => ({ paddingHorizontal: value }),
  paddingVertical: (value: number) => ({ paddingVertical: value }),
};
