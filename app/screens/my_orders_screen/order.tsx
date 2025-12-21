import React from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const order = {
  seller: "Dusty Electronics",
  deliveredDate: "13 Nov",
  title: "USB Hubs Type C 3.0 Hub USB Hub High Speed type c Splitter 5Gbps For PC",
  color: "USB 4 PORT",
  price: 598,
  total: 592,
  qty: 1,
  image: require("../../../assets/products/phone.jpg"),
  orderNo: "222120993092448",
  address:
    "Collect your package from No 854/259A, Maliyadewa Mawatha, Anuradhapura, North Central, Anuradhapura, Anuradhapura Town",
  hours: "Monday,Tuesday,Wednesday,Thursday,Friday,Saturday 09:00-18:00",
  deliveryIcon: require("../../../assets/icons/icon (1).png"), 
};

export default function OrderDetails() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
        <TouchableOpacity>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold">Order Details</Text>
        <View className="flex-row items-center space-x-4">
          <TouchableOpacity className="relative">
            <Ionicons name="cart-outline" size={24} color="black" />
            <View className="absolute -top-2 -right-2 bg-red-500 w-5 h-5 rounded-full items-center justify-center">
              <Text className="text-white text-xs">53</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="ellipsis-horizontal" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Delivered Banner */}
        <View className="bg-pink-100 flex-row items-center justify-between p-4">
          <View className="flex-1">
            <Text className="text-lg font-bold">Delivered</Text>
            <Text className="text-sm text-gray-600">
              You have confirmed that your order has been delivered and received. Thank you for shopping with us.
            </Text>
          </View>
          <Image source={order.deliveryIcon} className="w-16 h-16" />
        </View>

        {/* Package Delivered */}
        <TouchableOpacity className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
          <View className="flex-row items-center space-x-2">
            <Ionicons name="cube" size={20} color="#2563eb" />
            <Text className="text-gray-700">{order.deliveredDate}- Package delivered!</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>

        {/* Pickup Address */}
        <View className="px-4 py-3 border-b border-gray-200">
          <View className="flex-row items-start space-x-2">
            <Ionicons name="location-outline" size={20} color="black" />
            <View className="flex-1">
              <Text className="font-semibold">{order.address}</Text>
              <Text className="text-gray-500 text-sm mt-1">{order.hours}</Text>
            </View>
          </View>
        </View>

        {/* Seller Info */}
        <TouchableOpacity className="px-4 py-3 border-b border-gray-200 flex-row items-center justify-between">
          <Text className="font-semibold text-black">{order.seller}</Text>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>

        {/* Product Info */}
        <View className="px-4 py-4 border-b border-gray-200 flex-row items-center space-x-3">
          <Image source={order.image} className="w-16 h-16 bg-gray-100 rounded" />
          <View className="flex-1">
            <Text className="text-sm text-black">{order.title}</Text>
            <Text className="text-xs text-gray-400 mt-1">Color Family: {order.color}</Text>
            <View className="flex-row justify-between mt-2">
              <Text className="font-semibold text-black">Rs. {order.price}</Text>
              <Text className="text-gray-400 text-xs">Qty: {order.qty}</Text>
            </View>
            <View className="flex-row space-x-2 mt-2">
              <TouchableOpacity className="border border-gray-300 px-4 py-2 rounded-full">
                <Text className="text-sm text-black">Return/Refund</Text>
              </TouchableOpacity>
              <TouchableOpacity className="border border-orange-400 px-4 py-2 rounded-full">
                <Text className="text-sm text-orange-400">Write A Review</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity className="flex-row items-center space-x-1 mt-2">
              <Ionicons name="chatbubble-outline" size={16} color="#ef4444" />
              <Text className="text-red-500 text-sm">Chat with Seller</Text>
              <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Order Summary */}
        <View className="px-4 py-4 border-b border-gray-200">
          <View className="flex-row justify-between mb-2">
            <Text className="text-black font-semibold">Total</Text>
            <Text className="text-black font-bold">Rs. {order.total}</Text>
          </View>
          <View className="flex-row justify-between items-center">
            <Text className="text-gray-700">Order No.</Text>
            <TouchableOpacity>
              <Text className="text-blue-600 font-semibold">{order.orderNo} Copy</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity className="mt-2 flex-row items-center">
            <Text className="text-blue-600 font-semibold">View Order Summary</Text>
            <Ionicons name="chevron-down" size={16} color="#2563eb" />
          </TouchableOpacity>
        </View>

        {/* Buy Again Button */}
        <TouchableOpacity className="m-4 bg-orange-500 py-3 rounded items-center">
          <Text className="text-white font-semibold text-lg">Buy again</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
