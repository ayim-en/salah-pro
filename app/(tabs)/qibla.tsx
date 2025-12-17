import { QiblaCompass } from "@/components/QiblaCompass";
import { QiblaHeader } from "@/components/QiblaHeader";
import { prayerBackgrounds } from "@/constants/prayers";
import { useThemeColors } from "@/context/ThemeContext";
import { useDeviceHeading } from "@/hooks/useDeviceHeading";
import { useLocation } from "@/hooks/useLocation";
import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import { useQiblaDirection } from "@/hooks/useQiblaDirection";
import { useIsFocused } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef } from "react";
import { ActivityIndicator, Text, Vibration, View } from "react-native";

export default function Qibla() {
  const { location, locationName, error: locationError } = useLocation();
  const { qiblaData, loading, error: qiblaError } = useQiblaDirection(location);
  const { nextPrayer } = usePrayerTimes(location);
  const deviceHeading = useDeviceHeading();
  const { colors } = useThemeColors();
  const isFacingKaabaRef = useRef(false);
  const isFocused = useIsFocused();

  const error = locationError || qiblaError;

  // Vibration only when on qibla tab
  useEffect(() => {
    if (!isFocused) {
      isFacingKaabaRef.current = false;
      return;
    }

    if (!qiblaData || deviceHeading === null) return;

    // Calculate relative angle from device heading to Kaaba
    let relativeAngle = qiblaData.direction - deviceHeading;
    // Normalize to -180 to 180 range
    relativeAngle = ((relativeAngle + 180) % 360) - 180;

    // Check if facing the Kaaba
    const isFacingKaaba = Math.abs(relativeAngle) < 2.5;

    // Trigger vibration when transitioning to facing Kaaba
    if (isFacingKaaba && !isFacingKaabaRef.current) {
      Vibration.vibrate([0, 100, 50, 100]); // Pattern: delay, vibrate, delay, vibrate
      isFacingKaabaRef.current = true;
    } else if (!isFacingKaaba && isFacingKaabaRef.current) {
      isFacingKaabaRef.current = false;
    }
  }, [isFocused, qiblaData, deviceHeading]);

  // Get the background image based on the upcoming prayer
  const backgroundImage = nextPrayer?.prayer
    ? prayerBackgrounds[nextPrayer.prayer] || prayerBackgrounds.Fajr
    : prayerBackgrounds.Fajr;

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center p-6 bg-white">
        <Text className="text-red-600 text-center">{error}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <StatusBar style="light" />
      <QiblaHeader
        qiblaDirection={qiblaData?.direction ?? null}
        locationName={locationName}
        backgroundImage={backgroundImage}
        nextPrayer={nextPrayer}
      />

      {qiblaData && (
        <View
          className="absolute top-0 left-0 right-0 bottom-0 justify-center items-center"
          pointerEvents="none"
        >
          <QiblaCompass
            magnetometer={deviceHeading}
            qiblaDirection={qiblaData.direction}
          />
        </View>
      )}
      {qiblaData && (
        <View className="absolute bottom-24 left-0 right-0 px-6">
          {(() => {
            // Calculate relative angle from device heading to Kaaba
            let relativeAngle = qiblaData.direction - deviceHeading;
            // Normalize to -180 to 180 range
            relativeAngle = ((relativeAngle + 180) % 360) - 180;

            // Determine direction guidance
            let guidance = "";
            let directionWord = "";
            if (Math.abs(relativeAngle) < 2.5) {
              guidance = "Facing the ";
              directionWord = "Kaaba";
            } else {
              // Use sine to determine if Kaaba is on left or right
              // sin > 0 = icon is on the right (0° to 180°), sin < 0 = icon is on the left (180° to 360°)
              const radians = (relativeAngle * Math.PI) / 180;
              if (Math.sin(radians) > 0) {
                guidance = "Turn to your ";
                directionWord = "right";
              } else {
                guidance = "Turn to your ";
                directionWord = "left";
              }
            }

            return (
              <View className="flex-row justify-center">
                <Text
                  className=" font-bold text-center text-[40px]"
                  style={{ color: colors.inactive }}
                >
                  {guidance}
                </Text>
                <Text
                  className=" font-bold text-center text-[40px]"
                  style={{ color: colors.active }}
                >
                  {directionWord}
                </Text>
              </View>
            );
          })()}
        </View>
      )}
    </View>
  );
}
