import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        // TODO: change tabBackgroundImage to be based on upcoming prayer
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Tabs.Screen
        // TODO: change tabBackgroundImage to be based on upcoming prayer
        name="qibla"
        options={{
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="settings-tabs"
        options={{
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
