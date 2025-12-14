import { Magnetometer } from "expo-sensors";
import { useEffect, useState } from "react";

export const useMagnetometer = () => {
  const [magnetometer, setMagnetometer] = useState(0);

  useEffect(() => {
    const subscription = Magnetometer.addListener((data) => {
      const angle = Math.atan2(data.y, data.x);
      // Convert to degrees and normalize
      const degree = (angle * 180) / Math.PI;
      setMagnetometer(Math.round(degree));
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return magnetometer;
};