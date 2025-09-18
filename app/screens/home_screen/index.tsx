import { View, Text, Pressable } from "react-native";
import { Link } from "expo-router";

export default function Index() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Home Page</Text>

      {/* Navigate with Link */}
      <Link href="/screens/profile_screen/index" asChild>
        <Pressable style={{ padding: 10, backgroundColor: "green", borderRadius: 8 }}>
          <Text style={{ color: "white" }}>Go to Profile</Text>
        </Pressable>
      </Link>
    </View>
  );
}
