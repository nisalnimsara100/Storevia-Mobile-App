import { router } from 'expo-router';
import React from 'react';
import { RefreshControl, ScrollView, Switch, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/components/ui';
import MenuItem from '../../components/MenuItem';

export const SystemSettings = () => {
  const [locationEnabled, setLocationEnabled] = React.useState(false);
  const [micEnabled, setMicEnabled] = React.useState(false);
  const [cameraEnabled, setCameraEnabled] = React.useState(false);
  const [adTrackingEnabled, setAdTrackingEnabled] = React.useState(false);

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);
  const switchStyle: any = {
    position: 'absolute' as const,
    right: 16,
    top: '50%',
    marginTop: -16,
  };
  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <View className="border-b border-gray-200 bg-white">
        <ScreenHeader title="System Settings" onBack={() => router.back()} />
      </View>
      <ScrollView
        className="flex-1 mt-1.5 bg-gray-100"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="relative">
          <MenuItem title="Allow Storevia to access location information" />
          <Switch
            value={locationEnabled}
            onValueChange={setLocationEnabled}
            style={switchStyle}
          />
        </View>

        <View className="relative">
          <MenuItem title="Allow Storevia to access microphone" />
          <Switch
            value={micEnabled}
            onValueChange={setMicEnabled}
            style={switchStyle}
          />
        </View>

        <View className="relative">
          <MenuItem title="Allow Storevia to access camera" />
          <Switch
            value={cameraEnabled}
            onValueChange={setCameraEnabled}
            style={switchStyle}
          />
        </View>

        <View className="relative">
          <MenuItem title="Allow Storevia to Ad-Tracking" />
          <Switch
            value={adTrackingEnabled}
            onValueChange={setAdTrackingEnabled}
            style={switchStyle}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default SystemSettings;
