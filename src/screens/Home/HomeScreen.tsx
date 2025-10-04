import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { logout } from '../../services/auth';
import { useThemeColors, useThemeSpacing } from '../../contexts/ThemeContext';

const HomeScreen: React.FC = () => {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();
  const styles = useStyles(colors, spacing);

  const handleLogout = async () => {
    try {
      await logout();
      // Navigation will be handled by RootNavigator's auth state change
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logo}>🏋️</Text>
        <Text style={styles.title}>Welcome to Spartan Fitness!</Text>
        <Text style={styles.subtitle}>
          You have successfully logged in. This is your dashboard.
        </Text>
        
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleLogout}
            style={styles.logoutButton}
            contentStyle={styles.buttonContent}
          >
            Logout
          </Button>
        </View>
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
    paddingHorizontal: spacing.screenPadding,
  },
  logo: {
    fontSize: 80,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: spacing.xxxl,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: spacing.md,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xxl,
  },
  buttonContainer: {
    width: '100%',
  },
  logoutButton: {
    backgroundColor: colors.primary,
    borderRadius: spacing.borderRadius.lg,
  },
  buttonContent: {
    paddingVertical: spacing.sm,
  },
});

export default HomeScreen;
