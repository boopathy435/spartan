import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors, useThemeSpacing } from '../../contexts/ThemeContext';
import { makeStyles } from '../../utils/createStyles';

const { width, height } = Dimensions.get('window');

interface OnboardingScreen1Props {
  onNext: () => void;
}

const OnboardingScreen1: React.FC<OnboardingScreen1Props> = ({ onNext }) => {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();
  const styles = useStyles(colors, spacing);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>🏋️</Text>
          <Text style={styles.brandName}>SPARTAN FITNESS</Text>
        </View>
        
        <View style={styles.textContainer}>
          <Text style={styles.title}>Welcome to Spartan Fitness</Text>
          <Text style={styles.subtitle}>
            Your ultimate companion for tracking workouts, managing fitness packages, 
            and achieving your fitness goals.
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button 
            mode="contained" 
            onPress={onNext}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            Get Started
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
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenPadding,
    paddingVertical: spacing.xxl,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: height * 0.1,
  },
  logo: {
    fontSize: 80,
    marginBottom: spacing.md,
  },
  brandName: {
    fontSize: spacing.xxxl,
    fontWeight: 'bold',
    color: colors.primary,
    letterSpacing: spacing.md,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  title: {
    fontSize: spacing.xxl,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: spacing.md,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: spacing.xxl,
  },
  buttonContainer: {
    marginBottom: spacing.xxl,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: spacing.borderRadius.lg,
  },
  buttonContent: {
    paddingVertical: spacing.sm,
  },
});

export default OnboardingScreen1;
