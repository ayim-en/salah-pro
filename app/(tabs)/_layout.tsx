import { useThemeColors } from "@/context/ThemeContext";
import { Tabs } from "expo-router";
import React from "react";
import { Icon } from "react-native-ui-lib";

export default function TabLayout() {
  const { colors } = useThemeColors();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          borderTopWidth: 0,
          height: 80,
          justifyContent: "center",
          alignItems: "center",
          paddingTop: 6,
          paddingBottom: 12,
        },
        tabBarIconStyle: {
          marginTop: 0,
        },
        tabBarActiveTintColor: colors.active,
        tabBarInactiveTintColor: colors.inactive,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon
              source={require("../../assets/images/prayer-pro-icons/bottom-tab/icon-home.png")}
              size={size}
              tintColor={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="qibla"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon
              source={require("../../assets/images/prayer-pro-icons/bottom-tab/icon-compass.png")}
              size={size}
              tintColor={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon
              source={require("../../assets/images/prayer-pro-icons/bottom-tab/icon-calendar.png")}
              size={size}
              tintColor={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings-tabs"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon
              source={require("../../assets/images/prayer-pro-icons/bottom-tab/icon-settings.png")}
              size={size}
              tintColor={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
