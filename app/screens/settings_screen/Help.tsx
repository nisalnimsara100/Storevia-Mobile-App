import { router } from 'expo-router';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/components/ui';

const Help = () => {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <View className="border-b border-gray-200 bg-white">
        <ScreenHeader title="Help" onBack={() => router.back()} />
      </View>
    </SafeAreaView>
  );
};

export default Help;
