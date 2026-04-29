import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const AddressBook = () => {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <View className="flex-1 bg-gray-50">
        <View className="flex-row items-center gap-4 px-4 py-4 border-b border-gray-200 bg-white mt-[10%]">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-center flex-1">
            My Address
          </Text>
          <View className="w-8"></View> {/* Spacer for alignment */}
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="w-full px-4 pt-4 bg-gray-50">
            {/* Add Address Button */}
            <TouchableOpacity
              className="bg-white flex-row justify-center items-center py-4 border-2 border-blue-500 rounded-sm mb-6"
              onPress={() => {}}
            >
              <Ionicons name="add-circle-outline" size={20} color="#3b82f6" />
              <Text className="text-base font-light text-blue-600 ml-2">
                Add New Address
              </Text>
            </TouchableOpacity>

            {/* Address Card */}
            <View className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100">
              {/* Header with Edit Button */}
              <View className="flex-row justify-between items-center mb-3">
                <View className="flex-row items-center">
                  <View className="w-3 h-3 bg-blue-500 rounded-full mr-2"></View>
                  <Text className="text-sm font-semibold text-gray-500 uppercase">
                    Office Address
                  </Text>
                </View>
                <TouchableOpacity
                  className="flex-row items-center"
                  onPress={() => {}}
                >
                  <Ionicons name="create-outline" size={18} color="#6b7280" />
                  <Text className="text-gray-500 text-sm ml-1">Edit</Text>
                </TouchableOpacity>
              </View>

              {/* Name and Phone */}
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-base font-bold text-gray-900">
                  Users name
                </Text>
                <View className="flex-row items-center">
                  <Ionicons name="call-outline" size={14} color="#6b7280" />
                  <Text className="text-sm text-gray-600 font-medium ml-1">
                    071 234 5678
                  </Text>
                </View>
              </View>

              {/* Address Details */}
              <View className="mb-4">
                <View className="flex-row items-start">
                  <Ionicons
                    name="location-outline"
                    size={16}
                    color="#9ca3af"
                    style={{ marginTop: 2 }}
                  />
                  <Text className="text-gray-600 text-sm leading-5 ml-2 flex-1">
                    No.122, Abhayapura, Anuradhapura, North Central,
                    Anuradhapura Town
                  </Text>
                </View>
              </View>

              {/* Tags */}
              <View className="flex-row items-center flex-wrap gap-2">
                <View className="bg-blue-50 border border-blue-200 rounded-full px-3 py-1">
                  <Text className="text-blue-700 font-medium text-xs">
                    OFFICE
                  </Text>
                </View>

                <View className="bg-amber-50 border border-amber-200 rounded-full px-3 py-1">
                  <Text className="text-amber-700 font-medium text-xs">
                    DEFAULT SHIPPING
                  </Text>
                </View>

                <View className="bg-green-50 border border-green-200 rounded-full px-3 py-1">
                  <Text className="text-green-700 font-medium text-xs">
                    BILLING ADDRESS
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

export default AddressBook;
