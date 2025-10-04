# 🎨 Spartan Fitness - Theme System Guide

## 📋 Overview

The Spartan Fitness app now uses a centralized theme system that makes it easy to manage colors, spacing, typography, and shadows across the entire application. This system supports both light and dark themes with automatic system preference detection.

## 🏗️ Architecture

### Theme Structure
```
src/theme/
├── index.ts          # Main theme exports
├── colors.ts         # Color palette and variants
├── spacing.ts        # Spacing system and border radius
├── typography.ts     # Font sizes, weights, and text styles
└── shadows.ts        # Shadow system for elevation

src/contexts/
└── ThemeContext.tsx  # Theme context and hooks

src/utils/
└── createStyles.ts   # Style utilities and common patterns
```

## 🎨 Color System

### Primary Colors
- **Primary**: `#ff6b35` (Spartan Orange)
- **Primary Dark**: `#e55a2b` (Darker Orange)
- **Primary Light**: `#ff8a5c` (Lighter Orange)

### Background Colors
- **Background**: `#1a1a1a` (Dark) / `#ffffff` (Light)
- **Surface**: `#2a2a2a` (Dark) / `#f5f5f5` (Light)
- **Surface Light**: `#3a3a3a` (Dark) / `#e0e0e0` (Light)

### Text Colors
- **Text**: `#ffffff` (Dark) / `#000000` (Light)
- **Text Secondary**: `#cccccc` (Dark) / `#666666` (Light)
- **Text Tertiary**: `#999999` (Both themes)

### Status Colors
- **Success**: `#4caf50` (Green)
- **Error**: `#f44336` (Red)
- **Warning**: `#ff9800` (Orange)
- **Info**: `#2196f3` (Blue)

## 📏 Spacing System

### Base Spacing (8px grid)
- **xs**: 4px
- **sm**: 8px
- **md**: 16px
- **lg**: 24px
- **xl**: 32px
- **xxl**: 40px
- **xxxl**: 48px

### Component Spacing
- **screenPadding**: 24px
- **cardPadding**: 16px
- **buttonPadding**: 12px
- **inputPadding**: 16px

### Border Radius
- **sm**: 4px
- **md**: 8px
- **lg**: 12px
- **xl**: 16px
- **round**: 50px

## 🔤 Typography System

### Font Sizes
- **xs**: 12px
- **sm**: 14px
- **md**: 16px
- **lg**: 18px
- **xl**: 20px
- **xxl**: 24px
- **xxxl**: 28px
- **display**: 32px

### Font Weights
- **light**: 300
- **regular**: 400
- **medium**: 500
- **semiBold**: 600
- **bold**: 700
- **extraBold**: 800

### Text Styles
- **h1**: Large heading (28px, bold)
- **h2**: Medium heading (24px, semiBold)
- **h3**: Small heading (20px, semiBold)
- **body**: Regular text (16px, regular)
- **bodySmall**: Small text (14px, regular)
- **caption**: Caption text (12px, regular)
- **button**: Button text (16px, semiBold)
- **brand**: Brand text (28px, bold, wide spacing)

## 🌟 Shadow System

### Elevation Levels
- **none**: No shadow
- **sm**: Small shadow (2px elevation)
- **md**: Medium shadow (4px elevation)
- **lg**: Large shadow (8px elevation)
- **xl**: Extra large shadow (12px elevation)

### Component Shadows
- **card**: Card shadow (3px elevation)
- **button**: Button shadow (2px elevation)
- **modal**: Modal shadow (16px elevation)

## 🚀 Usage Examples

### 1. Using Theme Hooks

```tsx
import React from 'react';
import { View, Text } from 'react-native';
import { useThemeColors, useThemeSpacing } from '../contexts/ThemeContext';

const MyComponent = () => {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();

  return (
    <View style={{ backgroundColor: colors.background, padding: spacing.md }}>
      <Text style={{ color: colors.text, fontSize: spacing.md }}>
        Hello World
      </Text>
    </View>
  );
};
```

