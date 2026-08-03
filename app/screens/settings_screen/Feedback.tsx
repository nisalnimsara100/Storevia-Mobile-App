import { View } from 'react-native';
import React from 'react';
import { router } from 'expo-router';
import { ScreenHeader } from '@/components/ui';

const Feedback = () => {
  return (
    <View className="flex-1 bg-gray-100 mt-[10%]">
      <View className="border-b border-gray-200 bg-white">
        <ScreenHeader title="Feedback" onBack={() => router.back()} />
      </View>
    </View>
  );
};

export default Feedback;
