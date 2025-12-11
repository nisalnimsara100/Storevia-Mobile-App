import { AntDesign, Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import RadioGroup from 'react-native-radio-buttons-group';

const AccountInformaton = () => {
  const [quickLogin, setQuickLogin] = useState(true);
  const [birthdayModelOpen, setBirthdayModelOpen] = useState(false);
  const [birthday, setBirthday] = useState(new Date('2000-01-01'));

  const [nameModelOpen, setNameModelOpen] = useState(false);
  const [fullName, setFullName] = useState('Guest User');
  const [keepUpdatedName, setKeepUpdatedName] = useState('');
  const [selectedId, setSelectedId] = useState('');

  const radioButtons = useMemo(
    () => [
      {
        id: '1', // acts as primary key, should be unique and non-empty string
        label: 'Male',
        value: 'male',
      },
      {
        id: '2',
        label: 'Female',
        value: 'female',
      },
    ],
    [],
  );

  const toggleDatePicker = () => {
    setBirthdayModelOpen(!birthdayModelOpen);
  };

  const toggleNameModal = () => {
    setNameModelOpen(!nameModelOpen);
  };

  const updateName = () => {
    const newName = keepUpdatedName.trim();
    setFullName(newName !== '' ? newName : fullName);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20} // adjust if needed
    >
      <View className="flex-1 bg-gray-100 mt-[10%]">
        <View className="flex-row items-center gap-4 px-4 py-4 border-b border-gray-200 bg-white">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-center">
            Account Informations
          </Text>
          <Text className="text-lg font-bold text-center"></Text> //?--don't
          remove--
        </View>

        <ScrollView className="flex-1 mt-5">
          <TouchableOpacity
            className="bg-white flex-row justify-between items-center px-4 py-4 border-b border-gray-200"
            onPress={() => {
              toggleNameModal();
            }}
          >
            <Text className="text-md text-gray-800">Full Name</Text>
            <View className="flex-row items-center">
              <Text className="text-md text-gray-400 mr-2">{fullName}</Text>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-white flex-row justify-between items-center px-4 py-4 border-b border-gray-200"
            onPress={() => {}}
          >
            <Text className="text-base text-gray-800">Set Password</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          {/* Enable Quick Login */}
          <View className="flex-row items-center justify-between px-4 py-2 border-b border-gray-200 bg-white mb-4">
            <Text className="text-base text-gray-600">Enable Quick Login</Text>
            <Switch value={quickLogin} onValueChange={setQuickLogin} />
          </View>

          {/* Update Mobile */}
          <TouchableOpacity
            className="bg-white flex-row justify-between items-center px-4 py-4 border-b border-gray-200"
            onPress={() => {}}
          >
            <Text className="text-md text-gray-800">Change Mobile</Text>
            <View className="flex-row items-center">
              <Text className="text-md text-gray-400 mr-2">
                {/* {$mobile}  */}
                071 ***** 123
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </View>
          </TouchableOpacity>

          {/* Update Email */}
          <TouchableOpacity
            className="bg-white flex-row justify-between items-center px-4 py-4 border-b border-gray-200"
            onPress={() => {}}
          >
            <Text className="text-md text-gray-800">Change Email</Text>
            <View className="flex-row items-center">
              <Text className="text-md text-gray-400 mr-2">
                {/* {$email}  */}
                ja********@gmail.com
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </View>
          </TouchableOpacity>

          {/* Update Gender */}
          <TouchableOpacity
            className="bg-white flex-row justify-between items-center px-4 py-4 border-b border-gray-200"
            onPress={() => {}}
          >
            <Text className="text-md text-gray-800">Gender</Text>
            <View className="flex-row items-center">
              <Text className="text-md text-gray-400 mr-2">
                {/* {$gender}  */}
                Male
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </View>
          </TouchableOpacity>

          {/* Update Birthday */}
          <TouchableOpacity
            className="bg-white flex-row justify-between items-center px-4 py-4 border-b border-gray-200"
            onPress={() => {
              toggleDatePicker();
            }}
          >
            <Text className="text-md text-gray-800">Birthday</Text>
            <View className="flex-row items-center">
              <Text className="text-md text-gray-400 mr-2">
                {birthday.toISOString().split('T')[0]}
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </View>
          </TouchableOpacity>
        </ScrollView>

        {/* Models */}
        {birthdayModelOpen && (
          <DateTimePicker
            value={birthday}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, selectedDate) => {
              const currentDate = selectedDate || birthday;
              setBirthdayModelOpen(Platform.OS === 'ios');
              setBirthday(currentDate);
            }}
            maximumDate={new Date()}
          />
        )}

        {nameModelOpen && (
          <View className="h-[30%] bg-white border-t border-gray-200 mt-4">
            <View className="flex flex-row justify-between items-center py-5 px-5 ">
              <Text></Text>
              <Text className="font-semibold text-lg">Full Name</Text>
              <AntDesign
                name="close"
                size={15}
                color="#999"
                onPress={toggleNameModal}
              />
            </View>
            <View className="px-5">
              <Text className="text-gray-600 mb-3">First Name</Text>
              <View className="mb-4">
                <TextInput
                  placeholder={fullName}
                  onChangeText={(text) => setKeepUpdatedName(text)}
                  className="text-base text-gray-800 border-b border-gray-300 pb-1"
                />
              </View>
              <TouchableOpacity
                className="mt-8"
                onPress={() => {
                  updateName();
                  toggleNameModal();
                }}
              >
                <Text className="bg-orange-600 text-white text-center py-3 rounded-md font-semibold">
                  Confirm
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        
      </View>
    </KeyboardAvoidingView>
  );
};

export default AccountInformaton;
