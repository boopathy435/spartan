import React, { useEffect, useState } from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import { onAuthStateChanged, User } from 'firebase/auth';
import { useDispatch, useSelector } from 'react-redux';
import { auth } from '../config/firebase';
import { getUserData, UserRole } from '../services/auth';
import { setUser, setRole, clearUser } from '../store/slices/userSlice';
import { RootState } from '../store';
import AuthFlow from '../screens/Auth/AuthFlow';
import AdminTabNavigator from './AdminTabNavigator';
import TrainerTabNavigator from './TrainerTabNavigator';
import MemberTabNavigator from './MemberTabNavigator';
import LoadingScreen from '../components/LoadingScreen';

const Stack = createStackNavigator();

export default function RootNavigator() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const userRole = user.role;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Fetch user data including role from Firestore
          const userData = await getUserData(firebaseUser.uid);
          
          if (userData) {
            dispatch(setUser({
              uid: userData.uid,
              profile: {
                uid: userData.uid,
                email: userData.email,
                name: userData.displayName
              },
              role: userData.role
            }));
          } else {
            // Fallback if user data doesn't exist
            dispatch(setUser({
              uid: firebaseUser.uid,
              profile: {
                uid: firebaseUser.uid,
                email: firebaseUser.email || undefined,
                name: firebaseUser.displayName || undefined
              },
              role: "member" // Default role
            }));
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          // Fallback to basic user info
          dispatch(setUser({
            uid: firebaseUser.uid,
            profile: {
              uid: firebaseUser.uid,
              email: firebaseUser.email || undefined,
              name: firebaseUser.displayName || undefined
            },
            role: "member" // Default role
          }));
        }
      } else {
        dispatch(clearUser());
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [dispatch]);

  if (loading) {
    return <LoadingScreen />;
  }

  const renderRoleBasedStack = () => {
    if (!user.uid || !userRole) {
      return <Stack.Screen name="Auth" component={AuthFlow} />;
    }

    switch (userRole) {
      case "admin":
        return <Stack.Screen name="AdminTabs" component={AdminTabNavigator} />;
      case "trainer":
        return <Stack.Screen name="TrainerTabs" component={TrainerTabNavigator} />;
      case "member":
        return <Stack.Screen name="MemberTabs" component={MemberTabNavigator} />;
      default:
        return <Stack.Screen name="Auth" component={AuthFlow} />;
    }
  };

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {renderRoleBasedStack()}
    </Stack.Navigator>
  );
}
