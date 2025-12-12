import { Dimensions, Image, Text, View } from "react-native";
import { Icon } from "react-native-ui-lib";

const { height } = Dimensions.get("window");

interface UpcomingPrayerHeaderProps {
  nextPrayer: { prayer: string; time: string } | null;
  locationName: string;
}

export const UpcomingPrayerHeader = ({
  nextPrayer,
  locationName,
}: UpcomingPrayerHeaderProps) => {
  return (
    <>
      <Image
        source={require("../assets/images/prayer-pro-bg/prayer-pro-bg-fajr.png")}
        className="absolute -top-[200]  left-0 w-full h-full"
      />
      {/* //TODO: background will change depending on upcoming prayer */}

      <View className="absolute left-0 right-0 justify-center items-center pt-24 mb-14">
        <Text className=" font-bold text-sm text-white">
          {nextPrayer
            ? `Upcoming Prayer: ${nextPrayer.prayer}`
            : "Loading prayer times..."}
        </Text>
        <Text className="font-extrabold text-white text-[80px]">
          {nextPrayer ? nextPrayer.time : "--:--"}
        </Text>
        <View className="flex-row items-center gap-1">
          <Text className="text-sm font-bold text-white">{locationName}</Text>
          <Icon
            source={require("../assets/images/prayer-pro-icons/home-page/icon-location.png")}
            size={12}
            tintColor="white"
          />
        </View>
      </View>
      <View
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl"
        style={{ height: height * 0.5 }}
      ></View>
    </>
  );
};
