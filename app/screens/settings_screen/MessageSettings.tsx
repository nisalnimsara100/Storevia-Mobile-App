import { router } from 'expo-router';
import React from 'react';
import { RefreshControl, ScrollView, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/components/ui';
import MenuItem from '../../components/MenuItem';

const SectionHeader = ({ title }: { title: string }) => {
  return (
    <View className="px-4 py-3 bg-gray-100">
      <Text className="text-sm font-poppinsSemiBold text-gray-400 uppercase">
        {title}
      </Text>
    </View>
  );
};

export const MessageSettings = () => {
  const [promotionsEnabled, setPromotionsEnabled] = React.useState(true);
  const [ordersEnabled, setOrdersEnabled] = React.useState(true);
  const [activitiesEnabled, setActivitiesEnabled] = React.useState(true);
  const [sellerPromoEnabled, setSellerPromoEnabled] = React.useState(true);
  const [chatEnabled, setChatEnabled] = React.useState(true);

  const [emailEnabled, setEmailEnabled] = React.useState(false);
  const [smsEnabled, setSmsEnabled] = React.useState(false);
  const [whatsAppEnabled, setWhatsAppEnabled] = React.useState(true);

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
        <ScreenHeader title="Message Settings" onBack={() => router.back()} />
      </View>

      <ScrollView
        className="flex-1 mt-5 bg-gray-100"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <SectionHeader title="App Notification" />

        <View className="relative">
          <MenuItem
            title="Promotions"
            subtitle="Be the first to find out about our upcoming deals"
          />
          <Switch
            value={promotionsEnabled}
            onValueChange={setPromotionsEnabled}
            style={switchStyle}
          />
        </View>

        <View className="relative">
          <MenuItem
            title="Orders"
            subtitle="Get the latest status on your orders"
          />
          <Switch
            value={ordersEnabled}
            onValueChange={setOrdersEnabled}
            style={switchStyle}
          />
        </View>

        <View className="relative">
          <MenuItem
            title="Activities"
            subtitle="Updates on price drops, Feed and other in app events"
          />
          <Switch
            value={activitiesEnabled}
            onValueChange={setActivitiesEnabled}
            style={switchStyle}
          />
        </View>

        <View className="relative">
          <MenuItem
            title="Seller promo"
            subtitle="Get notified about the promotions and vouchers from seller"
          />
          <Switch
            value={sellerPromoEnabled}
            onValueChange={setSellerPromoEnabled}
            style={switchStyle}
          />
        </View>

        <View className="relative">
          <MenuItem
            title="Chat"
            subtitle="Get notified when you receive a private chat message"
          />
          <Switch
            value={chatEnabled}
            onValueChange={setChatEnabled}
            style={switchStyle}
          />
        </View>

        <SectionHeader title="Other Channels" />

        <View className="relative">
          <MenuItem
            title="Email"
            subtitle="Receive our E-newsletters and handpicked recommendations via email"
          />
          <Switch
            value={emailEnabled}
            onValueChange={setEmailEnabled}
            style={switchStyle}
          />
        </View>

        <View className="relative">
          <MenuItem
            title="SMS"
            subtitle="Receive our extra special, not-to-be-missed offers via SMS"
          />
          <Switch
            value={smsEnabled}
            onValueChange={setSmsEnabled}
            style={switchStyle}
          />
        </View>

        <View className="relative">
          <MenuItem
            title="WhatsApp"
            subtitle="Receive promos message via WhatsApp"
          />
          <Switch
            value={whatsAppEnabled}
            onValueChange={setWhatsAppEnabled}
            style={switchStyle}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MessageSettings;
