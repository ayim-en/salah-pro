import { useEffect } from "react";
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
  Easing,
} from "react-native-reanimated";
import { usePreviousValue } from "./usePreviousValue";

/**
 * Hook that returns an animated style for smooth background color transitions.
 */
export function useAnimatedBackgroundColor(
  color: string,
  duration: number = 600
) {
  const previousColor = usePreviousValue(color);
  const progress = useSharedValue(1);

  useEffect(() => {
    if (previousColor && previousColor !== color) {
      progress.value = 0;
      progress.value = withTiming(1, {
        duration,
        easing: Easing.inOut(Easing.ease),
      });
    }
  }, [color, duration, previousColor, progress]);

  const animatedStyle = useAnimatedStyle(() => {
    const fromColor = previousColor || color;
    return {
      backgroundColor: interpolateColor(
        progress.value,
        [0, 1],
        [fromColor, color]
      ),
    };
  });

  return animatedStyle;
}

/**
 * Hook that returns an animated style for smooth border color transitions.
 */
export function useAnimatedBorderColor(color: string, duration: number = 600) {
  const previousColor = usePreviousValue(color);
  const progress = useSharedValue(1);

  useEffect(() => {
    if (previousColor && previousColor !== color) {
      progress.value = 0;
      progress.value = withTiming(1, {
        duration,
        easing: Easing.inOut(Easing.ease),
      });
    }
  }, [color, duration, previousColor, progress]);

  const animatedStyle = useAnimatedStyle(() => {
    const fromColor = previousColor || color;
    return {
      borderColor: interpolateColor(
        progress.value,
        [0, 1],
        [fromColor, color]
      ),
    };
  });

  return animatedStyle;
}

/**
 * Hook that returns an animated style for smooth text color transitions.
 */
export function useAnimatedTextColor(color: string, duration: number = 600) {
  const previousColor = usePreviousValue(color);
  const progress = useSharedValue(1);

  useEffect(() => {
    if (previousColor && previousColor !== color) {
      progress.value = 0;
      progress.value = withTiming(1, {
        duration,
        easing: Easing.inOut(Easing.ease),
      });
    }
  }, [color, duration, previousColor, progress]);

  const animatedStyle = useAnimatedStyle(() => {
    const fromColor = previousColor || color;
    return {
      color: interpolateColor(progress.value, [0, 1], [fromColor, color]),
    };
  });

  return animatedStyle;
}
