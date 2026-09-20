import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import RoleSelectScreen from "../screens/RoleSelectScreen";
import OnboardingScreen from "../screens/resident/OnboardingScreen";
import LoginScreen from "../screens/resident/LoginScreen";
import SetupScreen from "../screens/resident/SetupScreen";
import DealDetailScreen from "../screens/resident/DealDetailScreen";
import CodeReceivedScreen from "../screens/resident/CodeReceivedScreen";
import ResidentTabs from "./ResidentTabs";

import MerchantOnboardingScreen from "../screens/merchant/MerchantOnboardingScreen";
import MerchantTabs from "./MerchantTabs";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="RoleSelect">
        <Stack.Screen name="RoleSelect" component={RoleSelectScreen} />

        {/* 주민앱 플로우 */}
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Setup" component={SetupScreen} />
        <Stack.Screen name="ResidentTabs" component={ResidentTabs} />
        <Stack.Screen name="DealDetail" component={DealDetailScreen} />
        <Stack.Screen name="CodeReceived" component={CodeReceivedScreen} options={{ presentation: "modal" }} />

        {/* 사장님앱 플로우 */}
        <Stack.Screen name="MerchantOnboarding" component={MerchantOnboardingScreen} />
        <Stack.Screen name="MerchantTabs" component={MerchantTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
