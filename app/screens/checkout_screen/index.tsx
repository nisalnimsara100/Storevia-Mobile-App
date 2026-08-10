import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { useAuthStore } from '@/app/stores/useAuthStore';

interface CartItem {
  id: number;
  product_name: string;
  product_price: string;
  product_quantity: number;
  product_image: string;
  product_discount: string;
  product_store_id?: number;
  product_cod?: string;
}

interface Address {
  id: number;
  type: string;
  name: string;
  phone: string;
  address: string;
  city: string;
}

interface Voucher {
  id: number;
  code: string;
  discount: number;
  minAmount: number;
  description: string;
  discountType?: 'percentage' | 'flat';
  storeID?: number;
  voucherType?: 'product' | 'shipping';
}

interface ApiAddress {
  id: number;
  firstName?: string;
  lastName?: string;
  address?: string;
  addressLine2?: string | null;
  city?: string;
  province?: string;
  phone?: string;
  useAsBilling?: boolean;
}

interface AddressApiResponse {
  billingAddress?: ApiAddress | null;
  allAddresses?: ApiAddress[];
}

const mapApiAddressToAddress = (addr: ApiAddress): Address => {
  const fullName = `${addr.firstName ?? ''} ${addr.lastName ?? ''}`
    .trim()
    .replace(/\s+/g, ' ');

  const addressLine = [addr.address, addr.addressLine2]
    .filter((part) => part && part.toString().trim().length > 0)
    .join(', ');

  const cityLine = [addr.city, addr.province]
    .filter((part) => part && part.toString().trim().length > 0)
    .join(', ');

  return {
    id: addr.id,
    type: addr.useAsBilling ? 'Billing' : 'Address',
    name: fullName || 'Unnamed',
    phone: addr.phone ?? '',
    address: addressLine,
    city: cityLine,
  };
};

const BASE_URL =
  process.env.EXPO_PUBLIC_APP_BASE_URL ?? 'http://192.168.0.100:8000';
const DEFAULT_EMAIL = process.env.EXPO_PUBLIC_APP_EMAIL ?? '';

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

const generateOrderNumber = () =>
  `#ORD-${Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0')}`;

