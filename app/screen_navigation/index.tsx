import { Link } from 'expo-router';
import * as React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const ScreenNavigation = () => {
  return (
    <View className="flex-1 mt-[80px] items-center">
      <Text className="font-bold text-2xl">Screen Navigation</Text>

      <Link href={"/screens/chat_screen" as any} asChild>
        <TouchableOpacity className="bg-blue-500 px-4 py-2 rounded-md mt-4 w-[200px] items-center">
          <Text className="text-white">Chat Screen</Text>
        </TouchableOpacity>
      </Link>
      <Link href={"/screens/activity_screen" as any} asChild>
        <TouchableOpacity className="bg-blue-500 px-4 py-2 rounded-md mt-4 w-[200px] items-center">
          <Text className="text-white">Activity Screen</Text>
        </TouchableOpacity>
      </Link>
      <Link href={"/screens/checkout_screen" as any} asChild>
        <TouchableOpacity className="bg-blue-500 px-4 py-2 rounded-md mt-4 w-[200px] items-center">
          <Text className="text-white">Checkout Screen</Text>
        </TouchableOpacity>
      </Link>
      <Link href={"/screens/my_orders_screen" as any} asChild>
        <TouchableOpacity className="bg-blue-500 px-4 py-2 rounded-md mt-4 w-[200px] items-center">
          <Text className="text-white">My Orders Screen</Text>
        </TouchableOpacity>
      </Link>
      <Link href={"/screens/promos_screen" as any} asChild>
        <TouchableOpacity className="bg-blue-500 px-4 py-2 rounded-md mt-4 w-[200px] items-center">
          <Text className="text-white">Promos Screen</Text>
        </TouchableOpacity>
      </Link>
      <Link href={"/screens/settings_screen" as any} asChild>
        <TouchableOpacity className="bg-blue-500 px-4 py-2 rounded-md mt-4 w-[200px] items-center">
          <Text className="text-white">Settings Screen</Text>
        </TouchableOpacity>
      </Link>

    </View>
  );
};

export default ScreenNavigation;
