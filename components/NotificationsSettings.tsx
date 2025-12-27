import React from "react";
import { Switch, View } from "react-native";
import Animated from "react-native-reanimated";

interface NotificationsSettingsProps {
  masterToggle: boolean;
  toggleMasterNotifications: () => void;
  colors: { active: string; inactive: string };
  animatedTextStyle: any;
  animatedActiveTextStyle: any;
}

export const NotificationsSettings = ({
  masterToggle,
  toggleMasterNotifications,
  colors,
  animatedTextStyle,
  animatedActiveTextStyle,
}: NotificationsSettingsProps) => {
  return (
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
  );
};
