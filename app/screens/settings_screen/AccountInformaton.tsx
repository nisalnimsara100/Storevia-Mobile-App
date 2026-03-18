import { AntDesign, Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';

const AccountInformaton = () => {
  const [birthdayModelOpen, setBirthdayModelOpen] = useState(false);
  const [birthday, setBirthday] = useState(new Date('2000-01-01'));
  const [nameModelOpen, setNameModelOpen] = useState(false);
  const [fullName, setFullName] = useState('Guest User');
  const [keepUpdatedName, setKeepUpdatedName] = useState('');

  // Logout Logic
  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          style: "destructive",
          onPress: () => {
            // Expo Router ignores (auth) in the URL. 
            // This replaces the stack with the login screen.
            router.replace('/LoginSignup');
          } 
        }
      ]
    );
  };

  const toggleDatePicker = () => setBirthdayModelOpen(!birthdayModelOpen);
  const toggleNameModal = () => setNameModelOpen(!nameModelOpen);

  const updateName = () => {
    if (keepUpdatedName.trim() !== '') {
      setFullName(keepUpdatedName.trim());
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View className="flex-1 bg-gray-100 mt-[10%]">
        <View className="flex-row items-center gap-4 px-4 py-4 border-b border-gray-200 bg-white">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-lg font-bold">Account Information</Text>
        </View>

        <ScrollView className="flex-1 mt-5">
          <TouchableOpacity className="bg-white flex-row justify-between items-center px-4 py-4 border-b border-gray-200" onPress={toggleNameModal}>
            <Text className="text-md text-gray-800">Full Name</Text>
            <View className="flex-row items-center">
              <Text className="text-md text-gray-400 mr-2">{fullName}</Text>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity className="bg-white flex-row justify-between items-center px-4 py-4 border-b border-gray-200" onPress={toggleDatePicker}>
            <Text className="text-md text-gray-800">Birthday</Text>
            <View className="flex-row items-center">
              <Text className="text-md text-gray-400 mr-2">{birthday.toISOString().split('T')[0]}</Text>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-white flex-row items-center justify-center px-4 py-4 mt-8 border-y border-gray-200"
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={20} color="#ef4444" />
            <Text className="text-md font-semibold text-red-500 ml-2">Log Out</Text>
          </TouchableOpacity>
        </ScrollView>

        {birthdayModelOpen && (
          <DateTimePicker
            value={birthday}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, selectedDate) => {
              setBirthdayModelOpen(Platform.OS === 'ios');
              if (selectedDate) setBirthday(selectedDate);
            }}
            maximumDate={new Date()}
          />
        )}

        {nameModelOpen && (
           <View className="absolute bottom-0 left-0 right-0 h-[60%] bg-white border-t border-gray-200 shadow-xl">
             <View className="flex flex-row justify-between items-center py-5 px-5 ">
               <Text className="font-semibold text-lg">Edit Full Name</Text>
               <AntDesign name="close" size={20} color="#999" onPress={toggleNameModal} />
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
                 onPress={() => { updateName(); toggleNameModal(); }}
               >
                 <Text className="text-white text-center font-bold">Confirm</Text>
               </TouchableOpacity>
             </View>
           </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

export default AccountInformaton;