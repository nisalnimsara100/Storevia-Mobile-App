import { Link, router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import "../global.css";

export default function Index() {
  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace("/screens/home_screen");
    }, 1500);
    return () => clearTimeout(timeout);
  });

  return (
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator size="large" color="#e6ae1fff" />

      {/* <Text className="text-2xl mb-4">Landing Page</Text>

      {/* Or programmatic navigation *
      <Pressable
        onPress={() => router.push("/screens/home_screen")}
        className="mt-4 bg-blue-500 px-4 py-2 rounded-lg mb-8"
      >
        <Text className="text-white">Home</Text>
      </Pressable>

      {/* Navigation with Link *
      <Link href="/screens/profile_screen" asChild>
        <Pressable className="bg-green-500 px-4 py-2 rounded-lg">
          <Text className="text-white">Go to Profile</Text>
        </Pressable>
      </Link> */}
    </View>
  );
}
