import React from "react";
import { Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MerchantHomeScreen from "../screens/merchant/MerchantHomeScreen";
import MerchantDealCreateScreen from "../screens/merchant/MerchantDealCreateScreen";
import MerchantVerifyScreen from "../screens/merchant/MerchantVerifyScreen";
import MerchantReportScreen from "../screens/merchant/MerchantReportScreen";
import { colors } from "../theme";

const Tab = createBottomTabNavigator();

const ICONS = { home: "🏠", deal: "⚡", verify: "🔢", report: "📊" };

export default function MerchantTabs() {
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
      <Tab.Screen name="MerchantHome" component={MerchantHomeScreen} options={{ tabBarLabel: "사장님 홈", tabBarIcon: () => <Text style={{ fontSize: 17 }}>{ICONS.home}</Text> }} />
      <Tab.Screen name="MerchantDealCreate" component={MerchantDealCreateScreen} options={{ tabBarLabel: "딜 등록", tabBarIcon: () => <Text style={{ fontSize: 17 }}>{ICONS.deal}</Text> }} />
      <Tab.Screen name="MerchantVerify" component={MerchantVerifyScreen} options={{ tabBarLabel: "코드 검증", tabBarIcon: () => <Text style={{ fontSize: 17 }}>{ICONS.verify}</Text> }} />
      <Tab.Screen name="MerchantReport" component={MerchantReportScreen} options={{ tabBarLabel: "성과 리포트", tabBarIcon: () => <Text style={{ fontSize: 17 }}>{ICONS.report}</Text> }} />
    </Tab.Navigator>
  );
}
