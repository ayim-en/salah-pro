import { QiblaCompass } from "@/components/QiblaCompass";
import { QiblaHeader } from "@/components/QiblaHeader";
import { prayerBackgrounds } from "@/constants/prayers";
import { useDeviceHeading } from "@/hooks/useDeviceHeading";
import { useLocation } from "@/hooks/useLocation";
import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import { useQiblaDirection } from "@/hooks/useQiblaDirection";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function Qibla() {
  const { location, locationName, error: locationError } = useLocation();
  const { qiblaData, loading, error: qiblaError } = useQiblaDirection(location);
  const { nextPrayer } = usePrayerTimes(location);
  const deviceHeading = useDeviceHeading();

  const error = locationError || qiblaError;

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
      {/* //TODO Change out helper text*/}
      {qiblaData && (
        <View className="absolute bottom-24 left-0 right-0 px-6">
          <Text className="text-sm text-gray-600 text-center">
            The green arrow points to the Qibla direction
          </Text>
          <Text className="text-xs text-gray-500 mt-2 text-center">
            Device heading: {Math.round(deviceHeading + 360) % 360}°
          </Text>
        </View>
      )}
    </View>
  );
}
