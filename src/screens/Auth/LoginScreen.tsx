import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, TextInput, Button, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGoogleLogin, useFacebookLogin, loginWithEmail } from '../../services/auth';
import { useThemeColors, useThemeSpacing } from '../../contexts/ThemeContext';

interface LoginScreenProps {
  onRegister: () => void;
  onForgotPassword: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ 
  onRegister, 
  onForgotPassword
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const colors = useThemeColors();
  const spacing = useThemeSpacing();
  const styles = useStyles(colors, spacing);

  const { promptAsync: googlePrompt } = useGoogleLogin();
  const { promptAsync: facebookPrompt } = useFacebookLogin();

  const handleEmailLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await loginWithEmail(email, password);
      // Authentication state will be handled by RootNavigator
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await googlePrompt();
      // Authentication state will be handled by RootNavigator
    } catch (error: any) {
      Alert.alert('Google Login Failed', error.message || 'An error occurred');
    }
  };

  const handleFacebookLogin = async () => {
    try {
      await facebookPrompt();
      // Authentication state will be handled by RootNavigator
    } catch (error: any) {
      Alert.alert('Facebook Login Failed', error.message || 'An error occurred');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.logo}>🏋️</Text>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue your fitness journey</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            theme={{ colors: { primary: colors.primary } }}
          />
          
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            secureTextEntry
            style={styles.input}
            theme={{ colors: { primary: colors.primary } }}
          />

          <Button
            mode="text"
            onPress={onForgotPassword}
            style={styles.forgotPassword}
            labelStyle={styles.forgotPasswordText}
          >
            Forgot Password?
          </Button>

          <Button
            mode="contained"
            onPress={handleEmailLogin}
            loading={loading}
            disabled={loading}
            style={styles.loginButton}
            contentStyle={styles.buttonContent}
          >
            Sign In
          </Button>

          <View style={styles.dividerContainer}>
            <Divider style={styles.divider} />
            <Text style={styles.dividerText}>OR</Text>
            <Divider style={styles.divider} />
          </View>

          <Button
            mode="outlined"
            onPress={handleGoogleLogin}
            style={styles.socialButton}
            contentStyle={styles.buttonContent}
            icon="google"
          >
            Continue with Google
          </Button>

          <Button
            mode="outlined"
            onPress={handleFacebookLogin}
            style={styles.socialButton}
            contentStyle={styles.buttonContent}
            icon="facebook"
          >
            Continue with Facebook
          </Button>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <Button
            mode="text"
            onPress={onRegister}
            labelStyle={styles.registerText}
          >
            Sign Up
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const useStyles = (colors: any, spacing: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.screenPadding,
    paddingVertical: spacing.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  logo: {
    fontSize: 60,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: spacing.xxxl,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: spacing.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    marginBottom: spacing.xl,
  },
  input: {
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: spacing.xxl,
  },
  forgotPasswordText: {
    color: colors.primary,
  },
  loginButton: {
    backgroundColor: colors.primary,
    borderRadius: spacing.borderRadius.lg,
    marginBottom: spacing.xxl,
  },
  buttonContent: {
    paddingVertical: spacing.sm,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xxl,
  },
  divider: {
    flex: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    color: colors.textSecondary,
    marginHorizontal: spacing.md,
    fontSize: spacing.sm,
  },
  socialButton: {
    borderColor: colors.primary,
    borderRadius: spacing.borderRadius.lg,
    marginBottom: spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: colors.textSecondary,
    fontSize: spacing.md,
  },
  registerText: {
    color: colors.primary,
    fontSize: spacing.md,
  },
});

export default LoginScreen;
