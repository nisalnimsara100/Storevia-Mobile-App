import { View, Text, Pressable } from "react-native";
import { Link } from "expo-router";

export default function Index() {
  return (
    <View>
      <Text className="text-4xl mt-20 text-center font-poppinsBold text-yellow-400">Home Page</Text>

      {/* Navigate with Link */}
      <Link href="/screens/profile_screen" asChild>
        <Pressable className="mt-10 bg-green-500 px-4 py-2 rounded-lg">
          <Text className="text-white text-center">Go to Profile</Text>
        </Pressable>
      </Link>
    </View>
  );
}
