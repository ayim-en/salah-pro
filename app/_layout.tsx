import { Stack } from "expo-router";
import React from "react";
import { Colors, Spacings, Typography } from "react-native-ui-lib";
import "./global.css";

Colors.loadColors({
  primary: "#3B82F6",
  background: "#FFFFFF",
  text: "#111",
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
  return <Stack screenOptions={{ headerShown: false }} />;
}
