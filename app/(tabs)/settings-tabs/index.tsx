import { useRouter } from "expo-router";
import { Button, Text, View } from "react-native";

export default function SettingsHome() {
  const router = useRouter();
  return (
    <View className="flex-1 items-center p-6">
      <View className="flex-1 justify-center max-w-[960px] mx-auto">
        <Text className="text-6xl font-bold">Settings</Text>
      </View>
      <Button
        title="Go to Notifications"
        onPress={() => router.navigate("/settings-tabs/settings-notifications")}
      />
      <Button
        title="Go to Prayer Times"
        onPress={() => router.navigate("/settings-tabs/settings-prayer-times")}
      />
    </View>
  );
}
