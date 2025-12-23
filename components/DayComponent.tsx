import React, { memo } from "react";
import { Pressable, Text, View } from "react-native";
import { DateData } from "react-native-calendars";

export interface DayComponentProps {
  date?: DateData;
  state?: string;
  marking?: { selected?: boolean; marked?: boolean };
  onPress?: (date?: DateData) => void;
  activeColor: string;
  dayTextColor: string;
  disabledTextColor: string;
}

export const DayComponent = memo(function DayComponent({
  date,
  state,
  marking,
  onPress,
  activeColor,
  dayTextColor,
  disabledTextColor,
}: DayComponentProps) {
  const isSelected = marking?.selected;
  const isToday = state === "today";
  const isDisabled = state === "disabled";

  return (
    <Pressable
      onPress={() => onPress?.(date)}
      disabled={isDisabled}
      style={{
        width: 32,
        height: 32,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 16,
        backgroundColor: isSelected ? activeColor : "transparent",
      }}
    >
      <Text
        style={{
          color: isDisabled
            ? disabledTextColor
            : isSelected
              ? "#ffffff"
              : isToday
                ? activeColor
                : dayTextColor,
          fontSize: 16,
          fontFamily: "System",
        }}
      >
        {date?.day}
      </Text>
      {marking?.marked && (
        <View
          style={{
            position: "absolute",
            bottom: 2,
            width: 4,
            height: 4,
            borderRadius: 2,
            backgroundColor: isSelected ? "#ffffff" : activeColor,
          }}
        />
      )}
    </Pressable>
  );
});
