import * as React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import CountryFlag from "react-native-country-flag";

type MenuItemProps = {
  title: string;
  subtitle?: string;
  onPress?: () => void;
  flag?: string;
};

const MenuItem: React.FC<MenuItemProps> = ({ title, subtitle, onPress, flag }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="border-b border-gray-200 px-4 py-5 bg-white flex-row items-center"
    >
      {/* Show Flag if provided */}
      {flag && (
        <View className="mr-3">
          <CountryFlag isoCode={flag} size={30} />
        </View>
      )}

      <View>
        <Text className="text-base font-medium text-black">{title}</Text>
        {subtitle && (
          <Text className="text-xs text-gray-500 mt-1">{subtitle}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default MenuItem;
