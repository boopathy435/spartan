// Spartan Fitness Spacing System
export const spacing = {
  // Base spacing unit (8px)
  xs: 4,    // 4px
  sm: 8,    // 8px
  md: 16,   // 16px
  lg: 24,   // 24px
  xl: 32,   // 32px
  xxl: 40,  // 40px
  xxxl: 48, // 48px
  
  // Component-specific spacing
  screenPadding: 24,
  cardPadding: 16,
  buttonPadding: 12,
  inputPadding: 16,
  
  // Layout spacing
  headerHeight: 56,
  tabBarHeight: 60,
  bottomSafeArea: 34,
  
  // Border radius
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    round: 50,
  },
} as const;

export type SpacingKey = keyof typeof spacing;
export type BorderRadiusKey = keyof typeof spacing.borderRadius;
