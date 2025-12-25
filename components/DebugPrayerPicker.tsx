import { Prayers, prayerThemeColors } from "@/constants/prayers";
import { useThemeColors } from "@/context/ThemeContext";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

/**
 * Debug component for testing prayer theme transitions.
 * Shows a floating button that opens a picker to manually select a prayer theme.
 */
export const DebugPrayerPicker = () => {
  const [showPicker, setShowPicker] = useState(false);
  const { debugPrayer, setDebugPrayer } = useThemeColors();

  return (
    <>
      {/* Floating toggle button */}
      <TouchableOpacity
        onPress={() => setShowPicker(!showPicker)}
        style={{
          position: "absolute",
          top: 60,
          right: 16,
          zIndex: 1000,
          backgroundColor: "rgba(0,0,0,0.7)",
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 20,
        }}
      >
        <Text style={{ color: "white", fontSize: 12, fontWeight: "bold" }}>
          🎨 {debugPrayer || "Auto"}
        </Text>
      </TouchableOpacity>

      {/* Prayer picker dropdown */}
      {showPicker && (
        <View
          style={{
            position: "absolute",
            top: 100,
            right: 16,
            zIndex: 1000,
            backgroundColor: "white",
            borderRadius: 12,
            padding: 8,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setDebugPrayer(null);
              setShowPicker(false);
            }}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 16,
              backgroundColor: !debugPrayer ? "#eee" : "transparent",
              borderRadius: 8,
              marginBottom: 4,
            }}
          >
            <Text style={{ fontWeight: !debugPrayer ? "bold" : "normal" }}>
              🔄 Auto (Real Time)
            </Text>
          </TouchableOpacity>
          {Prayers.map((prayer) => (
            <TouchableOpacity
              key={prayer}
              onPress={() => {
                setDebugPrayer(prayer);
                setShowPicker(false);
              }}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 16,
                backgroundColor:
                  debugPrayer === prayer
                    ? prayerThemeColors[prayer].active
                    : "transparent",
                borderRadius: 8,
                marginBottom: 4,
              }}
            >
              <Text
                style={{
                  color: debugPrayer === prayer ? "white" : "black",
                  fontWeight: debugPrayer === prayer ? "bold" : "normal",
                }}
              >
                {prayer}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </>
  );
};
