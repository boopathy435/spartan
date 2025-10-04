import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/Home/HomeScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import TrainerDashboardScreen from '../screens/Trainer/TrainerDashboardScreen';
import TrainerManageWorkoutsScreen from '../screens/Trainer/TrainerManageWorkoutsScreen';
import { useThemeColors } from '../contexts/ThemeContext';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Trainer Home Stack
function TrainerHomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TrainerHome" component={HomeScreen} />
    </Stack.Navigator>
  );
}

// Trainer Dashboard Stack
function TrainerDashboardStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TrainerDashboard" component={TrainerDashboardScreen} />
    </Stack.Navigator>
  );
}

// Trainer Workouts Stack
function TrainerWorkoutsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ManageWorkouts" component={TrainerManageWorkoutsScreen} />
    </Stack.Navigator>
  );
}

// Trainer Profile Stack
function TrainerProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}

export default function TrainerTabNavigator() {
  const colors = useThemeColors();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'TrainerHomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'TrainerDashboardTab') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'TrainerWorkoutsTab') {
            iconName = focused ? 'fitness' : 'fitness-outline';
          } else if (route.name === 'TrainerProfileTab') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
      })}
    >
      <Tab.Screen 
        name="TrainerHomeTab" 
        component={TrainerHomeStack}
        options={{ 
          title: 'Home',
          tabBarLabel: 'Home'
        }} 
      />
      <Tab.Screen 
        name="TrainerDashboardTab" 
        component={TrainerDashboardStack}
        options={{ 
          title: 'Members',
          tabBarLabel: 'Members'
        }} 
      />
      <Tab.Screen 
        name="TrainerWorkoutsTab" 
        component={TrainerWorkoutsStack}
        options={{ 
          title: 'Workouts',
          tabBarLabel: 'Workouts'
        }} 
      />
      <Tab.Screen 
        name="TrainerProfileTab" 
        component={TrainerProfileStack}
        options={{ 
          title: 'Profile',
          tabBarLabel: 'Profile'
        }} 
      />
    </Tab.Navigator>
  );
}
