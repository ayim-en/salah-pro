import { AnimatedCrossfadeImage } from "@/components/AnimatedCrossfadeImage";
import { AnimatedTintIcon } from "@/components/AnimatedTintIcon";
import { CALENDAR_METHODS } from "@/constants/calendarSettings";
import {
  CALCULATION_METHODS,
  LATITUDE_ADJUSTMENTS,
  SCHOOLS,
  TUNABLE_PRAYERS,
  TunablePrayer,
} from "@/constants/prayerSettings";
import {
  darkModeColors,
  lightModeColors,
  prayerBackgrounds,
  Prayers,
  prayerThemeColors,
} from "@/constants/prayers";
import { useCalendarSettings } from "@/context/CalendarSettingsContext";
import { useNotificationSettings } from "@/context/NotificationSettingsContext";
import { usePrayerSettings } from "@/context/PrayerSettingsContext";
import { useThemeColors } from "@/context/ThemeContext";
import {
  useAnimatedBackgroundColor,
  useAnimatedTextColor,
} from "@/hooks/useAnimatedColor";
import React, { useCallback, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  SectionList,
  Switch,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import Animated from "react-native-reanimated";

// Enable LayoutAnimation on Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type SettingsItem = {
  id: string;
  content: React.ReactNode;
};

type SettingsSection = {
  id: string;
  title: string;
  icon: any;
  data: SettingsItem[];
};

type PickerType = "method" | "school" | "latitude" | "tune" | "calendarMethod";

