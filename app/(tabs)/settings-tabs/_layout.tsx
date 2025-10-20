import { Stack } from "expo-router";

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
