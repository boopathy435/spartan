import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import OnboardingScreen1 from './OnboardingScreen1';
import OnboardingScreen2 from './OnboardingScreen2';
import OnboardingScreen3 from './OnboardingScreen3';

interface OnboardingFlowProps {
  onComplete: () => void;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [currentScreen, setCurrentScreen] = useState(1);

  const handleNext = () => {
    if (currentScreen < 3) {
      setCurrentScreen(currentScreen + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentScreen > 1) {
      setCurrentScreen(currentScreen - 1);
    }
  };

  const handleGetStarted = () => {
    onComplete();
  };

  return (
    <View style={styles.container}>
      {currentScreen === 1 && (
        <OnboardingScreen1 onNext={handleNext} />
      )}
      {currentScreen === 2 && (
        <OnboardingScreen2 onNext={handleNext} onBack={handleBack} />
      )}
      {currentScreen === 3 && (
        <OnboardingScreen3 onGetStarted={handleGetStarted} onBack={handleBack} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default OnboardingFlow;
