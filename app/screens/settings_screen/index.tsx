import { useRouter } from 'expo-router';
import * as React from 'react';
import { useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CountryPicker from 'react-native-country-picker-modal';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/components/ui';
import MenuItem from '../../components/MenuItem';

const SettingsScreen = () => {
  const [countryCode, setCountryCode] =
    useState<import('react-native-country-picker-modal').CountryCode>('LK');
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);
  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <View className="border-b border-gray-200 bg-white">
        <ScreenHeader title="Settings" onBack={() => router.back()} />
      </View>

      <ScrollView
        className="flex-1 mt-5 bg-gray-100"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <MenuItem
          title="Account Information"
          onPress={() =>
            router.push('/screens/settings_screen/AccountInformaton')
          }
        />

        <MenuItem
          title="Address Book"
          onPress={() => router.push('/screens/settings_screen/AddressBook')}
        />
        <MenuItem
          title="Messages"
          subtitle="Receive exclusive offers and personal updates"
          onPress={() =>
            router.push('/screens/settings_screen/MessageSettings')
          }
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
          title="භාෂාව - Language"
          subtitle="English is your current language"
        />
        <MenuItem
          title="Account Security"
          onPress={() =>
            router.push('/screens/settings_screen/AccountSecurity')
          }
        />
        <MenuItem
          title="Policies"
          onPress={() => router.push('/screens/settings_screen/Policies')}
        />
        <MenuItem
          title="Help"
          onPress={() => router.push('/screens/settings_screen/Help')}
        />
        <MenuItem
          title="Feedback"
          onPress={() => router.push('/screens/settings_screen/Feedback')}
        />

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
    </SafeAreaView>
  );
};

export default SettingsScreen;
