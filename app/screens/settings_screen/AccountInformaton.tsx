import {ScrollView, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import MenuItem from '@/app/components/MenuItem'

const AccountInformaton = () => {
  return (
    <View className="flex-1 bg-gray-100 mt-[50px]">
      <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-200 bg-white">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-center">Account Informations</Text>
        <Text className="text-lg font-bold text-center"></Text> //?--don't
        remove--
      </View>

       <ScrollView className="flex-1 mt-5">
        <MenuItem
          title="Full Name"
        />

        <MenuItem title="Address Book" />
        <MenuItem
          title="Messages"
          subtitle="Receive exclusive offers and personal updates"
        />
        </ScrollView>

    </View>
  )
}

export default AccountInformaton

