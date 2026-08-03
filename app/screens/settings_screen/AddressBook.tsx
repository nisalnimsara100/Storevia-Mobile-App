import { AntDesign, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuthStore } from '../../stores/useAuthStore';
import { ScreenHeader } from '@/components/ui';

const baseUrl2 =
  process.env.EXPO_PUBLIC_APP_BASE_URL || 'http://localhost:3000';

const SRI_LANKA_PROVINCES = [
  'Western Province',
  'Central Province',
  'Southern Province',
  'Northern Province',
  'Eastern Province',
  'North Western Province',
  'North Central Province',
  'Uva Province',
  'Sabaragamuwa Province',
];

interface Address {
  id: number;
  firstName?: string;
  lastName?: string;
  country?: string;
  address?: string;
  addressLine2?: string | null;
  city?: string;
  province?: string;
  postalCode?: string;
  phone?: string;
  useAsBilling: boolean;
}

interface NewAddressForm {
  id?: number;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  phone: string;
  useAsBilling: boolean;
}

const EMPTY_FORM: NewAddressForm = {
  firstName: '',
  lastName: '',
  address: '',
  city: '',
  province: '',
  postalCode: '',
  phone: '',
  useAsBilling: false,
};

const AddressBook = () => {
  const user = useAuthStore((state) => state.user);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [provincePickerOpen, setProvincePickerOpen] = useState(false);
  const [form, setForm] = useState<NewAddressForm>(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);

  // ─── Fetch addresses ───────────────────────────────────────────────────────
  const getShippingAddress = useCallback(async () => {
    const currentloggedInEmail = user?.email;
    if (!currentloggedInEmail) {
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(
        `${baseUrl2}/api/user/address?email=${encodeURIComponent(currentloggedInEmail)}`,
        { method: 'GET', headers: { Accept: 'application/json' } },
      );
      const data = await response.json();
      console.log('address data:', data);
      setAddresses(Array.isArray(data.allAddresses) ? data.allAddresses : []);
    } catch (error) {
      console.error('Error fetching shipping data:', error);
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    getShippingAddress();
  }, [getShippingAddress]);

  // ─── Open modal helpers ────────────────────────────────────────────────────
  const openAddModal = () => {
    setForm(EMPTY_FORM);
    setIsEditMode(false);
    setEditingIndex(null);
    setProvincePickerOpen(false);
    setModalOpen(true);
  };

  const openEditModal = (addr: Address, index: number) => {
    setForm({
      id: addr.id,
      firstName: addr.firstName || '',
      lastName: addr.lastName || '',
      address: addr.address || '',
      city: addr.city || '',
      province: addr.province || '',
      postalCode: addr.postalCode || '',
      phone: addr.phone || '',
      useAsBilling: addr.useAsBilling,
    });
    setIsEditMode(true);
    setEditingIndex(index);
    setProvincePickerOpen(false);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setProvincePickerOpen(false);
    setIsEditMode(false);
    setEditingIndex(null);
  };

  // ─── Validate form ─────────────────────────────────────────────────────────
  const validateForm = (): boolean => {
    if (!form.firstName.trim() || !form.lastName.trim()) {
      Alert.alert('Validation', 'First name and last name are required.');
      return false;
    }
    if (!form.address.trim()) {
      Alert.alert('Validation', 'Address is required.');
      return false;
    }
    if (!form.city.trim()) {
      Alert.alert('Validation', 'City is required.');
      return false;
    }
    if (!form.phone.trim()) {
      Alert.alert('Validation', 'Phone number is required.');
      return false;
    }
    if (!form.province) {
      Alert.alert('Validation', 'Please select a province.');
      return false;
    }
    return true;
  };

  // ─── Save new address ──────────────────────────────────────────────────────
  const saveCheckoutShippingAddress = async (): Promise<boolean> => {
    if (!user?.email) {
      Alert.alert('Not logged in', 'Please login to save a shipping address.');
      return false;
    }
    if (!validateForm()) return false;

    setIsSaving(true);
    try {
      const addressPayload = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        province: form.province,
        postalCode: form.postalCode.trim(),
        phone: form.phone.trim(),
        useAsBilling: form.useAsBilling,
      };

      const fd = new FormData();
      fd.append('email', user.email);
      fd.append('address', JSON.stringify(addressPayload));

      const res = await fetch(`${baseUrl2}/api/user/address/add`, {
        method: 'POST',
        body: fd,
      });

      const data = await res.json();
      console.log('save address response:', data);

      if (data.status !== 'success') {
        Alert.alert(
          'Error',
          data?.message || 'Failed to save address. Please try again.',
        );
        return false;
      }

      const savedId = Number(data.id);
      const newAddr: Address = {
        id: savedId,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        province: form.province,
        postalCode: form.postalCode.trim(),
        useAsBilling: form.useAsBilling,
      };

      setAddresses((prev) => [...prev, newAddr]);
      return true;
    } catch (err) {
      console.error('Error saving checkout shipping address:', err);
      Alert.alert('Error', 'Failed to save address. Please try again.');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // ─── Save edited address ───────────────────────────────────────────────────
  const saveEditedAddress = async (): Promise<boolean> => {
    if (!validateForm()) return false;
    if (editingIndex === null) return false;

    const newAddress = {
      id: form.id,
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      address: form.address.trim(),
      city: form.city.trim(),
      province: form.province,
      postalCode: form.postalCode.trim(),
      phone: form.phone.trim(),
      useAsBilling: form.useAsBilling,
    };

    console.log('new Address', newAddress);

    const formData = new FormData();
    formData.append('address', JSON.stringify(newAddress));

    setIsSaving(true);
    try {
      const response = await fetch(`${baseUrl2}/api/user/address/update`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      console.log(result);

      if (result.status === 'success') {
        // Update UI locally
        const updatedAddresses = [...addresses];
        updatedAddresses[editingIndex] = {
          ...addresses[editingIndex],
          ...newAddress,
        } as Address;
        setAddresses(updatedAddresses);
        return true;
      } else {
        Alert.alert(
          'Error',
          result?.message || 'Failed to update address. Please try again.',
        );
        return false;
      }
    } catch (err) {
      console.error('Error saving address:', err);
      Alert.alert('Error', 'Failed to update address. Please try again.');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // ─── Unified save handler ──────────────────────────────────────────────────
  const handleSave = async () => {
    const ok = isEditMode
      ? await saveEditedAddress()
      : await saveCheckoutShippingAddress();
    if (ok) closeModal();
  };

  // ─── Set default shipping address ─────────────────────────────────────────
  const handleToggleBillingAddress = async (index: number, id: number) => {
    console.log('default address id ', id);

    const formData = new FormData();
    const currentloggedInEmail = user?.email;

    formData.append('email', currentloggedInEmail || '');
    formData.append('address_id', String(id));

    try {
      const response = await fetch(`${baseUrl2}/api/user/address/default`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      console.log(result);

      if (result.status === 'success') {
        console.log(result.message);
      }
    } catch (err) {
      console.error('Error saving address:', err);
    }

    // Optimistically mark only this address as default
    setAddresses(
      addresses.map((addr, i) => ({
        ...addr,
        useAsBilling: i === index,
      })),
    );
  };

  // ─── Helpers ───────────────────────────────────────────────────────────────
  const formatAddressLine = (addr: Address) =>
    [addr.address, addr.addressLine2, addr.city, addr.province, addr.postalCode]
      .filter(Boolean)
      .join(', ');

  const setField = <K extends keyof NewAddressForm>(
    key: K,
    value: NewAddressForm[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <View className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="border-b border-gray-200 bg-white mt-[10%]">
          <ScreenHeader title="My Address" onBack={() => router.back()} />
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="w-full px-4 pt-4 bg-gray-50">
            {/* Add Address Button */}
            <TouchableOpacity
              className="bg-white flex-row justify-center items-center py-4 border-2 border-blue-500 rounded-sm mb-6"
              onPress={openAddModal}
            >
              <Ionicons name="add-circle-outline" size={20} color="#3b82f6" />
              <Text className="text-base font-light text-blue-600 ml-2">
                Add New Address
              </Text>
            </TouchableOpacity>

            {/* Loading */}
            {loading && (
              <View className="flex-1 items-center justify-center py-12">
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text className="text-gray-400 text-sm mt-3">
                  Loading addresses...
                </Text>
              </View>
            )}

            {/* Empty */}
            {!loading && addresses.length === 0 && (
              <View className="flex-1 items-center justify-center py-16">
                <Ionicons name="location-outline" size={48} color="#d1d5db" />
                <Text className="text-gray-400 text-base mt-3 font-medium">
                  No addresses found
                </Text>
                <Text className="text-gray-300 text-sm mt-1">
                  Add a new address to get started
                </Text>
              </View>
            )}

            {/* Address Cards */}
            {!loading &&
              addresses.map((addr, index) => (
                <View
                  key={addr.id}
                  className={`bg-white rounded-xl p-4 mb-4 shadow-sm border ${
                    addr.useAsBilling ? 'border-amber-300' : 'border-gray-100'
                  }`}
                >
                  {/* Header */}
                  <View className="flex-row justify-between items-center mb-3">
                    <View className="flex-row items-center">
                      <View
                        className={`w-3 h-3 rounded-full mr-2 ${
                          addr.useAsBilling ? 'bg-amber-400' : 'bg-blue-500'
                        }`}
                      />
                      <Text className="text-sm font-semibold text-gray-500 uppercase">
                        {addr.useAsBilling ? 'Default Address' : 'Address'}
                      </Text>
                    </View>
                    <TouchableOpacity
                      className="flex-row items-center"
                      onPress={() => openEditModal(addr, index)}
                    >
                      <Ionicons
                        name="create-outline"
                        size={18}
                        color="#6b7280"
                      />
                      <Text className="text-gray-500 text-sm ml-1">Edit</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Name & Phone */}
                  <View className="flex-row justify-between items-center mb-3">
                    <Text className="text-base font-bold text-gray-900">
                      {[addr.firstName, addr.lastName]
                        .filter(Boolean)
                        .join(' ') ||
                        user?.name ||
                        'N/A'}
                    </Text>
                    {addr.phone ? (
                      <View className="flex-row items-center">
                        <Ionicons
                          name="call-outline"
                          size={14}
                          color="#6b7280"
                        />
                        <Text className="text-sm text-gray-600 font-medium ml-1">
                          {addr.phone}
                        </Text>
                      </View>
                    ) : null}
                  </View>

                  {/* Address line */}
                  <View className="mb-4">
                    <View className="flex-row items-start">
                      <Ionicons
                        name="location-outline"
                        size={16}
                        color="#9ca3af"
                        style={{ marginTop: 2 }}
                      />
                      <Text className="text-gray-600 text-sm leading-5 ml-2 flex-1">
                        {formatAddressLine(addr) || 'No address details'}
                      </Text>
                    </View>
                  </View>

                  {/* Tags + Set Default button */}
                  <View className="flex-row items-center justify-between flex-wrap">
                    <View className="flex-row items-center flex-wrap gap-2">
                      {addr.useAsBilling && (
                        <View className="bg-amber-50 border border-amber-300 rounded-full px-3 py-1 flex-row items-center gap-1">
                          <Ionicons name="star" size={10} color="#d97706" />
                          <Text className="text-amber-700 font-semibold text-xs">
                            DEFAULT SHIPPING
                          </Text>
                        </View>
                      )}
                    </View>

                    {/* Set as Default button — hidden when already default */}
                    {!addr.useAsBilling && (
                      <TouchableOpacity
                        className="flex-row items-center bg-amber-50 border border-amber-200 rounded-full px-3 py-1 mt-1"
                        onPress={() =>
                          handleToggleBillingAddress(index, Number(addr.id))
                        }
                      >
                        <Ionicons
                          name="star-outline"
                          size={12}
                          color="#d97706"
                        />
                        <Text className="text-amber-700 font-medium text-xs ml-1">
                          Set as Default
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))}
          </View>
        </ScrollView>
      </View>

      {/* ── Add / Edit Address Modal ──────────────────────────────────────── */}
      <Modal visible={modalOpen} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.4)',
            justifyContent: 'flex-end',
          }}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{
              backgroundColor: '#fff',
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
            }}
          >
            {/* Modal Header */}
            <View className="flex-row justify-between items-center px-5 pt-5 pb-3 border-b border-gray-100">
              <Text className="text-lg font-bold text-gray-900">
                {isEditMode ? 'Edit Address' : 'Add New Address'}
              </Text>
              <TouchableOpacity onPress={closeModal}>
                <AntDesign name="close" size={22} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <ScrollView
              className="px-5"
              contentContainerStyle={{ paddingBottom: 32 }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* Row: First / Last name */}
              <View className="flex-row gap-3 mt-4">
                <View className="flex-1">
                  <Text className="text-xs text-gray-500 mb-1 font-medium">
                    First Name *
                  </Text>
                  <TextInput
                    className="border border-gray-200 rounded-xl px-3 py-3 text-sm text-gray-800 bg-gray-50"
                    placeholder="John"
                    placeholderTextColor="#aaa"
                    value={form.firstName}
                    onChangeText={(v) => setField('firstName', v)}
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-xs text-gray-500 mb-1 font-medium">
                    Last Name *
                  </Text>
                  <TextInput
                    className="border border-gray-200 rounded-xl px-3 py-3 text-sm text-gray-800 bg-gray-50"
                    placeholder="Doe"
                    placeholderTextColor="#aaa"
                    value={form.lastName}
                    onChangeText={(v) => setField('lastName', v)}
                  />
                </View>
              </View>

              {/* Phone */}
              <View className="mt-4">
                <Text className="text-xs text-gray-500 mb-1 font-medium">
                  Phone Number *
                </Text>
                <TextInput
                  className="border border-gray-200 rounded-xl px-3 py-3 text-sm text-gray-800 bg-gray-50"
                  placeholder="07X XXX XXXX"
                  placeholderTextColor="#aaa"
                  keyboardType="phone-pad"
                  value={form.phone}
                  onChangeText={(v) => setField('phone', v)}
                />
              </View>

              {/* Address */}
              <View className="mt-4">
                <Text className="text-xs text-gray-500 mb-1 font-medium">
                  Street Address *
                </Text>
                <TextInput
                  className="border border-gray-200 rounded-xl px-3 py-3 text-sm text-gray-800 bg-gray-50"
                  placeholder="No. 12, Main Street"
                  placeholderTextColor="#aaa"
                  multiline
                  numberOfLines={2}
                  value={form.address}
                  onChangeText={(v) => setField('address', v)}
                />
              </View>

              {/* City */}
              <View className="mt-4">
                <Text className="text-xs text-gray-500 mb-1 font-medium">
                  City *
                </Text>
                <TextInput
                  className="border border-gray-200 rounded-xl px-3 py-3 text-sm text-gray-800 bg-gray-50"
                  placeholder="Colombo"
                  placeholderTextColor="#aaa"
                  value={form.city}
                  onChangeText={(v) => setField('city', v)}
                />
              </View>

              {/* Province picker */}
              <View className="mt-4">
                <Text className="text-xs text-gray-500 mb-1 font-medium">
                  Province *
                </Text>
                <TouchableOpacity
                  className="border border-gray-200 rounded-xl px-3 py-3 bg-gray-50 flex-row justify-between items-center"
                  onPress={() => setProvincePickerOpen((p) => !p)}
                >
                  <Text
                    className={
                      form.province
                        ? 'text-sm text-gray-800'
                        : 'text-sm text-gray-400'
                    }
                  >
                    {form.province || 'Select Province'}
                  </Text>
                  <Ionicons
                    name={provincePickerOpen ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color="#9ca3af"
                  />
                </TouchableOpacity>

                {provincePickerOpen && (
                  <View className="border border-gray-200 rounded-xl mt-1 bg-white overflow-hidden shadow-sm">
                    {SRI_LANKA_PROVINCES.map((p) => (
                      <TouchableOpacity
                        key={p}
                        className={`px-4 py-3 border-b border-gray-50 flex-row justify-between items-center ${form.province === p ? 'bg-blue-50' : ''}`}
                        onPress={() => {
                          setField('province', p);
                          setProvincePickerOpen(false);
                        }}
                      >
                        <Text
                          className={`text-sm ${form.province === p ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}
                        >
                          {p}
                        </Text>
                        {form.province === p && (
                          <Ionicons
                            name="checkmark"
                            size={16}
                            color="#3b82f6"
                          />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Postal Code */}
              <View className="mt-4">
                <Text className="text-xs text-gray-500 mb-1 font-medium">
                  Postal Code
                </Text>
                <TextInput
                  className="border border-gray-200 rounded-xl px-3 py-3 text-sm text-gray-800 bg-gray-50"
                  placeholder="10100"
                  placeholderTextColor="#aaa"
                  keyboardType="numeric"
                  value={form.postalCode}
                  onChangeText={(v) => setField('postalCode', v)}
                />
              </View>

              {/* Use as Billing */}
              <View className="flex-row justify-between items-center mt-5 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                <View className="flex-1 pr-4">
                  <Text className="text-sm font-semibold text-gray-800">
                    Use as billing address
                  </Text>
                  <Text className="text-xs text-gray-400 mt-0.5">
                    Set this as your default billing address
                  </Text>
                </View>
                <Switch
                  value={form.useAsBilling}
                  onValueChange={(v) => setField('useAsBilling', v)}
                  trackColor={{ false: '#e5e7eb', true: '#3b82f6' }}
                  thumbColor="#fff"
                />
              </View>

              {/* Save Button */}
              <TouchableOpacity
                className={`mt-6 rounded-xl py-4 items-center ${isEditMode ? 'bg-orange-500' : 'bg-blue-500'}`}
                onPress={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white font-bold text-base">
                    {isEditMode ? 'Update Address' : 'Save Address'}
                  </Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

export default AddressBook;
