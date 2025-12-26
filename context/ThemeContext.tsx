import { Prayer, prayerThemeColors } from "@/constants/prayers";
import React, { createContext, useContext, useState } from "react";

interface ThemeColors {
  active: string;
  inactive: string;
}

interface ThemeContextType {
  colors: ThemeColors;
  setColors: (colors: ThemeColors) => void;
  // Theme override - allows manual selection of prayer theme
  themePrayer: Prayer | null;
  setThemePrayer: (prayer: Prayer | null) => void;
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

  // Theme override: allow manual selection of prayer theme
  const [themePrayer, setThemePrayer] = useState<Prayer | null>(null);

  // Track the current prayer for dark mode calculation
  const [currentPrayer, setCurrentPrayer] = useState<Prayer | null>(null);

  // Calculate dark mode based on theme prayer or current prayer
  const activePrayer = themePrayer || currentPrayer;
  const isDarkMode = activePrayer
    ? DARK_MODE_PRAYERS.includes(activePrayer)
    : false;

  // Override colors when themePrayer is set
  const effectiveSetColors = (newColors: ThemeColors) => {
    if (!themePrayer) {
      setColors(newColors);
    }
  };

  // Apply theme prayer colors when themePrayer changes
  React.useEffect(() => {
    if (themePrayer) {
      const themeColors = prayerThemeColors[themePrayer];
      if (themeColors) {
        setColors(themeColors);
      }
    }
  }, [themePrayer]);

  return (
    <ThemeContext.Provider
      value={{
        colors,
        setColors: effectiveSetColors,
        themePrayer,
        setThemePrayer,
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
