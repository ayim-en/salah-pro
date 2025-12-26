import { AnimatedCrossfadeImage } from "@/components/AnimatedCrossfadeImage";
import { DebugPrayerPicker } from "@/components/DebugPrayerPicker";
import {
  darkModeColors,
  lightModeColors,
  prayerBackgrounds,
} from "@/constants/prayers";
import { useThemeColors } from "@/context/ThemeContext";
import {
  useAnimatedBackgroundColor,
  useAnimatedTextColor,
} from "@/hooks/useAnimatedColor";
import React, { useCallback, useMemo, useState } from "react";
import { Platform, Pressable, SectionList, UIManager, View } from "react-native";
import Animated from "react-native-reanimated";
import { Icon } from "react-native-ui-lib";

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

export default function SettingsHome() {
  const { colors, isDarkMode, currentPrayer, debugPrayer } = useThemeColors();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set()
  );

  const bgColor = isDarkMode
    ? darkModeColors.background
    : lightModeColors.background;

  // Get the background image based on the current prayer
  const displayPrayer = debugPrayer || currentPrayer;
  const backgroundImage = displayPrayer
    ? prayerBackgrounds[displayPrayer] || prayerBackgrounds.Fajr
    : prayerBackgrounds.Fajr;
  const textColor = isDarkMode ? darkModeColors.text : lightModeColors.text;
  const secondaryTextColor = isDarkMode
    ? darkModeColors.textSecondary
    : lightModeColors.textSecondary;
  const animatedBgStyle = useAnimatedBackgroundColor(bgColor);
  const animatedTextStyle = useAnimatedTextColor(textColor);
  const animatedSecondaryTextStyle = useAnimatedTextColor(secondaryTextColor);

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
      icon: require("../../../assets/images/prayer-pro-icons/bottom-tab/icon-home.png"),
      data: [
        {
          id: "prayer-times-content",
          content: (
            <Animated.Text style={animatedSecondaryTextStyle}>
              Calculation method settings coming soon...
            </Animated.Text>
          ),
        },
      ],
    },
    {
      id: "themes",
      title: "Themes",
      icon: require("../../../assets/images/prayer-pro-icons/settings-tab/icon-language.png"),
      data: [
        {
          id: "themes-content",
          content: (
            <Animated.Text style={animatedSecondaryTextStyle}>
              Theme and appearance settings coming soon...
            </Animated.Text>
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
            <Animated.Text style={animatedSecondaryTextStyle}>
              Notification settings coming soon...
            </Animated.Text>
          ),
        },
      ],
    },
    {
      id: "calendar",
      title: "Calendar",
      icon: require("../../../assets/images/prayer-pro-icons/bottom-tab/icon-calendar.png"),
      data: [
        {
          id: "calendar-content",
          content: (
            <Animated.Text style={animatedSecondaryTextStyle}>
              Calendar settings coming soon...
            </Animated.Text>
          ),
        },
      ],
    },
    {
      id: "our-mission",
      title: "Our Mission",
      icon: require("../../../assets/images/prayer-pro-icons/qibla-tab/qibla-arrow.png"),
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
      icon: require("../../../assets/images/prayer-pro-icons/calendar-tab/calendar-info.png"),
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
      icon: require("../../../assets/images/prayer-pro-icons/bottom-tab/icon-settings.png"),
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
            <View
              className="w-10 h-10 rounded-lg items-center justify-center mr-3"
              style={{ backgroundColor: colors.active + "20" }}
            >
              <Icon source={section.icon} size={22} tintColor={colors.active} />
            </View>
            <Animated.Text
              className="flex-1 text-2xl font-medium"
              style={animatedTextStyle}
            >
              {section.title}
            </Animated.Text>
            <Animated.Text
              className="text-xl font-light"
              style={[
                animatedSecondaryTextStyle,
                {
                  transform: [{ rotate: isExpanded ? "180deg" : "0deg" }],
                },
              ]}
            >
              {"v"}
            </Animated.Text>
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
        <View
          className="mx-6 my-2"
          style={{
            height: 1,
            backgroundColor: isDarkMode
              ? "rgba(255,255,255,0.1)"
              : "rgba(0,0,0,0.08)",
          }}
        />
      ) : null,
    [isDarkMode]
  );

  return (
    <View className="flex-1">
      <AnimatedCrossfadeImage source={backgroundImage} resizeMode="cover" />
      <DebugPrayerPicker />
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
