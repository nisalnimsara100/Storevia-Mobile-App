import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const Help = () => {
  return (
     <View className="flex-1 bg-gray-100 mt-[10%]">
        <View className="flex-row items-center gap-4 px-4 py-4 border-b border-gray-200 bg-white">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-center">
            Help
          </Text>
          <Text className="text-lg font-bold text-center"></Text> //?--don't
          remove--
        </View>

        
    </View>
  )
}

export default Help