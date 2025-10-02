import { createStackNavigator } from "@react-navigation/stack";
import OpeningScreen from "../screens/Auth/OpeningScreen";

const Stack = createStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="OpeningScreen" component={OpeningScreen} />
    </Stack.Navigator>
  );
}
