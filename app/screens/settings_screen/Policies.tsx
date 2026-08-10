import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/components/ui';

const MOCK_POLICIES = {
  privacyPolicy: {
    title: 'PRIVACY POLICY',
    content: `
We respect your privacy and are committed to protecting your personal data.

This Privacy Policy explains how we collect, use, store, and share your information when you use our services.

1. Information We Collect
We may collect personal details such as name, email, location, and device information.

2. How We Use Information
Your information is used to provide and improve our services, ensure security, and comply with legal obligations.
    `,
  },
  termsConditions: {
    title: 'TERMS & CONDITIONS',
    content: `
By accessing or using this application, you agree to be bound by these Terms & Conditions.

1. Use of Service
You agree to use the app only for lawful purposes.

2. User Responsibilities
You are responsible for maintaining the confidentiality of your account and activities.
    `,
  },
};

const Policies = () => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>('privacy');
  const [loading, setLoading] = useState(true);
  const [policies, setPolicies] = useState<typeof MOCK_POLICIES | null>(null);

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      setPolicies(MOCK_POLICIES);
      setLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  const policy =
    activeTab === 'privacy'
      ? policies?.privacyPolicy
      : policies?.termsConditions;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Header */}
      <View className="border-b border-gray-200 bg-white">
        <ScreenHeader title="Policies" onBack={() => router.back()} />
      </View>

      <View className="flex-1 bg-gray-100">
        {/* Tabs */}
        <View className="flex-row mx-4 mt-4 bg-gray-200 rounded-xl p-1">
          <TouchableOpacity
            onPress={() => setActiveTab('privacy')}
            className={`flex-1 py-2 rounded-lg ${
              activeTab === 'privacy' ? 'bg-white' : ''
            }`}
          >
            <Text
              className={`text-center font-semibold ${
                activeTab === 'privacy' ? 'text-black' : 'text-gray-500'
              }`}
            >
              Privacy Policy
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('terms')}
            className={`flex-1 py-2 rounded-lg ${
              activeTab === 'terms' ? 'bg-white' : ''
            }`}
          >
            <Text
              className={`text-center font-semibold ${
                activeTab === 'terms' ? 'text-black' : 'text-gray-500'
              }`}
            >
              Terms & Conditions
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView className="flex-1 px-4 mt-6">
          {loading ? (
            <ActivityIndicator size="large" />
          ) : (
            <>
              <Text className="text-2xl font-extrabold text-center mb-4">
                {policy?.title}
              </Text>

              <Text className="text-base text-gray-800 leading-6 whitespace-pre-line">
                {policy?.content}
              </Text>
            </>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Policies;