const CheckoutScreen = () => {
  const insets = useSafeAreaInsets();
  const { cartItems } = useLocalSearchParams();
  const [items, setItems] = React.useState<CartItem[]>([]);
  const [showAddressModal, setShowAddressModal] = React.useState(false);
  const [showVoucherModal, setShowVoucherModal] = React.useState(false);
  const [selectedAddress, setSelectedAddress] = React.useState<Address | null>(
    null,
  );
  const [appliedVouchers, setAppliedVouchers] = React.useState<Voucher[]>([]);
  const [showAddNewAddress, setShowAddNewAddress] = React.useState(false);
  const [newAddressForm, setNewAddressForm] = React.useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    phone: '',
    useAsBilling: true,
  });

  interface UserVoucher {
    voucher_id: number;
    store_id: number;
    user_email: string;
    voucher_code: string;
    voucherDescription: string;
    voucherDiscountType: 'percentage' | 'flat';
    voucherDiscountRate: string;
    voucherDiscountPrice: string;
    voucherExpiryDate: string;
    voucher_minimumSpend: string;
    voucherStoreID: number;
    voucher_type: 'product' | 'shipping';
  }

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showProvinceDropdown, setShowProvinceDropdown] = React.useState(false);
  const [userVouchers, setUserVouchers] = useState<UserVoucher[]>([]);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const { user } = useAuthStore();
  const EMAIL = user?.email || DEFAULT_EMAIL;

  const loadAddresses = React.useCallback(async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/user/address?email=${encodeURIComponent(EMAIL)}`,
      );

      if (!response.ok) {
        console.error('Failed to fetch addresses:', response.status);
        return;
      }

      const data: AddressApiResponse = await response.json();
      const apiAddresses = data.allAddresses ?? [];

      const mappedAddresses = apiAddresses.map(mapApiAddressToAddress);
      setAddresses(mappedAddresses);

      const billingFromAll = apiAddresses.find((addr) => addr.useAsBilling);
      const billingSource = billingFromAll || data.billingAddress || null;

      if (billingSource) {
        setSelectedAddress(mapApiAddressToAddress(billingSource));
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  }, [EMAIL]);

  const fetchUserCollectedVouchers = React.useCallback(async () => {
    const email = EMAIL;
    if (!email) return;
    try {
      const res = await fetch(`${BASE_URL}/api/user/get_voucher/${email}`);
      const data = await res.json();
      if (data.status === 'success' && Array.isArray(data.vouchers)) {
        setUserVouchers(data.vouchers);
      }
    } catch (err) {
      console.error('Error fetching user vouchers:', err);
    }
  }, [EMAIL]);

  // Convert user vouchers to Voucher format
  const vouchers: Voucher[] = userVouchers.map((uv, index) => {
    const discountType = uv.voucherDiscountType;
    const discountAmount =
      discountType === 'percentage'
        ? parseFloat(uv.voucherDiscountRate)
        : parseFloat(uv.voucherDiscountPrice);

    return {
      id: uv.voucher_id || index,
      code: uv.voucher_code,
      discount: discountAmount,
      minAmount: parseFloat(uv.voucher_minimumSpend),
      description: uv.voucherDescription,
      discountType: discountType,
      storeID: uv.voucherStoreID,
      voucherType: uv.voucher_type,
    };
  });

  React.useEffect(() => {
    if (cartItems) {
      try {
        const parsedItems = JSON.parse(cartItems as string);
        setItems(Array.isArray(parsedItems) ? parsedItems : []);
      } catch (error) {
        console.error('Error parsing cart items:', error);
        setItems([]);
      }
    }
  }, [cartItems]);

  React.useEffect(() => {
    loadAddresses();
    fetchUserCollectedVouchers();
  }, [loadAddresses, fetchUserCollectedVouchers]);

  React.useEffect(() => {
    setOrderNumber(generateOrderNumber());
  }, []);

  const calculateSubtotal = () => {
    return items
      .reduce((total, item) => {
        return total + parseFloat(item.product_price) * item.product_quantity;
      }, 0)
      .toFixed(2);
  };

  const shippingCost = React.useMemo(() => {
    // Group items by store and find max COD per store
    const storeMaxCod: Record<number, number> = {};
    items.forEach((item) => {
      const cod = parseFloat(item.product_cod || '0');
      const storeId = item.product_store_id || 0;
      if (!storeMaxCod[storeId]) {
        storeMaxCod[storeId] = cod;
      } else {
        storeMaxCod[storeId] = Math.max(storeMaxCod[storeId], cod);
      }
    });
    // Sum the highest COD from each store
    return Object.values(storeMaxCod).reduce((sum, cod) => sum + cod, 0);
  }, [items]);

  const calculateVoucherDiscount = () => {
    if (appliedVouchers.length === 0) return 0;

    const subtotal = parseFloat(calculateSubtotal());
    const netAmount = subtotal;

    let totalVoucherDiscount = 0;
    let remainingAmount = netAmount;

    appliedVouchers.forEach((voucher) => {
      // Check if minimum spend is met
      if (remainingAmount < voucher.minAmount) return;

      // Calculate discount based on type
      let voucherAmount = 0;
      if (voucher.voucherType === 'shipping') {
        voucherAmount = shippingCost;
      } else if (voucher.discountType === 'percentage') {
        voucherAmount = (remainingAmount * voucher.discount) / 100;
      } else {
        voucherAmount = Math.min(voucher.discount, remainingAmount);
      }

      totalVoucherDiscount += voucherAmount;
      remainingAmount -= voucherAmount;
    });

    return totalVoucherDiscount;
  };

  const deliveryDate = React.useMemo(() => {
    const today = new Date();
    const min = new Date(today);
    min.setDate(today.getDate() + 5);

    const year = min.getFullYear();
    const month = String(min.getMonth() + 1).padStart(2, '0');
    const day = String(min.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }, []);

  const subtotal = parseFloat(calculateSubtotal());
  const voucherDiscount = calculateVoucherDiscount();
  const total = (subtotal - voucherDiscount + shippingCost).toFixed(2);

  const router = useRouter();

  const submitOrder = async () => {
    if (!selectedAddress) {
      Alert.alert('Select address', 'Please select a delivery address.');
      return;
    }

    if (items.length === 0) {
      Alert.alert('Empty cart', 'Your cart is empty.');
      return;
    }

    if (!BASE_URL) {
      Alert.alert('Configuration error', 'Base URL is not configured.');
      return;
    }

    setIsProcessing(true);

    try {
      const formData = new FormData();

      formData.append('address_id', selectedAddress.id.toString());

      const finalOrderNumber = orderNumber || generateOrderNumber();
      formData.append('order_number', finalOrderNumber.replace('#', ''));

      formData.append('delivery_date', deliveryDate);

      formData.append('note', '');

      const hasShippingVoucher = appliedVouchers.some(
        (v) => v.voucherType === 'shipping',
      );
      const deliveryFee = shippingCost;

      if (hasShippingVoucher) {
        formData.append('order_cod', '0');
      } else {
        formData.append('order_cod', deliveryFee.toString());
      }

      formData.append('order_fee', total.toString());
      formData.append('user_email', DEFAULT_EMAIL);
      formData.append('order_status', 'Placed');

      const orderItemsPayload = items.map((item) => {
        const price = parseFloat(item.product_price);

        return {
          product_id: item.id,
          product_name: item.product_name,
          product_image: item.product_image,
          product_quantity: item.product_quantity,
          product_price: price.toFixed(2),
          product_discount: item.product_discount,
          product_store_id: item.product_store_id,
        };
      });

      formData.append('order_items', JSON.stringify(orderItemsPayload));

      const voucherDiscountAmount = calculateVoucherDiscount().toString();
      formData.append('voucher_discount_amount', voucherDiscountAmount);

      // const productDiscountAmount = calculateDiscount().toString();
      // formData.append('discount_amount', productDiscountAmount);

      const firstItem = items[0];
      if (firstItem && firstItem.product_store_id != null) {
        formData.append('store_id', String(firstItem.product_store_id));
      }

      const response = await fetch(`${BASE_URL}/api/orders`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        console.error('Failed to submit order:', response.status);
        Alert.alert(
          'Order failed',
          'Could not place your order. Please try again.',
        );
        return;
      }

      await response.json();

      // Navigate to order confirmation screen with real order details
      const shippingTo = selectedAddress
        ? `${selectedAddress.name}, ${selectedAddress.address}, ${selectedAddress.city}`
        : '';

      router.replace({
        pathname: '/screens/order_confirmation_screen',
        params: {
          orderNumber: finalOrderNumber,
          deliveryDate,
          shippingTo,
        },
      });
    } catch (error) {
      console.error('Error submitting order:', error);
      Alert.alert(
        'Order failed',
        'An unexpected error occurred. Please try again.',
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100" edges={['bottom']}>
      <StatusBar style="light" />
      <View style={styles.container}>
        {/* Header — top-inset padding baked in so the orange extends behind the status bar */}
        <View
          style={[
            styles.header,
            { paddingTop: insets.top + verticalScale(12) },
          ]}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Order Review</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {items.length > 0 ? (
            <>
              {/* Order Items Section */}
              <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="bag-check" size={20} color="#f97316" />
                  <Text style={styles.sectionTitle}>
                    Order Items ({items.length})
                  </Text>
                </View>

                {items.map((item, index) => (
                  <View key={item.id}>
                    <View style={styles.productCard}>
                      <View style={styles.productImageContainer}>
                        {item.product_image ? (
                          <Image
                            source={{ uri: item.product_image }}
                            style={styles.productImage}
                            resizeMode="cover"
                          />
                        ) : (
                          <View style={styles.placeholderImage}>
                            <Ionicons name="image" size={32} color="#ccc" />
                          </View>
                        )}
                        {item.product_discount && (
                          <View style={styles.discountBadge}>
                            <Text style={styles.discountText}>
                              {item.product_discount}%
                            </Text>
                          </View>
                        )}
                      </View>

                      <View style={styles.productDetails}>
                        <Text style={styles.productName} numberOfLines={2}>
                          {item.product_name}
                        </Text>

                        <View style={styles.priceContainer}>
                          <Text style={styles.currentPrice}>
                            Rs. {parseFloat(item.product_price).toFixed(2)}
                          </Text>
                          {item.product_discount && (
                            <Text style={styles.originalPrice}>
                              {Math.round(parseFloat(item.product_discount))}%
                              off
                            </Text>
                          )}
                        </View>

                        <View style={styles.quantityContainer}>
                          <Text style={styles.quantityLabel}>Quantity:</Text>
                          <View style={styles.quantityBadge}>
                            <Text style={styles.quantityValue}>
                              {item.product_quantity}
                            </Text>
                          </View>
                        </View>

                        <Text style={styles.itemTotal}>
                          Total: Rs.{' '}
                          {(
                            parseFloat(item.product_price) *
                            item.product_quantity *
                            (1 - parseFloat(item.product_discount || '0') / 100)
                          ).toFixed(2)}
                        </Text>
                      </View>
                    </View>

                    {index < items.length - 1 && (
                      <View style={styles.divider} />
                    )}
                  </View>
                ))}
              </View>

              {/* Delivery & Promo Section */}
              <View style={styles.sectionContainer}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setShowAddressModal(true)}
                  style={styles.infoCard}
                >
                  <View style={styles.infoBadge}>
                    <Ionicons name="location" size={20} color="#f97316" />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Delivery Address</Text>
                    <Text style={styles.infoValue}>
                      {selectedAddress
                        ? selectedAddress.address
                        : 'Select Delivery Address'}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#ccc" />
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setShowVoucherModal(true)}
                  style={styles.infoCard}
                >
                  <View style={styles.infoBadge}>
                    <Ionicons name="ticket" size={20} color="#f97316" />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Promo Code</Text>
                    <Text style={styles.infoValue} numberOfLines={1}>
                      {appliedVouchers.length > 0
                        ? `${appliedVouchers.length} voucher${appliedVouchers.length > 1 ? 's' : ''} applied`
                        : 'Apply Coupon Code'}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#ccc" />
                </TouchableOpacity>
              </View>

              {/* Price Breakdown Section */}
              <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="calculator" size={20} color="#f97316" />
                  <Text style={styles.sectionTitle}>Price Details</Text>
                </View>

                <View style={styles.priceBreakdown}>
                  <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>Subtotal</Text>
                    <Text style={styles.priceValue}>
                      Rs. {subtotal.toFixed(2)}
                    </Text>
                  </View>

                  {appliedVouchers.length > 0 &&
                    appliedVouchers.map((voucher) => (
                      <View key={voucher.id} style={styles.priceRow}>
                        <Text style={styles.discountLabel}>
                          Voucher ({voucher.code})
                        </Text>
                        <Text style={styles.discountValue}>
                          - Rs.{' '}
                          {voucher.discountType === 'percentage'
                            ? (
                                (parseFloat(calculateSubtotal()) *
                                  voucher.discount) /
                                100
                              ).toFixed(2)
                            : voucher.discount.toFixed(2)}
                        </Text>
                      </View>
                    ))}

                  <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>Shipping</Text>
                    <Text style={styles.priceValue}>
                      Rs. {shippingCost.toFixed(2)}
                    </Text>
                  </View>

                  <View style={styles.totalDivider} />

                  <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Total Amount</Text>
                    <Text style={styles.totalValue}>Rs. {total}</Text>
                  </View>

                  {calculateVoucherDiscount() > 0 && (
                    <View style={styles.savingsContainer}>
                      <Ionicons
                        name="checkmark-circle"
                        size={16}
                        color="#27AE60"
                      />
                      <Text style={styles.savingsText}>
                        You saved Rs. {calculateVoucherDiscount().toFixed(2)}
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              {/* CTA Section */}
              <View style={styles.ctaContainer}>
                <TouchableOpacity
                  style={styles.proceedButton}
                  onPress={submitOrder}
                  disabled={isProcessing}
                >
                  <Text style={styles.proceedButtonText}>
                    {isProcessing ? 'Placing Order...' : 'Proceed to Payment'}
                  </Text>
                  <Ionicons
                    name="arrow-forward"
                    size={20}
                    color="#fff"
                    style={{ marginLeft: 8 }}
                  />
                </TouchableOpacity>

                <TouchableOpacity style={styles.continueShoppingButton}>
                  <Text style={styles.continueShoppingText}>
                    Continue Shopping
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.safeBottom} />
            </>
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="bag-outline" size={80} color="#ddd" />
              <Text style={styles.emptyText}>Your cart is empty</Text>
              <Text style={styles.emptySubtext}>
                Add items to your cart to proceed
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Address Modal */}
        <Modal visible={showAddressModal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Delivery Address</Text>
                <TouchableOpacity onPress={() => setShowAddressModal(false)}>
                  <Ionicons name="close" size={24} color="#1a1a1a" />
                </TouchableOpacity>
              </View>

              <ScrollView
                style={styles.modalBody}
                showsVerticalScrollIndicator={false}
              >
                {!showAddNewAddress ? (
                  <>
                    {/* Existing Addresses */}
                    {addresses.map((address) => (
                      <TouchableOpacity
                        key={address.id}
                        onPress={() => {
                          setSelectedAddress(address);
                          setShowAddressModal(false);
                        }}
                        style={[
                          styles.addressCard,
                          selectedAddress?.id === address.id &&
                            styles.addressCardSelected,
                        ]}
                      >
                        <View style={styles.addressCardHeader}>
                          <View style={styles.addressType}>
                            <Text style={styles.addressTypeText}>
                              {address.type}
                            </Text>
                          </View>
                          {selectedAddress?.id === address.id && (
                            <Ionicons
                              name="checkmark-circle"
                              size={24}
                              color="#f97316"
                            />
                          )}
                        </View>
                        <Text style={styles.addressName}>{address.name}</Text>
                        <Text style={styles.addressPhone}>{address.phone}</Text>
                        <Text style={styles.addressText}>
                          {address.address}
                        </Text>
                        <Text style={styles.addressCity}>{address.city}</Text>
                      </TouchableOpacity>
                    ))}

                    {/* Add New Address Button */}
                    <TouchableOpacity
                      onPress={() => setShowAddNewAddress(true)}
                      style={styles.addNewAddressButton}
                    >
                      <Ionicons name="add-circle" size={24} color="#f97316" />
                      <Text style={styles.addNewAddressText}>
                        Add New Address
                      </Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    {/* Add New Address Form */}
                    <View style={styles.formContainer}>
                      <Text style={styles.formTitle}>Add New Address</Text>

                      <TextInput
                        style={styles.textInput}
                        placeholder="First Name"
                        placeholderTextColor="#999"
                        value={newAddressForm.firstName}
                        onChangeText={(text: string) =>
                          setNewAddressForm({
                            ...newAddressForm,
                            firstName: text,
                          })
                        }
                      />

                      <TextInput
                        style={styles.textInput}
                        placeholder="Last Name"
                        placeholderTextColor="#999"
                        value={newAddressForm.lastName}
                        onChangeText={(text: string) =>
                          setNewAddressForm({
                            ...newAddressForm,
                            lastName: text,
                          })
                        }
                      />

                      <TextInput
                        style={styles.textInput}
                        placeholder="Phone Number"
                        placeholderTextColor="#999"
                        keyboardType="phone-pad"
                        value={newAddressForm.phone}
                        onChangeText={(text: string) =>
                          setNewAddressForm({ ...newAddressForm, phone: text })
                        }
                      />

                      <TextInput
                        style={styles.textInput}
                        placeholder="Address"
                        placeholderTextColor="#999"
                        multiline
                        numberOfLines={3}
                        value={newAddressForm.address}
                        onChangeText={(text: string) =>
                          setNewAddressForm({
                            ...newAddressForm,
                            address: text,
                          })
                        }
                      />

                      <TextInput
                        style={styles.textInput}
                        placeholder="City"
                        placeholderTextColor="#999"
                        value={newAddressForm.city}
                        onChangeText={(text: string) =>
                          setNewAddressForm({ ...newAddressForm, city: text })
                        }
                      />

                      <View style={styles.dropdownField}>
                        <TouchableOpacity
                          style={styles.dropdownButton}
                          activeOpacity={0.7}
                          onPress={() =>
                            setShowProvinceDropdown(!showProvinceDropdown)
                          }
                        >
                          <Text
                            style={
                              newAddressForm.province
                                ? styles.dropdownButtonText
                                : styles.dropdownButtonPlaceholder
                            }
                          >
                            {newAddressForm.province || 'Select Province'}
                          </Text>
                          <Ionicons
                            name={
                              showProvinceDropdown
                                ? 'chevron-up'
                                : 'chevron-down'
                            }
                            size={18}
                            color="#666"
                          />
                        </TouchableOpacity>

                        {showProvinceDropdown && (
                          <View style={styles.dropdownList}>
                            {SRI_LANKA_PROVINCES.map((province) => (
                              <TouchableOpacity
                                key={province}
                                style={styles.dropdownItem}
                                onPress={() => {
                                  setNewAddressForm({
                                    ...newAddressForm,
                                    province,
                                  });
                                  setShowProvinceDropdown(false);
                                }}
                              >
                                <Text style={styles.dropdownItemText}>
                                  {province}
                                </Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                        )}
                      </View>

                      <TextInput
                        style={styles.textInput}
                        placeholder="Postal Code"
                        placeholderTextColor="#999"
                        keyboardType="number-pad"
                        value={newAddressForm.postalCode}
                        onChangeText={(text: string) =>
                          setNewAddressForm({
                            ...newAddressForm,
                            postalCode: text,
                          })
                        }
                      />

                      <View style={styles.billingRow}>
                        <Text style={styles.billingLabel}>
                          Use as billing address
                        </Text>
                        <Switch
                          value={newAddressForm.useAsBilling}
                          onValueChange={(value: boolean) =>
                            setNewAddressForm({
                              ...newAddressForm,
                              useAsBilling: value,
                            })
                          }
                          trackColor={{ false: '#ccc', true: '#f97316' }}
                          thumbColor="#fff"
                        />
                      </View>

                      <TouchableOpacity
                        style={styles.saveAddressButton}
                        onPress={async () => {
                          if (
                            newAddressForm.firstName &&
                            newAddressForm.lastName &&
                            newAddressForm.phone &&
                            newAddressForm.address &&
                            newAddressForm.city &&
                            newAddressForm.province &&
                            newAddressForm.postalCode
                          ) {
                            try {
                              const addressPayload = {
                                firstName: newAddressForm.firstName,
                                lastName: newAddressForm.lastName,
                                address: newAddressForm.address,
                                city: newAddressForm.city,
                                province: newAddressForm.province,
                                postalCode: newAddressForm.postalCode,
                                phone: newAddressForm.phone,
                                useAsBilling: newAddressForm.useAsBilling,
                              };

                              const formData = new FormData();
                              formData.append('email', DEFAULT_EMAIL);
                              formData.append(
                                'address',
                                JSON.stringify(addressPayload),
                              );

                              const response = await fetch(
                                `${BASE_URL}/api/user/address/add`,
                                {
                                  method: 'POST',
                                  body: formData,
                                },
                              );

                              if (!response.ok) {
                                console.error(
                                  'Failed to add address:',
                                  response.status,
                                );
                                return;
                              }

                              await loadAddresses();

                              setShowAddressModal(false);
                              setShowAddNewAddress(false);
                              setNewAddressForm({
                                firstName: '',
                                lastName: '',
                                address: '',
                                city: '',
                                province: '',
                                postalCode: '',
                                phone: '',
                                useAsBilling: true,
                              });
                              setShowProvinceDropdown(false);
                            } catch (error) {
                              console.error('Error adding address:', error);
                            }
                          }
                        }}
                      >
                        <Text style={styles.saveAddressButtonText}>
                          Save Address
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.backButton2}
                        onPress={() => setShowAddNewAddress(false)}
                      >
                        <Text style={styles.backButtonText}>Back</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Voucher Modal */}
        <Modal visible={showVoucherModal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Available Vouchers</Text>
                <TouchableOpacity onPress={() => setShowVoucherModal(false)}>
                  <Ionicons name="close" size={24} color="#1a1a1a" />
                </TouchableOpacity>
              </View>

              <ScrollView
                style={styles.modalBody}
                showsVerticalScrollIndicator={false}
              >
                {vouchers.map((voucher) => {
                  const isApplied = appliedVouchers.some(
                    (v) => v.id === voucher.id,
                  );
                  const isShipping = voucher.voucherType === 'shipping';
                  const cardBgColor = isShipping ? '#E8F9F8' : '#FFF8EC';
                  const iconColor = isShipping ? '#27AE60' : '#f97316';

                  return (
                    <TouchableOpacity
                      key={voucher.id}
                      onPress={() => {
                        if (isApplied) {
                          setAppliedVouchers(
                            appliedVouchers.filter((v) => v.id !== voucher.id),
                          );
                        } else {
                          setAppliedVouchers([...appliedVouchers, voucher]);
                        }
                      }}
                      style={[
                        styles.voucherCard,
                        { backgroundColor: cardBgColor },
                        isApplied && styles.voucherCardSelected,
                      ]}
                    >
                      <View style={styles.voucherLeft}>
                        <View style={styles.voucherCodeContainer}>
                          <Ionicons name="ticket" size={20} color={iconColor} />
                          <Text style={styles.voucherCode}>{voucher.code}</Text>
                        </View>
                        <Text style={styles.voucherDescription}>
                          {voucher.description}
                        </Text>
                        {voucher.minAmount > 0 && (
                          <Text style={styles.voucherMinAmount}>
                            Min. spend: Rs. {voucher.minAmount}
                          </Text>
                        )}
                        <Text
                          style={[styles.voucherMinAmount, { marginTop: 4 }]}
                        >
                          Discount:{' '}
                          {voucher.discountType === 'percentage'
                            ? `${voucher.discount}%`
                            : `Rs. ${voucher.discount}`}
                        </Text>
                        {isShipping && (
                          <Text
                            style={[
                              styles.voucherMinAmount,
                              { marginTop: 4, color: '#27AE60' },
                            ]}
                          >
                            (Shipping Voucher)
                          </Text>
                        )}
                      </View>

                      <View style={styles.voucherRight}>
                        <View
                          style={[
                            styles.discountCircle,
                            { backgroundColor: iconColor },
                          ]}
                        >
                          <Text
                            style={[styles.discountPercent, { color: '#fff' }]}
                          >
                            {voucher.discount}
                            {voucher.discountType === 'percentage' ? '%' : ''}
                          </Text>
                          <Text style={[styles.discountOff, { color: '#fff' }]}>
                            {voucher.discountType === 'percentage'
                              ? 'OFF'
                              : 'OFF'}
                          </Text>
                        </View>
                        {isApplied && (
                          <Ionicons
                            name="checkmark-circle"
                            size={24}
                            color={iconColor}
                          />
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                })}

                {appliedVouchers.length > 0 && (
                  <TouchableOpacity
                    onPress={() => {
                      setAppliedVouchers([]);
                    }}
                    style={styles.removeVoucherButton}
                  >
                    <Ionicons name="close-circle" size={20} color="#f97316" />
                    <Text style={styles.removeVoucherText}>
                      Remove All Vouchers
                    </Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  onPress={() => setShowVoucherModal(false)}
                  style={styles.doneButton}
                >
                  <Text style={styles.doneButtonText}>Done</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default CheckoutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f97316',
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(16),
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  sectionContainer: {
    backgroundColor: '#fff',
    marginTop: verticalScale(8),
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(16),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(16),
  },
  sectionTitle: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: '#1a1a1a',
    marginLeft: scale(8),
  },
  productCard: {
    flexDirection: 'row',
    marginBottom: verticalScale(12),
  },
  productImageContainer: {
    position: 'relative',
    marginRight: scale(12),
  },
  productImage: {
    width: scale(80),
    height: scale(80),
    borderRadius: moderateScale(8),
    backgroundColor: '#f0f0f0',
  },
  placeholderImage: {
    width: scale(80),
    height: scale(80),
    borderRadius: moderateScale(8),
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  discountBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#f97316',
    borderRadius: moderateScale(12),
    paddingHorizontal: scale(6),
    paddingVertical: verticalScale(2),
  },
  discountText: {
    fontSize: moderateScale(10),
    fontWeight: '700',
    color: '#fff',
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: moderateScale(13),
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: verticalScale(6),
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(8),
  },
  currentPrice: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    color: '#f97316',
  },
  originalPrice: {
    fontSize: moderateScale(12),
    color: '#999',
    textDecorationLine: 'none',
    marginLeft: scale(8),
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(6),
  },
  quantityLabel: {
    fontSize: moderateScale(11),
    color: '#666',
    marginRight: scale(6),
  },
  quantityBadge: {
    backgroundColor: '#F5F5F5',
    borderRadius: moderateScale(4),
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(2),
  },
  quantityValue: {
    fontSize: moderateScale(11),
    fontWeight: '600',
    color: '#1a1a1a',
  },
  itemTotal: {
    fontSize: moderateScale(12),
    fontWeight: '600',
    color: '#f97316',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: verticalScale(12),
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: moderateScale(8),
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(12),
    marginBottom: verticalScale(12),
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  infoBadge: {
    width: scale(40),
    height: scale(40),
    borderRadius: moderateScale(20),
    backgroundColor: '#FFF0E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(12),
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: moderateScale(12),
    color: '#999',
    marginBottom: verticalScale(2),
  },
  infoValue: {
    fontSize: moderateScale(13),
    fontWeight: '500',
    color: '#f97316',
  },
  priceBreakdown: {
    backgroundColor: '#F9F9F9',
    borderRadius: moderateScale(8),
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(12),
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(10),
  },
  priceLabel: {
    fontSize: moderateScale(13),
    color: '#666',
  },
  priceValue: {
    fontSize: moderateScale(13),
    fontWeight: '500',
    color: '#1a1a1a',
  },
  discountLabel: {
    fontSize: moderateScale(13),
    color: '#27AE60',
    fontWeight: '500',
  },
  discountValue: {
    fontSize: moderateScale(13),
    fontWeight: '600',
    color: '#27AE60',
  },
  totalDivider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: verticalScale(10),
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(10),
  },
  totalLabel: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    color: '#1a1a1a',
  },
  totalValue: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: '#f97316',
  },
  savingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(10),
    paddingTop: verticalScale(10),
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  savingsText: {
    fontSize: moderateScale(12),
    color: '#27AE60',
    fontWeight: '500',
    marginLeft: scale(8),
  },
  ctaContainer: {
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(16),
  },
  proceedButton: {
    flexDirection: 'row',
    backgroundColor: '#f97316',
    borderRadius: moderateScale(8),
    paddingVertical: verticalScale(14),
    paddingHorizontal: scale(16),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(12),
  },
  proceedButtonText: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    color: '#fff',
  },
  continueShoppingButton: {
    borderWidth: 1.5,
    borderColor: '#f97316',
    borderRadius: moderateScale(8),
    paddingVertical: verticalScale(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueShoppingText: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: '#f97316',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: verticalScale(50),
  },
  emptyText: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    color: '#999',
    marginTop: verticalScale(16),
  },
  emptySubtext: {
    fontSize: moderateScale(14),
    color: '#bbb',
    marginTop: verticalScale(8),
  },
  safeBottom: {
    height: verticalScale(20),
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: moderateScale(20),
    borderTopRightRadius: moderateScale(20),
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(16),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: '#1a1a1a',
  },
  modalBody: {
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(16),
  },
  // Address Card styles
  addressCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: moderateScale(12),
    borderWidth: 2,
    borderColor: '#f0f0f0',
    padding: scale(12),
    marginBottom: verticalScale(12),
  },
  addressCardSelected: {
    borderColor: '#f97316',
    backgroundColor: '#FFF5F0',
  },
  addressCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(8),
  },
  addressType: {
    backgroundColor: '#f97316',
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(4),
  },
  addressTypeText: {
    color: '#fff',
    fontSize: moderateScale(11),
    fontWeight: '600',
  },
  addressName: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: verticalScale(4),
  },
  addressPhone: {
    fontSize: moderateScale(12),
    color: '#666',
    marginBottom: verticalScale(6),
  },
  addressText: {
    fontSize: moderateScale(12),
    color: '#666',
    marginBottom: verticalScale(4),
  },
  addressCity: {
    fontSize: moderateScale(12),
    fontWeight: '500',
    color: '#f97316',
  },
  addNewAddressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#f97316',
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(16),
    marginBottom: verticalScale(16),
  },
  addNewAddressText: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: '#f97316',
    marginLeft: scale(8),
  },
  // Add New Address Form styles
  formContainer: {
    marginBottom: verticalScale(20),
  },
  formTitle: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: verticalScale(16),
  },
  textInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: moderateScale(8),
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(12),
    marginBottom: verticalScale(12),
    fontSize: moderateScale(13),
    color: '#1a1a1a',
  },
  dropdownField: {
    marginBottom: verticalScale(12),
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F5',
    borderRadius: moderateScale(8),
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(12),
  },
  dropdownButtonText: {
    fontSize: moderateScale(13),
    color: '#1a1a1a',
  },
  dropdownButtonPlaceholder: {
    fontSize: moderateScale(13),
    color: '#999',
  },
  dropdownList: {
    marginTop: verticalScale(4),
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(8),
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(10),
  },
  dropdownItemText: {
    fontSize: moderateScale(13),
    color: '#1a1a1a',
  },
  billingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(12),
  },
  billingLabel: {
    fontSize: moderateScale(13),
    color: '#1a1a1a',
    fontWeight: '500',
  },
  saveAddressButton: {
    backgroundColor: '#f97316',
    borderRadius: moderateScale(8),
    paddingVertical: verticalScale(12),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(12),
  },
  saveAddressButtonText: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    color: '#fff',
  },
  backButton2: {
    borderWidth: 1.5,
    borderColor: '#f97316',
    borderRadius: moderateScale(8),
    paddingVertical: verticalScale(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: '#f97316',
  },
  // Voucher Card styles
  voucherCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: moderateScale(12),
    borderWidth: 2,
    borderColor: '#f0f0f0',
    padding: scale(12),
    marginBottom: verticalScale(12),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  voucherCardSelected: {
    borderColor: '#f97316',
    backgroundColor: '#FFF5F0',
  },
  voucherLeft: {
    flex: 1,
  },
  voucherCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(6),
  },
  voucherCode: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    color: '#f97316',
    marginLeft: scale(8),
  },
  voucherDescription: {
    fontSize: moderateScale(12),
    color: '#666',
    marginBottom: verticalScale(6),
  },
  voucherMinAmount: {
    fontSize: moderateScale(11),
    color: '#999',
    fontStyle: 'italic',
  },
  voucherRight: {
    alignItems: 'center',
    marginLeft: scale(12),
  },
  discountCircle: {
    width: scale(60),
    height: scale(60),
    borderRadius: moderateScale(30),
    backgroundColor: '#f97316',
    borderWidth: 0,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(8),
  },
  discountPercent: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    color: '#fff',
  },
  discountOff: {
    fontSize: moderateScale(10),
    color: '#fff',
    fontWeight: '600',
  },
  removeVoucherButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#f97316',
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(12),
    marginTop: verticalScale(16),
  },
  removeVoucherText: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: '#f97316',
    marginLeft: scale(8),
  },
  doneButton: {
    backgroundColor: '#f97316',
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(14),
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: verticalScale(16),
    marginHorizontal: scale(16),
  },
  doneButtonText: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: '#fff',
  },
});
