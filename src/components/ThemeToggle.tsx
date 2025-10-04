import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Switch, Text } from 'react-native-paper';
import { useTheme } from '../contexts/ThemeContext';

interface ThemeToggleProps {
  style?: any;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ style }) => {
  const { isDark, toggleTheme, theme } = useTheme();

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>Dark Mode</Text>
      <Switch
        value={isDark}
        onValueChange={toggleTheme}
        color={theme.colors.primary}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ThemeToggle;
