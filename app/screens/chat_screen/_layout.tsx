import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

export default function ChatLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#FFFFFF',
        },
        headerTintColor: '#333333',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Chats',
          headerBackVisible: true,
        }}
      />
      <Stack.Screen
        name="[chatId]"
        options={({ route }) => {
          const params = route.params as {
            storeName?: string;
            productName?: string;
          };
          const resolvedStoreName = params?.storeName?.trim() || 'Store';
          const resolvedProductName = params?.productName?.trim() || 'Product';

          return {
            headerTitle: () => (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: 'bold',
                      color: '#333333',
                    }}
                  >
                    {resolvedStoreName}
                  </Text>
                </View>
              </View>
            ),
            headerBackVisible: true,
            headerRight: () => (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity style={{ marginRight: 8 }}>
                  <Ionicons
                    name="storefront-outline"
                    size={24}
                    color="#333333"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: '/screens/chat_screen/settings',
                      params: {
                        storeName: resolvedStoreName,
                        productName: resolvedProductName,
                      },
                    })
                  }
                >
                  <Ionicons
                    name="ellipsis-vertical"
                    size={24}
                    color="#333333"
                  />
                </TouchableOpacity>
              </View>
            ),
          };
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          title: 'Chat Setting',
          headerBackVisible: true,
        }}
      />
    </Stack>
  );
}
