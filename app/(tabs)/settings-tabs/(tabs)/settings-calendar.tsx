import React from "react";
import { Text, View } from "react-native";

export default function SettingsCalendar() {
  return (
    <View className="flex-1 items-center p-6">
      <View className="flex-1 justify-center max-w-[960px] mx-auto">
        <Text className="text-6xl font-bold">Calendar Settings</Text>
      </View>
    </View>
  );
}
