import { NavigationContainer, NavigatorScreenParams } from "@react-navigation/native";
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack";
import { observer } from "mobx-react-lite";
import { ComponentProps, useEffect, useRef } from "react";

import Config from "@/config";
import { useAuth } from "@/contexts/authContext";
import { useStores } from "@/models";
import * as Screens from "@/screens";
import { useAppTheme, useThemeProvider } from "@/utils/useAppTheme";

import AuthNavigator, { AuthStackParamList } from "./AuthNavigator";
import { DemoNavigator, DemoTabParamList } from "./DemoNavigator";
import { navigationRef, useBackButtonHandler } from "./navigationUtilities";

/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 */
export type AppStackParamList = AuthStackParamList &
  DemoTabParamList & {
    Welcome: undefined;
    Login: undefined;
    Demo: NavigatorScreenParams<DemoTabParamList>;
  };

/**
 * This is a list of all the route names that will exit the app if the back button
 * is pressed while in that screen. Only affects Android.
 */
const exitRoutes = Config.exitRoutes;

export type AppStackScreenProps<T extends keyof AppStackParamList> = NativeStackScreenProps<AppStackParamList, T>;

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Stack = createNativeStackNavigator<AppStackParamList>();

const AppStack = observer(function AppStack() {
  const {
    theme: { colors },
  } = useAppTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        navigationBarColor: colors.background,
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
      initialRouteName="Welcome"
    >
      <Stack.Screen name="Welcome" component={Screens.WelcomeScreen} />
      <Stack.Screen name="Demo" component={DemoNavigator} />
    </Stack.Navigator>
  );
});

export interface NavigationProps extends Partial<ComponentProps<typeof NavigationContainer<AppStackParamList>>> {}

export const AppNavigator = observer(function AppNavigator(props: NavigationProps) {
  const { themeScheme, navigationTheme, setThemeContextOverride, ThemeProvider } = useThemeProvider();
  const { authState } = useAuth();

  useBackButtonHandler((routeName) => exitRoutes.includes(routeName));

  return (
    <ThemeProvider value={{ themeScheme, setThemeContextOverride }}>
      <NavigationContainer ref={navigationRef} theme={navigationTheme} {...props}>
        {authState?.authenticated ? <AppStack /> : <AuthNavigator />}
      </NavigationContainer>
    </ThemeProvider>
  );
});
