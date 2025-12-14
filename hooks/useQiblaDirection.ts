import { fetchQiblaDirection, QiblaData } from "@/prayer-api/qiblaDirectionAPI";
import * as Location from "expo-location";
import { useEffect, useState } from "react";

export const useQiblaDirection = (
  location: Location.LocationObject | null
) => {
  const [qiblaData, setQiblaData] = useState<QiblaData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!location) return;

    const getQiblaDirection = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchQiblaDirection(
          location.coords.latitude,
          location.coords.longitude
        );
        setQiblaData(data);
      } catch (err: any) {
        const errorMessage = err?.message ?? "Failed to get Qibla direction";
        console.error("Qibla direction error:", errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    getQiblaDirection();
  }, [location]);

  return { qiblaData, loading, error };
};