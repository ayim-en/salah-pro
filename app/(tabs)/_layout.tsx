import { Tabs } from "expo-router";
import React from "react";
import { Colors, Icon } from "react-native-ui-lib";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          borderTopWidth: 0,
        },
        tabBarActiveTintColor: Colors.tabActive,
        tabBarInactiveTintColor: Colors.tabInactive,
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

