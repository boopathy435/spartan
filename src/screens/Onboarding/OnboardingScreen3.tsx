import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors, useThemeSpacing } from '../../contexts/ThemeContext';

const { width, height } = Dimensions.get('window');

interface OnboardingScreen3Props {
  onGetStarted: () => void;
  onBack: () => void;
}

const OnboardingScreen3: React.FC<OnboardingScreen3Props> = ({ onGetStarted, onBack }) => {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();
  const styles = useStyles(colors, spacing);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>💪</Text>
        </View>
        
        <View style={styles.textContainer}>
          <Text style={styles.title}>Fitness Packages</Text>
          <Text style={styles.subtitle}>
            Choose from our flexible fitness packages designed to fit your lifestyle 
            and help you achieve your goals.
          </Text>
          
          <View style={styles.packagesContainer}>
            <View style={styles.package}>
              <Text style={styles.packageName}>Basic Package</Text>
              <Text style={styles.packageDuration}>1 Month</Text>
            </View>
            <View style={styles.package}>
              <Text style={styles.packageName}>Pro Package</Text>
              <Text style={styles.packageDuration}>3 Months</Text>
            </View>
            <View style={styles.package}>
              <Text style={styles.packageName}>Elite Package</Text>
              <Text style={styles.packageDuration}>6 Months</Text>
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
            onPress={onGetStarted}
            style={[styles.button, styles.getStartedButton]}
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
  packagesContainer: {
    width: '100%',
  },
  package: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: spacing.borderRadius.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  packageName: {
    fontSize: spacing.lg,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  packageDuration: {
    fontSize: spacing.sm,
    color: colors.primary,
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
  getStartedButton: {
    backgroundColor: colors.primary,
  },
  buttonContent: {
    paddingVertical: spacing.sm,
  },
});

export default OnboardingScreen3;
