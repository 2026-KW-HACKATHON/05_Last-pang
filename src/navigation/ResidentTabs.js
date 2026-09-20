import React from "react";
import { Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/resident/HomeScreen";
import MyPageScreen from "../screens/resident/MyPageScreen";
import { colors } from "../theme";

const Tab = createBottomTabNavigator();

export default function ResidentTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent1,
        tabBarInactiveTintColor: colors.textFaint,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border, height: 62, paddingTop: 8, paddingBottom: 10 },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "700" },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: "홈", tabBarIcon: () => <Text style={{ fontSize: 17 }}>🏠</Text> }}
      />
      <Tab.Screen
        name="MyPage"
        component={MyPageScreen}
        options={{ tabBarLabel: "마이페이지", tabBarIcon: () => <Text style={{ fontSize: 17 }}>🐾</Text> }}
      />
    </Tab.Navigator>
  );
}
