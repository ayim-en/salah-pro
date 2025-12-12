import * as Location from "expo-location";
import { useEffect, useState } from "react";

export const useLocation = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [locationName, setLocationName] = useState<string>(
    "Loading location..."
  );
  const [error, setError] = useState<string | null>(null);

  // Fetches current location on mount
  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setError("Permission to access location was denied");
          return;
        }

        let userLocation = await Location.getCurrentPositionAsync({});
        setLocation(userLocation);
      } catch (err: any) {
        const errorMessage = err?.message ?? "Failed to get location";
        console.error("Location error:", errorMessage);
        setError(errorMessage);
      }
    })();
  }, []);

  // Uses location data to get city and country name
  useEffect(() => {
    if (!location) return;

    (async () => {
      try {
        const reverseGeocode = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        if (reverseGeocode.length > 0) {
          const { city, country } = reverseGeocode[0];
          setLocationName(`${city || "Unknown"}, ${country || "Unknown"}`);
        }
      } catch (err: any) {
        const errorMessage = err?.message ?? "Failed to get location name";
        console.error("Reverse geocode error:", errorMessage);
        setLocationName("Location unavailable");
      }
    })();
  }, [location]);

  return { location, locationName, error };
};
