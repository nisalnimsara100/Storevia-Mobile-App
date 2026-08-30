import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/components/ui';
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
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <View className="border-b border-gray-200 bg-white">
        <ScreenHeader title="Privacy Protection" onBack={() => router.back()} />
      </View>
      <ScrollView
        className="flex-1 mt-1.5 bg-gray-100"
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
          <MenuItem
            title="Account Deletion"
            onPress={() =>
              router.push('/screens/settings_screen/AccountDeletion')
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
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AccountSecurity;
