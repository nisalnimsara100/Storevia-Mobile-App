import { AntDesign, Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/components/ui';
import { useAuth } from '../../context/authContext';
import { useAuthStore } from '../../stores/useAuthStore';

const AccountInformaton = () => {
  const user = useAuthStore((state) => state.user);
  const { resetPassword } = useAuth();

  const [birthdayModelOpen, setBirthdayModelOpen] = useState(false);
  const [birthday, setBirthday] = useState(new Date('2000-01-01'));
  const [nameModelOpen, setNameModelOpen] = useState(false);
  const [fullName, setFullName] = useState(user?.name || 'Guest User');
  const [keepUpdatedName, setKeepUpdatedName] = useState('');
  const [isSendingReset, setIsSendingReset] = useState(false);

  // Logout Logic
  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          // Expo Router ignores (auth) in the URL.
          // This replaces the stack with the login screen.
          router.replace('/LoginSignup');
        },
      },
    ]);
  };

  const toggleDatePicker = () => setBirthdayModelOpen(!birthdayModelOpen);
  const toggleNameModal = () => setNameModelOpen(!nameModelOpen);

  const updateName = () => {
    if (keepUpdatedName.trim() !== '') {
      setFullName(keepUpdatedName.trim());
    }
  };

  // Reuses the same resetPassword flow as the login screen's "Forgot
  // Password" sheet, but skips the email-entry step since we already know
  // the signed-in user's email.
  const handleForgotPassword = async () => {
    const email = user?.email;
    if (!email) {
      Alert.alert(
        'No Email Found',
        'We could not find an email address on your account.',
      );
      return;
    }

    setIsSendingReset(true);
    try {
      const result = await resetPassword(email);
      if (result.success) {
        Alert.alert(
          'Check Your Inbox',
          `If an account exists for ${email}, we've sent a link to reset your password. It may take a minute to arrive — remember to check spam.`,
        );
      } else {
        Alert.alert(
          'Reset Failed',
          result.error || 'Could not send reset email.',
        );
      }
    } finally {
      setIsSendingReset(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView className="flex-1 bg-white" edges={['top']}>
        <View className="border-b border-gray-200 bg-white">
          <ScreenHeader
            title="Account Information"
            onBack={() => router.back()}
          />
        </View>

        <ScrollView className="flex-1 mt-1.5 bg-gray-100">
          <TouchableOpacity
            className="bg-white flex-row justify-between items-center px-4 py-4 border-b border-gray-200"
            onPress={toggleNameModal}
          >
            <Text className="text-md text-gray-800">Full Name</Text>
            <View className="flex-row items-center">
              <Text className="text-md text-gray-400 mr-2">{fullName}</Text>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-white flex-row justify-between items-center px-4 py-4 border-b border-gray-200"
            onPress={toggleDatePicker}
          >
            <Text className="text-md text-gray-800">Email</Text>
            <View className="flex-row items-center">
              <Text className="text-md text-gray-400 mr-2">
                {user?.email || 'No email'}
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-white flex-row justify-between items-center px-4 py-4 border-b border-gray-200"
            onPress={handleForgotPassword}
            disabled={isSendingReset}
          >
            <Text className="text-md text-gray-800">Forgot Password</Text>
            {isSendingReset ? (
              <ActivityIndicator size="small" color="#999" />
            ) : (
              <Ionicons name="chevron-forward" size={20} color="#999" />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-white flex-row items-center justify-center px-4 py-4 mt-1.5 border-y border-gray-200"
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={20} color="#ef4444" />
            <Text className="text-md font-poppinsSemiBold text-red-500 ml-2">
              Log Out
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {birthdayModelOpen && (
          <DateTimePicker
            value={birthday}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(_event, selectedDate) => {
              setBirthdayModelOpen(Platform.OS === 'ios');
              if (selectedDate) setBirthday(selectedDate);
            }}
            maximumDate={new Date()}
          />
        )}

        {nameModelOpen && (
          <View className="absolute bottom-0 left-0 right-0 h-[60%] bg-white border-t border-gray-200 shadow-xl">
            <View className="flex flex-row justify-between items-center py-5 px-5 ">
              <Text className="font-poppinsSemiBold text-lg">
                Edit Full Name
              </Text>
              <AntDesign
                name="close"
                size={20}
                color="#999"
                onPress={toggleNameModal}
              />
            </View>
            <View className="px-5">
              <TextInput
                placeholder={fullName}
                onChangeText={setKeepUpdatedName}
                autoFocus
                className="text-base text-gray-800 border-b border-gray-300 pb-2"
              />
              <TouchableOpacity
                className="mt-8 bg-orange-600 py-4 rounded-xl"
                onPress={() => {
                  updateName();
                  toggleNameModal();
                }}
              >
                <Text className="text-white text-center font-poppinsBold">
                  Confirm
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default AccountInformaton;
