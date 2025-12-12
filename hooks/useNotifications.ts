import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export const useNotifications = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState<
    Record<string, boolean>
  >({});

  // Load notification states from AsyncStorage on mount
  useEffect(() => {
    (async () => {
      try {
        const savedNotifications = await AsyncStorage.getItem(
          "prayerNotifications"
        );
        if (savedNotifications) {
          setNotificationsEnabled(JSON.parse(savedNotifications));
        }
      } catch (err: any) {
        console.error(
          "Failed to load notification settings:",
          err?.message ?? err
        );
      }
    })();
  }, []);

  // Toggles notification states for each prayer
  const toggleNotification = async (prayer: string) => {
    setNotificationsEnabled((prev) => {
      const updated = { ...prev };
      updated[prayer] = !updated[prayer];

      // Store notification states in AsyncStorage
      AsyncStorage.setItem(
        "prayerNotifications",
        JSON.stringify(updated)
      ).catch((err: any) => {
        const errorMessage =
          err?.message ?? "Failed to save notification settings";
        console.error("AsyncStorage save error:", errorMessage);
      });

      return updated;
    });
  };

  return { notificationsEnabled, toggleNotification };
};
