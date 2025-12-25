import { HOLIDAY_DESCRIPTIONS } from "@/constants/holidays";
import { darkModeColors, lightModeColors } from "@/constants/prayers";
import {
  useAnimatedBackgroundColor,
  useAnimatedTextColor,
} from "@/hooks/useAnimatedColor";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Modal,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import Reanimated from "react-native-reanimated";

// Animation constants
const ANIMATION_DURATION_IN = 250;
const ANIMATION_DURATION_OUT = 200;
const OVERLAY_OPACITY = "rgba(0,0,0,0.35)";

interface HolidayBottomSheetProps {
  visible: boolean;
  holidays: string[];
  isDarkMode: boolean;
  colors: { active: string; inactive: string };
  onClose: () => void;
}

export function HolidayBottomSheet({
  visible,
  holidays,
  isDarkMode,
  colors,
  onClose,
}: HolidayBottomSheetProps) {
  // Colors based on dark mode
  const themeColors = isDarkMode ? darkModeColors : lightModeColors;

  // Animated styles
  const animatedBgStyle = useAnimatedBackgroundColor(themeColors.background);
  const animatedHandleStyle = useAnimatedBackgroundColor(colors.inactive);
  const animatedActiveTextStyle = useAnimatedTextColor(colors.active);
  const animatedInactiveTextStyle = useAnimatedTextColor(colors.inactive);
  const animatedSectionTitleStyle = useAnimatedTextColor(themeColors.sectionTitle);
  const animatedContentTextStyle = useAnimatedTextColor(themeColors.text);

  const sheetAnim = useRef(new Animated.Value(0)).current;
  const { height: screenHeight } = Dimensions.get("window");
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Animate sheet sliding up when visible
  useEffect(() => {
    if (visible) {
      sheetAnim.setValue(screenHeight);
      Animated.timing(sheetAnim, {
        toValue: 0,
        duration: ANIMATION_DURATION_IN,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }
  }, [visible, screenHeight, sheetAnim]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  // Animate sheet sliding down before closing
  const closeWithAnimation = () => {
    Animated.timing(sheetAnim, {
      toValue: screenHeight,
      duration: ANIMATION_DURATION_OUT,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start();

    closeTimeoutRef.current = setTimeout(() => {
      onClose();
    }, ANIMATION_DURATION_OUT);
  };

  // Show holiday name as title for single holiday, or generic title for multiple
  const title =
    holidays.length > 1 ? "Holiday Details" : holidays[0] || "Holiday";

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={closeWithAnimation}
      accessibilityViewIsModal
    >
      <View className="flex-1" style={{ backgroundColor: OVERLAY_OPACITY }}>
        <Pressable
          className="flex-1"
          onPress={closeWithAnimation}
          accessible={false}
        />
        <View className="absolute left-0 right-0" style={{ bottom: 0 }}>
          <Animated.View style={{ transform: [{ translateY: sheetAnim }] }}>
            <Reanimated.View
              className="rounded-t-3xl p-5"
              style={animatedBgStyle}
            >
              {/* Handle indicator */}
              <View className="mb-2 items-center">
                <Reanimated.View
                  className="h-1.5 w-12 rounded-full"
                  style={animatedHandleStyle}
                  accessibilityLabel="Swipe indicator"
                />
              </View>

              {/* Title */}
              <Reanimated.Text
                className="text-2xl font-bold mt-3"
                style={animatedActiveTextStyle}
                accessibilityRole="header"
              >
                {title}
              </Reanimated.Text>

              {/* Content */}
              <ScrollView
                className="max-h-56"
                contentContainerStyle={{
                  paddingVertical: 12,
                  paddingBottom: 12,
                }}
              >
                {holidays.map((name: string, idx: number) => (
                  <View key={`${name}-${idx}`} className="mb-6">
                    {holidays.length > 1 && (
                      <Reanimated.Text
                        className="text-lg font-semibold mb-1"
                        style={animatedSectionTitleStyle}
                        accessibilityRole="header"
                      >
                        {name}
                      </Reanimated.Text>
                    )}
                    <Reanimated.Text
                      className="text-base"
                      style={animatedContentTextStyle}
                    >
                      {HOLIDAY_DESCRIPTIONS[name] ||
                        "Description not available."}
                    </Reanimated.Text>
                  </View>
                ))}
              </ScrollView>

              {/* Close button */}
              <View className="mt-10 items-center">
                <Pressable
                  onPress={closeWithAnimation}
                  accessibilityRole="button"
                  accessibilityLabel="Close holiday details"
                >
                  <Reanimated.Text
                    className="text-center font-semibold"
                    style={animatedInactiveTextStyle}
                  >
                    Close
                  </Reanimated.Text>
                </Pressable>
              </View>
            </Reanimated.View>
          </Animated.View>
        </View>
      </View>
    </Modal>
  );
}
