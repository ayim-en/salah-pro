import { useRouter } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";

export default function SettingsHome() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <Text style={styles.title}>Settings</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
  },
  main: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 960,
    marginHorizontal: "auto",
  },
  title: {
    fontSize: 64,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 36,
    color: "#38434D",
  },
});
