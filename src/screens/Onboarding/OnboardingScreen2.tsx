import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors, useThemeSpacing } from '../../contexts/ThemeContext';

const { width, height } = Dimensions.get('window');

interface OnboardingScreen2Props {
  onNext: () => void;
  onBack: () => void;
}

const OnboardingScreen2: React.FC<OnboardingScreen2Props> = ({ onNext, onBack }) => {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();
  const styles = useStyles(colors, spacing);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>📊</Text>
        </View>
        
        <View style={styles.textContainer}>
          <Text style={styles.title}>Track Your Workouts</Text>
          <Text style={styles.subtitle}>
            Log your exercises, track sets and reps, monitor your progress, 
            and stay consistent with your fitness journey.
          </Text>
          
          <View style={styles.featuresContainer}>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>✓</Text>
              <Text style={styles.featureText}>Comprehensive exercise library</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>✓</Text>
              <Text style={styles.featureText}>Progress tracking & analytics</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>✓</Text>
              <Text style={styles.featureText}>Weekly & monthly summaries</Text>
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button 
            mode="outlined" 
            onPress={onBack}
            style={[styles.button, styles.backButton]}
            contentStyle={styles.buttonContent}
          >
            Back
          </Button>
          <Button 
            mode="contained" 
            onPress={onNext}
            style={[styles.button, styles.nextButton]}
            contentStyle={styles.buttonContent}
          >
            Next
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
  iconContainer: {
    alignItems: 'center',
    marginTop: height * 0.1,
  },
  icon: {
    fontSize: 80,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  title: {
    fontSize: spacing.xl,
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
    marginBottom: spacing.xl,
  },
  featuresContainer: {
    width: '100%',
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  featureIcon: {
    fontSize: spacing.md,
    color: colors.primary,
    marginRight: spacing.sm,
    fontWeight: 'bold',
  },
  featureText: {
    fontSize: spacing.md,
    color: colors.text,
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xxl,
  },
  button: {
    borderRadius: spacing.borderRadius.lg,
    flex: 0.45,
  },
  backButton: {
    borderColor: colors.primary,
  },
  nextButton: {
    backgroundColor: colors.primary,
  },
  buttonContent: {
    paddingVertical: spacing.sm,
  },
});

export default OnboardingScreen2;
