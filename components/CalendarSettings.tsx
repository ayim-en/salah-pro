import { AnimatedTintIcon } from "@/components/AnimatedTintIcon";
import { CALENDAR_METHODS, CalendarSettings as CalendarSettingsType } from "@/constants/calendarSettings";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import Animated from "react-native-reanimated";

interface CalendarSettingsProps {
  settings: CalendarSettingsType;
  updateSettings: (newSettings: Partial<CalendarSettingsType>) => Promise<void>;
  expandedPickers: Set<string>;
  togglePicker: (picker: string) => void;
  colors: { active: string; inactive: string };
  animatedTextStyle: any;
  animatedActiveTextStyle: any;
  animatedSecondaryTextStyle: any;
  animatedSeparatorStyle: any;
}

export const CalendarSettingsComponent = ({
  settings,
  updateSettings,
  expandedPickers,
  togglePicker,
  colors,
  animatedTextStyle,
  animatedActiveTextStyle,
  animatedSecondaryTextStyle,
  animatedSeparatorStyle,
}: CalendarSettingsProps) => {
  return (
    <View className="gap-2">
      {/* Calendar Method Dropdown */}
      <View>
        <TouchableOpacity
          onPress={() => togglePicker("calendarMethod")}
          className="flex-row items-center py-2"
        >
          <View className="flex-1">
            <Animated.Text
              className="text-base font-medium"
              style={animatedTextStyle}
            >
              Calculation Method
            </Animated.Text>
            <Animated.Text
              className="text-sm"
              style={animatedActiveTextStyle}
            >
              {CALENDAR_METHODS.find((m) => m.id === settings.calendarMethod)
                ?.name || "Select Method"}
            </Animated.Text>
          </View>
          <Animated.View
            style={{
              transform: [
                {
                  rotate: expandedPickers.has("calendarMethod")
                    ? "180deg"
                    : "0deg",
                },
              ],
            }}
          >
            <AnimatedTintIcon
              source={require("../assets/images/prayer-pro-icons/settings-tab/settings-dropdown.png")}
              size={16}
              tintColor={colors.active}
            />
          </Animated.View>
        </TouchableOpacity>
        {expandedPickers.has("calendarMethod") && (
          <View className="mt-1">
            {CALENDAR_METHODS.map((method) => {
              const isSelected = settings.calendarMethod === method.id;
              return (
                <TouchableOpacity
                  key={method.id}
                  onPress={() => {
                    updateSettings({ calendarMethod: method.id });
                    togglePicker("calendarMethod");
                  }}
                  className="flex-row items-center py-2 pl-4"
                >
                  <View className="flex-1">
                    <Animated.Text
                      style={isSelected ? animatedActiveTextStyle : animatedSecondaryTextStyle}
                    >
                      {method.name}
                    </Animated.Text>
                    <Animated.Text
                      className="text-xs"
                      style={animatedSecondaryTextStyle}
                    >
                      {method.description}
                    </Animated.Text>
                  </View>
                  {isSelected && (
                    <Animated.Text style={animatedActiveTextStyle}>
                      ✓
                    </Animated.Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>

      <Animated.View className="my-2" style={[{ height: 1 }, animatedSeparatorStyle]} />

      {/* Date Format Toggle */}
      <View>
        <TouchableOpacity
          onPress={() => togglePicker("dateFormat")}
          className="flex-row items-center py-2"
        >
          <View className="flex-1">
            <Animated.Text
              className="text-base font-medium"
              style={animatedTextStyle}
            >
              Date Format
            </Animated.Text>
            <Animated.Text
              className="text-sm"
              style={animatedActiveTextStyle}
            >
              {settings.carouselDateFormat === "hijri" ? "Hijri" : "Gregorian"}
            </Animated.Text>
          </View>
          <Animated.View
            style={{
              transform: [
                {
                  rotate: expandedPickers.has("dateFormat")
                    ? "180deg"
                    : "0deg",
                },
              ],
            }}
          >
            <AnimatedTintIcon
              source={require("../assets/images/prayer-pro-icons/settings-tab/settings-dropdown.png")}
              size={16}
              tintColor={colors.active}
            />
          </Animated.View>
        </TouchableOpacity>
        {expandedPickers.has("dateFormat") && (
          <View className="mt-1">
            {[
              { id: "gregorian", name: "Gregorian" },
              { id: "hijri", name: "Hijri" },
            ].map((format) => {
              const isSelected = settings.carouselDateFormat === format.id;
              return (
                <TouchableOpacity
                  key={format.id}
                  onPress={() => {
                    updateSettings({ carouselDateFormat: format.id as "gregorian" | "hijri" });
                    togglePicker("dateFormat");
                  }}
                  className="flex-row items-center py-2 pl-4"
                >
                  <Animated.Text
                    className="flex-1"
                    style={isSelected ? animatedActiveTextStyle : animatedSecondaryTextStyle}
                  >
                    {format.name}
                  </Animated.Text>
                  {isSelected && (
                    <Animated.Text style={animatedActiveTextStyle}>
                      ✓
                    </Animated.Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>

      {/* Day Adjustment (only for MATHEMATICAL method) */}
      {settings.calendarMethod === "MATHEMATICAL" && (
        <>
          <Animated.View className="my-2" style={[{ height: 1 }, animatedSeparatorStyle]} />
          <View className="flex-row items-center justify-between py-2">
            <View className="flex-1">
              <Animated.Text
                className="text-base font-medium"
                style={animatedTextStyle}
              >
                Day Adjustment
              </Animated.Text>
              <Animated.Text
                className="text-sm"
                style={animatedActiveTextStyle}
              >
                {settings.adjustment > 0
                  ? `+${settings.adjustment} days`
                  : settings.adjustment < 0
                  ? `${settings.adjustment} days`
                  : "No adjustment"}
              </Animated.Text>
            </View>
            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={() =>
                  updateSettings({
                    adjustment: Math.max(-3, settings.adjustment - 1),
                  })
                }
                className="w-8 h-8 rounded-full items-center justify-center"
                style={{ backgroundColor: colors.active + "20" }}
              >
                <Animated.Text
                  className="text-lg font-bold"
                  style={animatedActiveTextStyle}
                >
                  −
                </Animated.Text>
              </TouchableOpacity>
              <Animated.Text
                className="w-10 text-center font-medium"
                style={
                  settings.adjustment !== 0
                    ? animatedActiveTextStyle
                    : animatedSecondaryTextStyle
                }
              >
                {settings.adjustment > 0
                  ? `+${settings.adjustment}`
                  : settings.adjustment}
              </Animated.Text>
              <TouchableOpacity
                onPress={() =>
                  updateSettings({
                    adjustment: Math.min(3, settings.adjustment + 1),
                  })
                }
                className="w-8 h-8 rounded-full items-center justify-center"
                style={{ backgroundColor: colors.active + "20" }}
              >
                <Animated.Text
                  className="text-lg font-bold"
                  style={animatedActiveTextStyle}
                >
                  +
                </Animated.Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </View>
  );
};
