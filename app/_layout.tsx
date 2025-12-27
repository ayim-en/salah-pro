import { PrayerSettingsProvider } from "@/context/PrayerSettingsContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { Stack } from "expo-router";
import React from "react";
import { Colors, Spacings, Typography } from "react-native-ui-lib";
import "./global.css";

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
  return (
    <PrayerSettingsProvider>
      <ThemeProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </ThemeProvider>
    </PrayerSettingsProvider>
  );
}
