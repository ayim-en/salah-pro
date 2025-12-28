import { CalendarSettingsProvider } from "@/context/CalendarSettingsContext";
import { NotificationSettingsProvider } from "@/context/NotificationSettingsContext";
import { PrayerSettingsProvider } from "@/context/PrayerSettingsContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { useColorScheme, View } from "react-native";
import { Colors, Spacings, Typography } from "react-native-ui-lib";
import "./global.css";

// Keep splash screen visible briefly
SplashScreen.preventAutoHideAsync();

Colors.loadColors({
  primary: "#3B82F6",
  background: "#FFFFFF",
  text: "#111",
  tabActive: "#568FAF",
  tabInactive: "#8398a3",
});

Typography.loadTypographies({
  heading: { fontSize: 22, fontWeight: "600" },
  body: { fontSize: 16 },
});

Spacings.loadSpacings({
  page: 16,
  card: 8,
});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? "#1a1a2e" : "#ffffff" }}>
      <PrayerSettingsProvider>
        <CalendarSettingsProvider>
          <NotificationSettingsProvider>
            <ThemeProvider>
              <Stack
                screenOptions={{
                  headerShown: false,
                  contentStyle: {
                    backgroundColor: isDark ? "#1a1a2e" : "#ffffff",
                  },
                }}
              />
            </ThemeProvider>
          </NotificationSettingsProvider>
        </CalendarSettingsProvider>
      </PrayerSettingsProvider>
    </View>
  );
}