### 2. Creating Theme-Aware Styles

```tsx
import { StyleSheet } from 'react-native';
import { useThemeColors, useThemeSpacing } from '../contexts/ThemeContext';

const MyComponent = () => {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();
  const styles = useStyles(colors, spacing);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Title</Text>
    </View>
  );
};

const useStyles = (colors: any, spacing: any) => StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: spacing.borderRadius.lg,
  },
  title: {
    color: colors.text,
    fontSize: spacing.lg,
    fontWeight: 'bold',
  },
});
```

### 3. Using Common Style Patterns

```tsx
import { commonStyles } from '../utils/createStyles';
import { useTheme } from '../contexts/ThemeContext';

const MyComponent = () => {
  const { theme } = useTheme();

  return (
    <View style={commonStyles.container(theme)}>
      <View style={commonStyles.card(theme)}>
        <Text style={commonStyles.title(theme)}>Card Title</Text>
        <Text style={commonStyles.body(theme)}>Card content</Text>
      </View>
    </View>
  );
};
```

### 4. Theme Toggle Component

```tsx
import { ThemeToggle } from '../components/ThemeToggle';

const SettingsScreen = () => {
  return (
    <View>
      <ThemeToggle />
    </View>
  );
};
```

## 🔄 Theme Switching

### Automatic Theme Detection
The app automatically detects the system theme preference and applies the appropriate theme.

### Manual Theme Toggle
```tsx
import { useTheme } from '../contexts/ThemeContext';

const MyComponent = () => {
  const { isDark, toggleTheme, setTheme } = useTheme();

  return (
    <Button onPress={toggleTheme}>
      Switch to {isDark ? 'Light' : 'Dark'} Mode
    </Button>
  );
};
```

## 📱 Responsive Design

### Screen Dimensions
```tsx
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Use percentage-based sizing for responsive design
const styles = StyleSheet.create({
  container: {
    width: width * 0.9, // 90% of screen width
    height: height * 0.8, // 80% of screen height
  },
});
```

## 🎯 Best Practices

### 1. Always Use Theme Values
❌ **Don't**: Hardcode colors
```tsx
<View style={{ backgroundColor: '#1a1a1a' }} />
```

✅ **Do**: Use theme colors
```tsx
<View style={{ backgroundColor: colors.background }} />
```

### 2. Use Spacing System
❌ **Don't**: Random spacing values
```tsx
<View style={{ padding: 17 }} />
```

✅ **Do**: Use spacing system
```tsx
<View style={{ padding: spacing.md }} />
```

### 3. Consistent Typography
❌ **Don't**: Inconsistent text styles
```tsx
<Text style={{ fontSize: 18, fontWeight: '600' }} />
```

✅ **Do**: Use typography system
```tsx
<Text style={typography.styles.h3} />
```

### 4. Theme-Aware Components
Always make components theme-aware by using the theme hooks and utilities.

## 🔧 Customization

### Adding New Colors
1. Add to `src/theme/colors.ts`
2. Update both light and dark themes
3. Export the new color

### Adding New Spacing Values
1. Add to `src/theme/spacing.ts`
2. Use consistent naming conventions
3. Follow the 8px grid system

### Creating Custom Text Styles
1. Add to `src/theme/typography.ts`
2. Follow existing naming patterns
3. Include all necessary properties

## 🚀 Migration Guide

### From Hardcoded Styles
1. Import theme hooks: `useThemeColors`, `useThemeSpacing`
2. Replace hardcoded colors with theme colors
3. Replace hardcoded spacing with theme spacing
4. Update StyleSheet.create to use theme values

### Example Migration
```tsx
// Before
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a1a',
    padding: 24,
    borderRadius: 12,
  },
});

// After
const useStyles = (colors: any, spacing: any) => StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    padding: spacing.screenPadding,
    borderRadius: spacing.borderRadius.lg,
  },
});
```

This theme system provides a solid foundation for maintaining consistent design across your Spartan Fitness app while supporting both light and dark modes!
