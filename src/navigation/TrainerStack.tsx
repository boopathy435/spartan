import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/Home/HomeScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import TrainerDashboardScreen from '../screens/Trainer/TrainerDashboardScreen';
import TrainerManageWorkoutsScreen from '../screens/Trainer/TrainerManageWorkoutsScreen';

const Stack = createStackNavigator();

export default function TrainerStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="TrainerHome" component={HomeScreen} />
      <Stack.Screen name="TrainerDashboard" component={TrainerDashboardScreen} />
      <Stack.Screen name="ManageWorkouts" component={TrainerManageWorkoutsScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      {/* Add more trainer-specific screens here */}
    </Stack.Navigator>
  );
}
