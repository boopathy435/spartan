import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/Home/HomeScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import MemberDashboardScreen from '../screens/Member/MemberDashboardScreen';
import MemberWorkoutsScreen from '../screens/Member/MemberWorkoutsScreen';
import { useThemeColors } from '../contexts/ThemeContext';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Member Home Stack
function MemberHomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MemberHome" component={HomeScreen} />
    </Stack.Navigator>
  );
}

// Member Dashboard Stack
function MemberDashboardStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MemberDashboard" component={MemberDashboardScreen} />
    </Stack.Navigator>
  );
}

// Member Workouts Stack
function MemberWorkoutsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MemberWorkouts" component={MemberWorkoutsScreen} />
    </Stack.Navigator>
  );
}

// Member Profile Stack
function MemberProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}

export default function MemberTabNavigator() {
  const colors = useThemeColors();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'MemberHomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'MemberDashboardTab') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          } else if (route.name === 'MemberWorkoutsTab') {
            iconName = focused ? 'fitness' : 'fitness-outline';
          } else if (route.name === 'MemberProfileTab') {
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
        name="MemberHomeTab" 
        component={MemberHomeStack}
        options={{ 
          title: 'Home',
          tabBarLabel: 'Home'
        }} 
      />
      <Tab.Screen 
        name="MemberDashboardTab" 
        component={MemberDashboardStack}
        options={{ 
          title: 'Dashboard',
          tabBarLabel: 'Dashboard'
        }} 
      />
      <Tab.Screen 
        name="MemberWorkoutsTab" 
        component={MemberWorkoutsStack}
        options={{ 
          title: 'Workouts',
          tabBarLabel: 'Workouts'
        }} 
      />
      <Tab.Screen 
        name="MemberProfileTab" 
        component={MemberProfileStack}
        options={{ 
          title: 'Profile',
          tabBarLabel: 'Profile'
        }} 
      />
    </Tab.Navigator>
  );
}
