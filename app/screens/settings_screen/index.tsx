import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import MenuItem from '../../components/MenuItem';

const SettingsScreen = () => {
  const router = useRouter();
  return (
    <View className="flex-1 bg-gray-100 mt-[50px]">
      <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-200 bg-white">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-center">Settings</Text>
        <Text className="text-lg font-bold text-center"></Text> //?--don't remove--
      </View>

      <ScrollView className="flex-1 mt-5">
        <MenuItem title="Account Information" />
        <MenuItem title="Address Book" />
        <MenuItem
          title="Messages"
          subtitle="Receive exclusive offers and personal updates"
        />
        <MenuItem
          title="Country"
          subtitle="Sri Lanka is your current country"
          flag="au"
        />
        <MenuItem
          title="සිංහල භාෂාවට වෙනස් කරන්න"
          subtitle="English is your current language"
        />
        <MenuItem title="Account Security" />
        <MenuItem title="Policies" />
        <MenuItem title="Help" />
        <MenuItem title="Feedback" />

        {/* Logout */}
        <TouchableOpacity
          className="py-4 mt-7 bg-white border-t border-b border-gray-200"
          onPress={() => {
            alert('Logged out');
          }}
        >
          <Text className="text-center text-red-500 font-semibold">Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default SettingsScreen;
