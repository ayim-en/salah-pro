import React, { useEffect } from "react";
import { ImageSourcePropType } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
  Easing,
} from "react-native-reanimated";
import { usePreviousValue } from "@/hooks/usePreviousValue";

interface AnimatedTintIconProps {
  source: ImageSourcePropType;
  size: number;
  tintColor: string;
  duration?: number;
}

/**
 * An icon component that smoothly animates its tintColor when it changes.
 * Replaces react-native-ui-lib's Icon for cases where animated tint is needed.
 */
export const AnimatedTintIcon: React.FC<AnimatedTintIconProps> = ({
  source,
  size,
  tintColor,
  duration = 600,
}) => {
  const previousColor = usePreviousValue(tintColor);
  // Start at 1 so tintColor is applied immediately on first render (required for iOS)
  const progress = useSharedValue(1);

  useEffect(() => {
    if (previousColor && previousColor !== tintColor) {
      // Reset and animate when color changes
      progress.value = 0;
      progress.value = withTiming(1, {
        duration,
        easing: Easing.inOut(Easing.ease),
      });
    }
  }, [tintColor, duration, previousColor, progress]);

  const animatedStyle = useAnimatedStyle(() => {
    const fromColor = previousColor || tintColor;
    const interpolatedColor = interpolateColor(
      progress.value,
      [0, 1],
      [fromColor, tintColor]
    );

    return {
      tintColor: interpolatedColor,
    };
  });

  return (
    <Animated.Image
      source={source}
      style={[{ width: size, height: size }, animatedStyle]}
      resizeMode="contain"
    />
  );
};
