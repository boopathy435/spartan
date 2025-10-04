import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import OnboardingFlow from '../Onboarding/OnboardingFlow';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import ForgotPasswordScreen from './ForgotPasswordScreen';

type AuthScreen = 'onboarding' | 'login' | 'register' | 'forgot-password';

const AuthFlow: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AuthScreen>('onboarding');

  const handleOnboardingComplete = () => {
    setCurrentScreen('login');
  };


  const handleGoToRegister = () => {
    setCurrentScreen('register');
  };

  const handleGoToLogin = () => {
    setCurrentScreen('login');
  };

  const handleGoToForgotPassword = () => {
    setCurrentScreen('forgot-password');
  };

  const handleRegisterSuccess = () => {
    setCurrentScreen('login');
  };

  return (
    <View style={styles.container}>
      {currentScreen === 'onboarding' && (
        <OnboardingFlow onComplete={handleOnboardingComplete} />
      )}
      {currentScreen === 'login' && (
        <LoginScreen
          onRegister={handleGoToRegister}
          onForgotPassword={handleGoToForgotPassword}
        />
      )}
      {currentScreen === 'register' && (
        <RegisterScreen
          onLogin={handleGoToLogin}
          onRegisterSuccess={handleRegisterSuccess}
        />
      )}
      {currentScreen === 'forgot-password' && (
        <ForgotPasswordScreen onBack={handleGoToLogin} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default AuthFlow;
