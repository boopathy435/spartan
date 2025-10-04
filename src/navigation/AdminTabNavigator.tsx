import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/Home/HomeScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import AdminDashboardScreen from '../screens/Admin/AdminDashboardScreen';
import AdminManageUsersScreen from '../screens/Admin/AdminManageUsersScreen';
import { useThemeColors } from '../contexts/ThemeContext';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Admin Home Stack
function AdminHomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminHome" component={HomeScreen} />
    </Stack.Navigator>
  );
}

// Admin Dashboard Stack
function AdminDashboardStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
      <Stack.Screen name="ManageUsers" component={AdminManageUsersScreen} />
    </Stack.Navigator>
  );
}

// Admin Profile Stack
function AdminProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}

export default function AdminTabNavigator() {
  const colors = useThemeColors();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'AdminHomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'AdminDashboardTab') {
            iconName = focused ? 'analytics' : 'analytics-outline';
          } else if (route.name === 'AdminProfileTab') {
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
        name="AdminHomeTab" 
        component={AdminHomeStack}
        options={{ 
          title: 'Home',
          tabBarLabel: 'Home'
        }} 
      />
      <Tab.Screen 
        name="AdminDashboardTab" 
        component={AdminDashboardStack}
        options={{ 
          title: 'Dashboard',
          tabBarLabel: 'Dashboard'
        }} 
      />
      <Tab.Screen 
        name="AdminProfileTab" 
        component={AdminProfileStack}
        options={{ 
          title: 'Profile',
          tabBarLabel: 'Profile'
        }} 
      />
    </Tab.Navigator>
  );
}