export default function SettingsHome() {
  const { colors, isDarkMode, currentPrayer, themePrayer, setThemePrayer } = useThemeColors();
  const { settings, updateSettings, updateTune } = usePrayerSettings();
  const { settings: calendarSettings, updateSettings: updateCalendarSettings } = useCalendarSettings();
  const { masterToggle, toggleMasterNotifications } = useNotificationSettings();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set()
  );
  const [expandedPickers, setExpandedPickers] = useState<Set<PickerType>>(
    new Set()
  );

  const togglePicker = useCallback((picker: PickerType) => {
    setExpandedPickers((prev) => {
      const next = new Set(prev);
      if (next.has(picker)) {
        next.delete(picker);
      } else {
        next.add(picker);
      }
      return next;
    });
  }, []);

  const bgColor = isDarkMode
    ? darkModeColors.background
    : lightModeColors.background;

  // Get the background image based on theme prayer or current prayer
  const displayPrayer = themePrayer || currentPrayer;
  const backgroundImage = displayPrayer
    ? prayerBackgrounds[displayPrayer] || prayerBackgrounds.Fajr
    : prayerBackgrounds.Fajr;
  const textColor = isDarkMode ? darkModeColors.text : lightModeColors.text;
  const secondaryTextColor = isDarkMode
    ? darkModeColors.textSecondary
    : lightModeColors.textSecondary;
  const separatorColor = isDarkMode
    ? "rgba(255,255,255,0.1)"
    : "rgba(0,0,0,0.08)";

  const animatedBgStyle = useAnimatedBackgroundColor(bgColor);
  const animatedTextStyle = useAnimatedTextColor(textColor);
  const animatedSecondaryTextStyle = useAnimatedTextColor(secondaryTextColor);
  const animatedActiveTextStyle = useAnimatedTextColor(colors.active);
  const animatedSelectedBgStyle = useAnimatedBackgroundColor(colors.active + "20");
  const animatedSeparatorStyle = useAnimatedBackgroundColor(separatorColor);

  const toggleSection = useCallback((id: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const sections: SettingsSection[] = [
    {
      id: "prayer-times",
      title: "Prayer Times",
      icon: require("../../../assets/images/prayer-pro-icons/settings-tab/settings-prayer-times.png"),
      data: [
        {
          id: "prayer-times-content",
          content: (
            <View className="gap-2">
              {/* Calculation Method Dropdown */}
              <View>
                <TouchableOpacity
                  onPress={() => togglePicker("method")}
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
                      {CALCULATION_METHODS.find((m) => m.id === settings.method)
                        ?.name || "Select Method"}
                    </Animated.Text>
                  </View>
                  <Animated.View
                    style={{
                      transform: [
                        {
                          rotate: expandedPickers.has("method")
                            ? "180deg"
                            : "0deg",
                        },
                      ],
                    }}
                  >
                    <AnimatedTintIcon
                      source={require("../../../assets/images/prayer-pro-icons/settings-tab/settings-dropdown.png")}
                      size={16}
                      tintColor={colors.active}
                    />
                  </Animated.View>
                </TouchableOpacity>
                {expandedPickers.has("method") && (
                  <ScrollView
                    className="mt-1"
                    style={{ maxHeight: 250 }}
                    nestedScrollEnabled
                  >
                    {CALCULATION_METHODS.map((method) => {
                      const isSelected = settings.method === method.id;
                      return (
                        <TouchableOpacity
                          key={method.id}
                          onPress={() => {
                            updateSettings({ method: method.id });
                            togglePicker("method");
                          }}
                          className="flex-row items-center py-2 pl-4"
                        >
                          <Animated.Text
                            className="flex-1"
                            style={isSelected ? animatedActiveTextStyle : animatedSecondaryTextStyle}
                          >
                            {method.name}
                          </Animated.Text>
                          {isSelected && (
                            <Animated.Text style={animatedActiveTextStyle}>
                              ✓
                            </Animated.Text>
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                )}
              </View>

              <Animated.View className="my-2" style={[{ height: 1 }, animatedSeparatorStyle]} />

              {/* School Dropdown */}
              <View>
                <TouchableOpacity
                  onPress={() => togglePicker("school")}
                  className="flex-row items-center py-2"
                >
                  <View className="flex-1">
                    <Animated.Text
                      className="text-base font-medium"
                      style={animatedTextStyle}
                    >
                      School (Asr Calculation)
                    </Animated.Text>
                    <Animated.Text
                      className="text-sm"
                      style={animatedActiveTextStyle}
                    >
                      {SCHOOLS.find((s) => s.id === settings.school)?.name ||
                        "Select School"}
                    </Animated.Text>
                  </View>
                  <Animated.View
                    style={{
                      transform: [
                        {
                          rotate: expandedPickers.has("school")
                            ? "180deg"
                            : "0deg",
                        },
                      ],
                    }}
                  >
                    <AnimatedTintIcon
                      source={require("../../../assets/images/prayer-pro-icons/settings-tab/settings-dropdown.png")}
                      size={16}
                      tintColor={colors.active}
                    />
                  </Animated.View>
                </TouchableOpacity>
                {expandedPickers.has("school") && (
                  <View className="mt-1">
                    {SCHOOLS.map((school) => {
                      const isSelected = settings.school === school.id;
                      return (
                        <TouchableOpacity
                          key={school.id}
                          onPress={() => {
                            updateSettings({ school: school.id });
                            togglePicker("school");
                          }}
                          className="flex-row items-center py-2 pl-4"
                        >
                          <View className="flex-1">
                            <Animated.Text
                              style={isSelected ? animatedActiveTextStyle : animatedSecondaryTextStyle}
                            >
                              {school.name}
                            </Animated.Text>
                            <Animated.Text
                              className="text-xs"
                              style={animatedSecondaryTextStyle}
                            >
                              {school.description}
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

              {/* Latitude Adjustment Dropdown */}
              <View>
                <TouchableOpacity
                  onPress={() => togglePicker("latitude")}
                  className="flex-row items-center py-2"
                >
                  <View className="flex-1">
                    <Animated.Text
                      className="text-base font-medium"
                      style={animatedTextStyle}
                    >
                      High Latitude Adjustment
                    </Animated.Text>
                    <Animated.Text
                      className="text-sm"
                      style={animatedActiveTextStyle}
                    >
                      {LATITUDE_ADJUSTMENTS.find(
                        (l) => l.id === settings.latitudeAdjustmentMethod
                      )?.name || "None"}
                    </Animated.Text>
                  </View>
                  <Animated.View
                    style={{
                      transform: [
                        {
                          rotate: expandedPickers.has("latitude")
                            ? "180deg"
                            : "0deg",
                        },
                      ],
                    }}
                  >
                    <AnimatedTintIcon
                      source={require("../../../assets/images/prayer-pro-icons/settings-tab/settings-dropdown.png")}
                      size={16}
                      tintColor={colors.active}
                    />
                  </Animated.View>
                </TouchableOpacity>
                {expandedPickers.has("latitude") && (
                  <View className="mt-1">
                    {LATITUDE_ADJUSTMENTS.map((adjustment) => {
                      const isSelected = settings.latitudeAdjustmentMethod === adjustment.id;
                      return (
                        <TouchableOpacity
                          key={adjustment.id ?? "none"}
                          onPress={() => {
                            updateSettings({
                              latitudeAdjustmentMethod: adjustment.id,
                            });
                            togglePicker("latitude");
                          }}
                          className="flex-row items-center py-2 pl-4"
                        >
                          <View className="flex-1">
                            <Animated.Text
                              style={isSelected ? animatedActiveTextStyle : animatedSecondaryTextStyle}
                            >
                              {adjustment.name}
                            </Animated.Text>
                            <Animated.Text
                              className="text-xs"
                              style={animatedSecondaryTextStyle}
                            >
                              {adjustment.description}
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

              {/* Custom Adjustments (Tune) Dropdown */}
              <View>
                <TouchableOpacity
                  onPress={() => togglePicker("tune")}
                  className="flex-row items-center py-2"
                >
                  <View className="flex-1">
                    <Animated.Text
                      className="text-base font-medium"
                      style={animatedTextStyle}
                    >
                      Custom Adjustments
                    </Animated.Text>
                    <Animated.Text
                      className="text-sm"
                      style={animatedActiveTextStyle}
                    >
                      ({TUNABLE_PRAYERS.map((p) => {
                        const v = settings.tune[p.key];
                        return v > 0 ? `+${v}` : `${v}`;
                      }).join(", ")})
                    </Animated.Text>
                  </View>
                  <Animated.View
                    style={{
                      transform: [
                        {
                          rotate: expandedPickers.has("tune")
                            ? "180deg"
                            : "0deg",
                        },
                      ],
                    }}
                  >
                    <AnimatedTintIcon
                      source={require("../../../assets/images/prayer-pro-icons/settings-tab/settings-dropdown.png")}
                      size={16}
                      tintColor={colors.active}
                    />
                  </Animated.View>
                </TouchableOpacity>
                {expandedPickers.has("tune") && (
                  <View className="mt-1">
                    {TUNABLE_PRAYERS.map((prayer) => {
                      const tuneValue = settings.tune[prayer.key];
                      const hasAdjustment = tuneValue !== 0;
                      return (
                        <View
                          key={prayer.key}
                          className="flex-row items-center justify-between py-2 pl-4"
                        >
                          <Animated.Text
                            style={hasAdjustment ? animatedActiveTextStyle : animatedSecondaryTextStyle}
                          >
                            {prayer.label}
                          </Animated.Text>
                          <View className="flex-row items-center">
                            <TouchableOpacity
                              onPress={() =>
                                updateTune(prayer.key as TunablePrayer, tuneValue - 1)
                              }
                              className="w-7 h-7 rounded-full items-center justify-center"
                              style={{ backgroundColor: colors.active + "20" }}
                            >
                              <Animated.Text
                                className="text-base font-bold"
                                style={animatedActiveTextStyle}
                              >
                                −
                              </Animated.Text>
                            </TouchableOpacity>
                            <Animated.Text
                              className="w-10 text-center font-medium"
                              style={hasAdjustment ? animatedActiveTextStyle : animatedSecondaryTextStyle}
                            >
                              {tuneValue > 0 ? `+${tuneValue}` : tuneValue}
                            </Animated.Text>
                            <TouchableOpacity
                              onPress={() =>
                                updateTune(prayer.key as TunablePrayer, tuneValue + 1)
                              }
                              className="w-7 h-7 rounded-full items-center justify-center"
                              style={{ backgroundColor: colors.active + "20" }}
                            >
                              <Animated.Text
                                className="text-base font-bold"
                                style={animatedActiveTextStyle}
                              >
                                +
                              </Animated.Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                )}
              </View>
            </View>
          ),
        },
      ],
    },
    {
      id: "themes",
      title: "Themes",
      icon: require("../../../assets/images/prayer-pro-icons/settings-tab/settings-theme.png"),
      data: [
        {
          id: "themes-content",
          content: (
            <View className="flex-row flex-wrap gap-2">
              {/* Auto option */}
              <TouchableOpacity
                onPress={() => setThemePrayer(null)}
                className="rounded-xl px-4 py-3"
                style={{
                  backgroundColor: !themePrayer
                    ? colors.active
                    : isDarkMode
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.05)",
                }}
              >
                <Animated.Text
                  className="font-semibold"
                  style={{
                    color: !themePrayer
                      ? "#fff"
                      : isDarkMode
                      ? darkModeColors.textSecondary
                      : lightModeColors.textSecondary,
                  }}
                >
                  Auto
                </Animated.Text>
              </TouchableOpacity>
              {/* Prayer theme options */}
              {Prayers.map((prayer) => {
                const isSelected = themePrayer === prayer;
                const themeColor = prayerThemeColors[prayer].active;
                return (
                  <TouchableOpacity
                    key={prayer}
                    onPress={() => setThemePrayer(prayer)}
                    className="rounded-xl px-4 py-3"
                    style={{
                      backgroundColor: isSelected
                        ? themeColor
                        : isDarkMode
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(0,0,0,0.05)",
                    }}
                  >
                    <Animated.Text
                      className="font-semibold"
                      style={{
                        color: isSelected
                          ? "#fff"
                          : themeColor,
                      }}
                    >
                      {prayer}
                    </Animated.Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ),
        },
      ],
    },
    {
      id: "notifications",
      title: "Notifications",
      icon: require("../../../assets/images/prayer-pro-icons/home-page/icon-notify-on.png"),
      data: [
        {
          id: "notifications-content",
          content: (
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Animated.Text
                  className="text-base font-medium"
                  style={animatedTextStyle}
                >
                  Prayer Notifications
                </Animated.Text>
                <Animated.Text
                  className="text-sm"
                  style={animatedActiveTextStyle}
                >
                  {masterToggle ? "On" : "Off"}
                </Animated.Text>
              </View>
              <Switch
                value={masterToggle}
                onValueChange={toggleMasterNotifications}
                trackColor={{
                  false: colors.inactive,
                  true: colors.active,
                }}
                thumbColor="#fff"
                ios_backgroundColor={colors.inactive}
              />
            </View>
          ),
        },
      ],
    },
    {
      id: "calendar",
      title: "Calendar",
      icon: require("../../../assets/images/prayer-pro-icons/settings-tab/settings-calendar.png"),
      data: [
        {
          id: "calendar-content",
          content: (
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
                      {CALENDAR_METHODS.find((m) => m.id === calendarSettings.calendarMethod)
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
                      source={require("../../../assets/images/prayer-pro-icons/settings-tab/settings-dropdown.png")}
                      size={16}
                      tintColor={colors.active}
                    />
                  </Animated.View>
                </TouchableOpacity>
                {expandedPickers.has("calendarMethod") && (
                  <View className="mt-1">
                    {CALENDAR_METHODS.map((method) => {
                      const isSelected = calendarSettings.calendarMethod === method.id;
                      return (
                        <TouchableOpacity
                          key={method.id}
                          onPress={() => {
                            updateCalendarSettings({ calendarMethod: method.id });
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

              {/* Day Adjustment (only for MATHEMATICAL method) */}
              {calendarSettings.calendarMethod === "MATHEMATICAL" && (
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
                        {calendarSettings.adjustment > 0
                          ? `+${calendarSettings.adjustment} days`
                          : calendarSettings.adjustment < 0
                          ? `${calendarSettings.adjustment} days`
                          : "No adjustment"}
                      </Animated.Text>
                    </View>
                    <View className="flex-row items-center">
                      <TouchableOpacity
                        onPress={() =>
                          updateCalendarSettings({
                            adjustment: Math.max(-3, calendarSettings.adjustment - 1),
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
                          calendarSettings.adjustment !== 0
                            ? animatedActiveTextStyle
                            : animatedSecondaryTextStyle
                        }
                      >
                        {calendarSettings.adjustment > 0
                          ? `+${calendarSettings.adjustment}`
                          : calendarSettings.adjustment}
                      </Animated.Text>
                      <TouchableOpacity
                        onPress={() =>
                          updateCalendarSettings({
                            adjustment: Math.min(3, calendarSettings.adjustment + 1),
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
          ),
        },
      ],
    },
    {
      id: "our-mission",
      title: "Our Mission",
      icon: require("../../../assets/images/prayer-pro-icons/settings-tab/settings-mission.png"),
      data: [
        {
          id: "our-mission-content",
          content: (
            <Animated.Text style={animatedSecondaryTextStyle}>
              Our mission coming soon...
            </Animated.Text>
          ),
        },
      ],
    },
    {
      id: "about",
      title: "About",
      icon: require("../../../assets/images/prayer-pro-icons/settings-tab/settings-about.png"),
      data: [
        {
          id: "about-content",
          content: (
            <Animated.Text style={animatedSecondaryTextStyle}>
              About information coming soon...
            </Animated.Text>
          ),
        },
      ],
    },
    {
      id: "privacy-policy",
      title: "Privacy Policy",
      icon: require("../../../assets/images/prayer-pro-icons/settings-tab/settings-privacy.png"),
      data: [
        {
          id: "privacy-policy-content",
          content: (
            <Animated.Text style={animatedSecondaryTextStyle}>
              Privacy policy coming soon...
            </Animated.Text>
          ),
        },
      ],
    },
  ];

  const renderSectionHeader = ({ section }: { section: SettingsSection }) => {
    const isExpanded = expandedSections.has(section.id);

    return (
      <Pressable
        onPress={() => toggleSection(section.id)}
        className="mx-4 mt-2"
      >
        {({ pressed }) => (
          <View
            className="flex-row items-center p-4"
            style={{ opacity: pressed ? 0.7 : 1 }}
          >
            <Animated.View
              className="w-10 h-10 rounded-lg items-center justify-center mr-3"
              style={animatedSelectedBgStyle}
            >
              <AnimatedTintIcon source={section.icon} size={22} tintColor={colors.active} />
            </Animated.View>
            <Animated.Text
              className="flex-1 text-2xl font-medium"
              style={animatedTextStyle}
            >
              {section.title}
            </Animated.Text>
            <Animated.View
              style={{
                transform: [{ rotate: isExpanded ? "180deg" : "0deg" }],
              }}
            >
              <AnimatedTintIcon
                source={require("../../../assets/images/prayer-pro-icons/settings-tab/settings-dropdown.png")}
                size={18}
                tintColor={colors.active}
              />
            </Animated.View>
          </View>
        )}
      </Pressable>
    );
  };

  const renderItem = ({
    item,
    section,
  }: {
    item: SettingsItem;
    section: SettingsSection;
  }) => {
    const isExpanded = expandedSections.has(section.id);

    if (!isExpanded) return null;

    return <View className="mx-4 mt-1 py-3 px-4">{item.content}</View>;
  };

  const SectionSeparator = useCallback(
    ({ leadingItem }: { leadingItem: any }) =>
      leadingItem ? (
        <Animated.View
          className="mx-6 my-2"
          style={[{ height: 1 }, animatedSeparatorStyle]}
        />
      ) : null,
    [animatedSeparatorStyle]
  );

  return (
    <View className="flex-1">
      <AnimatedCrossfadeImage source={backgroundImage} resizeMode="cover" />
      <View className="pt-32 pb-4 items-center">
        <Animated.Text
          className="text-7xl font-bold text-white"
          style={{
            textShadowColor: "rgba(0,0,0,0.4)",
            textShadowOffset: { width: 0, height: 2 },
            textShadowRadius: 4,
          }}
        >
          Settings
        </Animated.Text>
      </View>

      <Animated.View
        className="flex-1 rounded-t-3xl overflow-hidden mt-8"
        style={animatedBgStyle}
      >
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderSectionHeader={renderSectionHeader}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100, paddingTop: 16 }}
          stickySectionHeadersEnabled={false}
          showsVerticalScrollIndicator={false}
          SectionSeparatorComponent={SectionSeparator}
          removeClippedSubviews={false}
          scrollEventThrottle={16}
        />
      </Animated.View>
    </View>
  );
}
