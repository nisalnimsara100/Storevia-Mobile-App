import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const OrderConfirmationScreen = () => {
  const router = useRouter();

  const handleContinueShopping = () => {
    router.push('/(tabs)/Home');
  };

  const handleViewOrders = () => {
    router.push('./my_orders_screen');
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        className="flex-1 px-6"
      >
        {/* Success Icon */}
        <View className="flex items-center justify-center mb-6">
          <View className="w-24 h-24 rounded-full bg-green-100 items-center justify-center">
            <Ionicons
              name="checkmark"
              size={48}
              color="#10b981"
              strokeWidth={3}
            />
          </View>
        </View>

        {/* Success Message */}
        <View className="flex items-center justify-center mb-2">
          <Text className="text-3xl font-bold text-gray-900 text-center">
            Order Confirmed!
          </Text>
        </View>

        <View className="flex items-center justify-center mb-8">
          <Text className="text-lg text-gray-600 text-center">
            Thank you for your purchase
          </Text>
        </View>

        {/* Order Details */}
        <View className="bg-slate-50 rounded-2xl p-6 mb-8">
          {/* Order Number */}
          <View className="flex-row items-start mb-6">
            <View className="w-10 h-10 rounded-lg bg-orange-500 items-center justify-center mr-4 flex-shrink-0">
              <Ionicons name="cube" size={20} color="white" />
            </View>
            <View className="flex-1">
              <Text className="text-gray-600 text-sm mb-1">Order Number</Text>
              <Text className="text-gray-900 font-semibold text-base">
                #ORD-1935
              </Text>
            </View>
          </View>

          {/* Estimated Delivery */}
          <View className="flex-row items-start mb-6">
            <View className="w-10 h-10 rounded-lg bg-orange-500 items-center justify-center mr-4 flex-shrink-0">
              <Ionicons name="calendar" size={20} color="white" />
            </View>
            <View className="flex-1">
              <Text className="text-gray-600 text-sm mb-1">
                Estimated Delivery
              </Text>
              <Text className="text-gray-900 font-semibold text-base">
                Mar 22 - Mar 24
              </Text>
            </View>
          </View>

          {/* Shipping To */}
          <View className="flex-row items-start">
            <View className="w-10 h-10 rounded-lg bg-orange-500 items-center justify-center mr-4 flex-shrink-0">
              <Ionicons name="location" size={20} color="white" />
            </View>
            <View className="flex-1">
              <Text className="text-gray-600 text-sm mb-1">Shipping To</Text>
              <Text className="text-gray-900 font-semibold text-base">
                Doloribus sed possim, Reprehenderit omnis
              </Text>
            </View>
          </View>
        </View>

        {/* Buttons */}
        <View className="flex-row gap-3">
          {/* Continue Shopping Button */}
          <TouchableOpacity
            onPress={handleContinueShopping}
            className="flex-1 bg-orange-500 rounded-lg py-4 items-center justify-center"
            activeOpacity={0.8}
          >
            <View className="flex-row items-center gap-2">
              <Ionicons name="bag-add" size={18} color="white" />
              <Text className="text-white font-semibold text-base">
                Continue Shopping
              </Text>
            </View>
          </TouchableOpacity>

          {/* View Orders Button */}
          <TouchableOpacity
            onPress={handleViewOrders}
            className="flex-1 border-2 border-orange-500 rounded-lg py-4 items-center justify-center"
            activeOpacity={0.7}
          >
            <View className="flex-row items-center gap-2">
              <Ionicons name="cube" size={18} color="#f97316" />
              <Text className="text-orange-500 font-semibold text-base">
                View Orders
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OrderConfirmationScreen;
