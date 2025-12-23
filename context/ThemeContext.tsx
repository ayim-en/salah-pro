import { Prayer, prayerThemeColors } from "@/constants/prayers";
import React, { createContext, useContext, useState } from "react";

interface ThemeColors {
  active: string;
  inactive: string;
}

interface ThemeContextType {
  colors: ThemeColors;
  setColors: (colors: ThemeColors) => void;
  // Debug mode
  debugPrayer: Prayer | null;
  setDebugPrayer: (prayer: Prayer | null) => void;
  // Dark mode for Maghrib and Isha
  isDarkMode: boolean;
  currentPrayer: Prayer | null;
  setCurrentPrayer: (prayer: Prayer | null) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Prayers that trigger dark mode
const DARK_MODE_PRAYERS: Prayer[] = ["Maghrib", "Isha"];

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [colors, setColors] = useState<ThemeColors>({
    active: "#568FAF",
    inactive: "#8398a3",
  });

  // Debug: allow manual prayer override for testing themes
  const [debugPrayer, setDebugPrayer] = useState<Prayer | null>(null);

  // Track the current prayer for dark mode calculation
  const [currentPrayer, setCurrentPrayer] = useState<Prayer | null>(null);

  // Calculate dark mode based on debug prayer or current prayer
  const activePrayer = debugPrayer || currentPrayer;
  const isDarkMode = activePrayer
    ? DARK_MODE_PRAYERS.includes(activePrayer)
    : false;

  // Override colors when debugPrayer is set
  const effectiveSetColors = (newColors: ThemeColors) => {
    if (!debugPrayer) {
      setColors(newColors);
    }
  };

  // Apply debug prayer colors when debugPrayer changes
  React.useEffect(() => {
    if (debugPrayer) {
      const themeColors = prayerThemeColors[debugPrayer];
      if (themeColors) {
        setColors(themeColors);
      }
    }
  }, [debugPrayer]);

  return (
    <ThemeContext.Provider
      value={{
        colors,
        setColors: effectiveSetColors,
        debugPrayer,
        setDebugPrayer,
        isDarkMode,
        currentPrayer,
        setCurrentPrayer,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeColors = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeColors must be used within ThemeProvider");
  }
  return context;
};
