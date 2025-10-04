import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors, useThemeSpacing } from '../contexts/ThemeContext';

const LoadingScreen: React.FC = () => {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();
  const styles = useStyles(colors, spacing);
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logo}>🏋️</Text>
        <Text style={styles.title}>Spartan Fitness</Text>
        <ActivityIndicator 
          size="large" 
          color={colors.primary} 
          style={styles.loader}
        />
        <Text style={styles.subtitle}>Loading...</Text>
      </View>
    </SafeAreaView>
  );
};

const useStyles = (colors: any, spacing: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 80,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: spacing.xxxl,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xl,
  },
  loader: {
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: spacing.md,
    color: colors.textSecondary,
  },
});

export default LoadingScreen;
