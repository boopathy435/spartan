import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/Home/HomeScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import AdminDashboardScreen from '../screens/Admin/AdminDashboardScreen';
import AdminManageUsersScreen from '../screens/Admin/AdminManageUsersScreen';

const Stack = createStackNavigator();

export default function AdminStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="AdminHome" component={HomeScreen} />
      <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="ManageUsers" component={AdminManageUsersScreen} />
      {/* Add more admin-specific screens here */}
    </Stack.Navigator>
  );
}
