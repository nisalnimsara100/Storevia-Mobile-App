import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Remove this import - it's a component, not a route

type OrderStatus = 'All' | 'To Pay' | 'To Ship' | 'To Receive' | 'To Review';

const TABS: OrderStatus[] = [
  'All',
  'To Pay',
  'To Ship',
  'To Receive',
  'To Review',
];

const ORDERS = [
  {
    id: 1,
    seller: 'Dusty Electronics',
    deliveredDate: '13 Nov',
    status: 'Delivered',
    title:
      'USB Hubs Type C 3.0 Hub USB Hub High Speed type c Splitter 5Gbps For PC',
    color: 'USB 4 PORT',
    price: 598,
    total: 592,
    qty: 1,
    image: require('../../../assets/products/phone.jpg'),
    tab: 'To Pay',
  },
  {
    id: 2,
    seller: 'ENDLESS',
    deliveredDate: '11 Nov',
    status: 'Delivered',
    title:
      'Bluetooth Wireless Mouse with USB, BT5.2 Rechargeable RGB Mouse for Laptop',
    color: 'Matte Black',
    price: 666,
    total: 666,
    qty: 1,
    image: require('../../../assets/products/laptop.jpg'),
    tab: 'All',
  },
];

export default function MyOrdersScreen() {
  const [activeTab, setActiveTab] = useState<OrderStatus>('All');

  const filteredOrders =
    activeTab === 'All'
      ? ORDERS
      : ORDERS.filter((order) => order.tab === activeTab);

  return (
    <SafeAreaView edges={['top', 'left', 'right']} className="flex-1 bg-white">
      <View className="flex-1">
        {/* Search Bar */}
        <View className="flex-row items-center gap-4 px-4 py-4 border-b border-gray-200 bg-white">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-center">My Oders</Text>
          <Text className="text-lg font-bold text-center"></Text>
        </View>

        {/* Tabs */}
        <View className="border-b border-[#E5E7EB] bg-white">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 8 }}
            className="h-12"
          >
            {TABS.map((tab) => {
              const isActive = activeTab === tab;

              return (
                <TouchableOpacity
                  key={tab}
                  onPress={() => setActiveTab(tab)}
                  className="px-4 justify-center h-12 relative"
                  activeOpacity={0.8}
                >
                  <Text
                    className={`text-sm ${
                      isActive
                        ? 'text-[#F85606] font-semibold'
                        : 'text-[#6B7280]'
                    }`}
                  >
                    {tab}
                  </Text>

                  {isActive && (
                    <View className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#F85606] rounded-full" />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Orders */}
        <ScrollView className="flex-1 bg-[#F5F5F5]">
          {filteredOrders.map((order) => (
            <TouchableOpacity
              key={order.id}
              // onPress={() => router.push(`..//${order.id}`)} // navigate to details page
              className="bg-white mt-3 px-4 py-4"
            >
              <View key={order.id} className="bg-white mt-3 px-4 py-4">
                {/* Seller */}
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="font-semibold text-sm text-black">
                    {order.seller}
                  </Text>
                  <Text className="text-[#F85606] text-sm">{order.status}</Text>
                </View>

                {/* Delivery Info */}
                <View className="border border-[#E5E7EB] rounded-lg px-3 py-2 mb-3">
                  <Text className="text-xs text-[#6B7280]">
                    {order.deliveredDate} - Package delivered!
                  </Text>
                </View>

                {/* Product */}
                <View className="flex-row">
                  <Image
                    source={order.image}
                    className="w-16 h-16 rounded-md bg-[#F5F5F5]"
                    resizeMode="contain"
                  />
                  <View className="flex-1 ml-3">
                    <Text
                      numberOfLines={2}
                      className="text-sm text-black leading-5"
                    >
                      {order.title}
                    </Text>

                    <Text className="text-xs text-[#6B7280] mt-1">
                      Color Family: {order.color}
                    </Text>

                    <View className="flex-row justify-between items-center mt-2">
                      <Text className="font-semibold text-black">
                        Rs. {order.price}
                      </Text>
                      <Text className="text-xs text-[#6B7280]">
                        Qty: {order.qty}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Total */}
                <View className="flex-row justify-end mt-2">
                  <Text className="text-sm text-black">
                    Total(1 Item):{' '}
                    <Text className="font-semibold">Rs. {order.total}</Text>
                  </Text>
                </View>

                {/* Actions */}
                <View className="flex-row justify-end mt-4 space-x-2">
                  <TouchableOpacity className="border border-[#E5E7EB] rounded-full px-4 py-2">
                    <Text className="text-sm text-black">Return/Refund</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="bg-[#F85606] rounded-full px-4 py-2"
                    onPress={() => {
                      router.push('/screens/my_orders_screen/order');
                    }}
                  >
                    <Text className="text-white text-sm font-medium">
                      Buy again
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
