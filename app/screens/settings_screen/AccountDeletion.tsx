import { router } from 'expo-router';
import { Alert, Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/components/ui';

const SUPPORT_EMAIL = 'storeviahost@gmail.com';
const DELETE_ACCOUNT_URL = 'https://storevia.lk/delete-account';

export const AccountDeletion = () => {
  const requestDeletion = async () => {
    const mailUrl = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
      'Account Deletion Request'
    )}&body=${encodeURIComponent(
      'Please delete my Storevia account and associated personal data.\n\nRegistered email:\n'
    )}`;

    const canOpen = await Linking.canOpenURL(mailUrl);
    if (canOpen) {
      Linking.openURL(mailUrl);
    } else {
      Alert.alert(
        'Email app not available',
        `Please email ${SUPPORT_EMAIL} from your registered address with the subject "Account Deletion Request".`
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <View className="border-b border-gray-200 bg-white">
        <ScreenHeader title="Account Deletion" onBack={() => router.back()} />
      </View>

      <ScrollView className="flex-1 bg-white px-4 pt-6">
        <Text className="text-lg font-poppinsSemiBold text-black mb-3">
          Delete your Storevia account
        </Text>

        <Text className="text-sm text-gray-700 leading-6 mb-4">
          To request deletion of your Storevia account and associated
          personal data, send us an email from the address registered on
          your account with the subject "Account Deletion Request".
        </Text>

        <Text className="text-sm text-gray-700 leading-6 mb-4">
          Once verified, we will delete your account, profile information,
          and saved addresses within 30 days.
        </Text>

        <Text className="text-sm font-poppinsSemiBold text-black mb-2">
          What we retain
        </Text>
        <Text className="text-sm text-gray-700 leading-6 mb-6">
          Order and transaction history is kept for a limited period after
          account deletion, as required for tax, accounting, and
          fraud-prevention purposes. This data is not used for any other
          purpose after deletion and is not linked back to an active
          account.
        </Text>

        <TouchableOpacity
          onPress={requestDeletion}
          className="bg-red-600 rounded-xl py-4 items-center mb-3"
        >
          <Text className="text-white font-poppinsSemiBold text-base">
            Request Account Deletion
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => Linking.openURL(DELETE_ACCOUNT_URL)}
          className="py-3 items-center mb-6"
        >
          <Text className="text-gray-500 text-sm underline">
            View this policy on the web
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AccountDeletion;
