import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import MenuItem from '../../components/MenuItem';

export const AccountSecurity = () => {
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <View className="flex-1 bg-gray-100 mt-[10%]">
      <View className="flex-row items-center gap-4 px-4 py-4 border-b border-gray-200 bg-white">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-center">
          Privacy Protection
        </Text>
        <Text className="text-lg font-bold text-center"></Text>{' '}
        {/* don't remove */}
      </View>
      <ScrollView
        className="flex-1 mt-5"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="relative">
          <MenuItem
            title="System Settings"
            onPress={() =>
              router.push('/screens/settings_screen/SystemSettings')
            }
          />
          <Ionicons
            name="chevron-forward"
            size={20}
            color="#9CA3AF"
            style={{
              position: 'absolute',
              right: 16,
              top: '50%',
              marginTop: -10,
            }}
            pointerEvents="none"
          />
        </View>

        <View className="relative">
          <MenuItem title="Account Deletion" />
          <Ionicons
            name="chevron-forward"
            size={20}
            color="#9CA3AF"
            style={{
              position: 'absolute',
              right: 16,
              top: '50%',
              marginTop: -10,
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default AccountSecurity;
