import { Ionicons } from '@expo/vector-icons'
import { Stack, router } from 'expo-router'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

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
        options={({ route }) => ({
          headerTitle: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333333' }}>banana3C</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 8 }}>
                <Ionicons name="time-outline" size={12} color="#666666" />
                <Text style={{ fontSize: 12, color: '#666666', marginLeft: 4 }}>1d</Text>
              </View>
            </View>
          ),
          headerBackVisible: true,
          headerRight: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity style={{ marginRight: 8 }}>
                <Ionicons name="storefront-outline" size={24} color="#333333" />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => router.push('/screens/chat_screen/settings')}
              >
                <Ionicons name="ellipsis-vertical" size={24} color="#333333" />
              </TouchableOpacity>
            </View>
          ),
        })}
      />
      <Stack.Screen
        name="settings"
        options={{
          title: 'Chat Setting',
          headerBackVisible: true,
        }}
      />
    </Stack>
  )
}