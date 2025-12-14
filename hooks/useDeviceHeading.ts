import * as Location from "expo-location";
import { useEffect, useState } from "react";

export const useDeviceHeading = () => {
  const [heading, setHeading] = useState(0);

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    const startWatchingHeading = async () => {
      try {
        // Request permission if not already granted
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.warn("Location permission not granted for compass");
          return;
        }

        // Watch device heading (compass)
        subscription = await Location.watchHeadingAsync((headingData) => {
          // magHeading is the magnetic heading in degrees (0-360)
          // trueHeading is adjusted for magnetic declination (more accurate)
          const compassHeading = headingData.trueHeading ?? headingData.magHeading;
          setHeading(Math.round(compassHeading));
        });
      } catch (error) {
        console.error("Error watching heading:", error);
      }
    };

    startWatchingHeading();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  return heading;
};