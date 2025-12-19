import { useRouter } from "expo-router";
import React from "react";
import { Button, Text, View } from "react-native";

export default function SettingsHome() {
  const router = useRouter();
  return (
    <View className="flex-1 items-center p-6">
      <View className="flex-1 justify-center max-w-[960px] mx-auto">
        <Text className="text-6xl font-bold">Settings</Text>
      </View>
      <Button
        title="Notifications Settings"
        onPress={() => router.navigate("/settings-tabs/settings-notifications")}
      />
      <Button
        title="Prayer Times Settings"
        onPress={() => router.navigate("/settings-tabs/settings-prayer-times")}
      />
      <Button
        title="Carousel Settings"
        onPress={() => router.navigate("/settings-tabs/settings-carousel")}
      />
      <Button
        title="Calendar Settings"
        onPress={() => router.navigate("/settings-tabs/settings-calendar")}
      />
    </View>
  );
}
