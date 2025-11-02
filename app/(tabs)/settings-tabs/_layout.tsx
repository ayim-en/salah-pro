import { Stack } from "expo-router";
import { Colors, Spacings, Typography } from "react-native-ui-lib";

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

export default function SettingsStack() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" options={{}} />
      <Stack.Screen
        name="(tabs)/settings-notifications"
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="(tabs)/settings-prayer-times"
        options={{
          headerShown: true,
        }}
      />
    </Stack>
  );
}
