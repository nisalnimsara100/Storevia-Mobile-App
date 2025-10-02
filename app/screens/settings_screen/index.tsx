import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as React from 'react';
import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import CountryPicker from 'react-native-country-picker-modal';
import MenuItem from '../../components/MenuItem';

const SettingsScreen = () => {
  const [countryCode, setCountryCode] = useState<import('react-native-country-picker-modal').CountryCode>('LK');
  const [visible, setVisible] = useState(false);
  const router = useRouter();
  return (
    <View className="flex-1 bg-gray-100 mt-[50px]">
      <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-200 bg-white">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-center">Settings</Text>
        <Text className="text-lg font-bold text-center"></Text> //?--don't
        remove--
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
          subtitle={`Current country: ${countryCode}`}
          flag={countryCode.toLowerCase()}
          onPress={() => setVisible(true)}
        />
        {visible && (
          <CountryPicker
            withFilter
            withFlag
            withCountryNameButton
            withCallingCode
            withEmoji
            visible={visible}
            countryCode={countryCode}
            onSelect={(country) => {
              setCountryCode(country.cca2);
              setVisible(false);
              alert(`Country changed to ${country.name}`);
            }}
            onClose={() => setVisible(false)}
          />
        )}
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
