import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
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

  return (
    <View className="flex-1 bg-gray-100 mt-[10%]">
      <View className="flex-row items-center gap-4 px-4 py-4 border-b border-gray-200 bg-white">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-center">System Settings</Text>
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
          <MenuItem title="Allow Storevia to access location information" />
          <Switch
            value={locationEnabled}
            onValueChange={setLocationEnabled}
            style={{
              position: 'absolute',
              right: 16,
              top: '50%',
              marginTop: -16,
            }}
          />
        </View>

        <View className="relative">
          <MenuItem title="Allow Storevia to access microphone" />
          <Switch
            value={micEnabled}
            onValueChange={setMicEnabled}
            style={{
              position: 'absolute',
              right: 16,
              top: '50%',
              marginTop: -16,
            }}
          />
        </View>

        <View className="relative">
          <MenuItem title="Allow Storevia to access camera" />
          <Switch
            value={cameraEnabled}
            onValueChange={setCameraEnabled}
            style={{
              position: 'absolute',
              right: 16,
              top: '50%',
              marginTop: -16,
            }}
          />
        </View>

        <View className="relative">
          <MenuItem title="Allow Storevia to Ad-Tracking" />
          <Switch
            value={adTrackingEnabled}
            onValueChange={setAdTrackingEnabled}
            style={{
              position: 'absolute',
              right: 16,
              top: '50%',
              marginTop: -16,
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};
export default SystemSettings;
