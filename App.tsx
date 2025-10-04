
import React from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { Provider } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { store } from "./src/store";
import RootNavigator from "./src/navigation/RootNavigator";
import { ThemeProvider } from "./src/contexts/ThemeContext"; 

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <PaperProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </PaperProvider>
      </ThemeProvider>
    </Provider>
  );
}
