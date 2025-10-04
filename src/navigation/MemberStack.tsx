import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/Home/HomeScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import MemberDashboardScreen from '../screens/Member/MemberDashboardScreen';
import MemberWorkoutsScreen from '../screens/Member/MemberWorkoutsScreen';

const Stack = createStackNavigator();

export default function MemberStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MemberHome" component={HomeScreen} />
      <Stack.Screen name="MemberDashboard" component={MemberDashboardScreen} />
      <Stack.Screen name="MemberWorkouts" component={MemberWorkoutsScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      {/* Add more member-specific screens here */}
    </Stack.Navigator>
  );
}
