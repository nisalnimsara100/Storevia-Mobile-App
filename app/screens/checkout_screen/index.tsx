import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as React from 'react';
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';


interface CartItem {
  id: number;
  product_name: string;
  product_price: string;
  product_quantity: number;
  product_image: string;
  product_discount: string;
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
}

const CheckoutScreen = () => {
  const { cartItems } = useLocalSearchParams();
  const [items, setItems] = React.useState<CartItem[]>([]);
  const [showAddressModal, setShowAddressModal] = React.useState(false);
  const [showVoucherModal, setShowVoucherModal] = React.useState(false);
  const [selectedAddress, setSelectedAddress] = React.useState<Address | null>(
    null,
  );
  const [appliedVoucher, setAppliedVoucher] = React.useState<Voucher | null>(
    null,
  );
  const [showAddNewAddress, setShowAddNewAddress] = React.useState(false);
  const [newAddressForm, setNewAddressForm] = React.useState({
    name: '',
    phone: '',
    address: '',
    city: '',
  });

  // Sample addresses
  const addresses: Address[] = [
    {
      id: 1,
      type: 'Home',
      name: 'John Doe',
      phone: '+971 50 123 4567',
      address: '123 Main Street, Apartment 4B',
      city: 'Dubai',
    },
    {
      id: 2,
      type: 'Office',
      name: 'John Doe',
      phone: '+971 50 123 4567',
      address: '456 Business Park, Floor 3',
      city: 'Abu Dhabi',
    },
  ];

  // Sample vouchers
  const vouchers: Voucher[] = [
    {
      id: 1,
      code: 'WELCOME50',
      discount: 50,
      minAmount: 200,
      description: 'Get Rs.50 off on orders above Rs.200',
    },
    {
      id: 2,
      code: 'SAVE100',
      discount: 100,
      minAmount: 500,
      description: 'Get Rs.100 off on orders above Rs.500',
    },
    {
      id: 3,
      code: 'SHIP50',
      discount: 50,
      minAmount: 0,
      description: 'Free shipping on all orders',
    },
  ];

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

  const calculateSubtotal = () => {
    return items
      .reduce((total, item) => {
        return total + parseFloat(item.product_price) * item.product_quantity;
      }, 0)
      .toFixed(2);
  };

  const calculateDiscount = () => {
    return items
      .reduce((total, item) => {
        const discount = parseFloat(item.product_discount || '0');
        const itemPrice =
          parseFloat(item.product_price) * item.product_quantity;
        return total + (itemPrice * discount) / 100;
      }, 0)
      .toFixed(2);
  };

  const shippingCost = 0;
  const subtotal = parseFloat(calculateSubtotal());
  const discount = parseFloat(calculateDiscount());
  const total = (subtotal - discount + shippingCost).toFixed(2);

  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-gray-100" edges={['top', 'bottom']}>
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
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
                <Ionicons name="bag-check" size={20} color="#FF6B35" />
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
                          Rs.{' '}
                          {(
                            parseFloat(item.product_price) *
                            (1 - parseFloat(item.product_discount || '0') / 100)
                          ).toFixed(2)}
                        </Text>
                        {item.product_discount && (
                          <Text style={styles.originalPrice}>
                            Rs. {item.product_price}
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

                  {index < items.length - 1 && <View style={styles.divider} />}
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
                  <Ionicons name="location" size={20} color="#FF6B35" />
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
                  <Ionicons name="ticket" size={20} color="#FF6B35" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Promo Code</Text>
                  <Text style={styles.infoValue}>
                    {appliedVoucher ? appliedVoucher.code : 'Apply Coupon Code'}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#ccc" />
              </TouchableOpacity>
            </View>

            {/* Price Breakdown Section */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Ionicons name="calculator" size={20} color="#FF6B35" />
                <Text style={styles.sectionTitle}>Price Details</Text>
              </View>

              <View style={styles.priceBreakdown}>
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Subtotal</Text>
                  <Text style={styles.priceValue}>
                    Rs. {subtotal.toFixed(2)}
                  </Text>
                </View>

                {discount > 0 && (
                  <View style={styles.priceRow}>
                    <Text style={styles.discountLabel}>Discount</Text>
                    <Text style={styles.discountValue}>- Rs. {discount}</Text>
                  </View>
                )}

                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Shipping</Text>
                  <Text style={[styles.priceValue, { color: '#27AE60' }]}>
                    Free
                  </Text>
                </View>

                <View style={styles.totalDivider} />

                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Total Amount</Text>
                  <Text style={styles.totalValue}>Rs. {total}</Text>
                </View>

                <View style={styles.savingsContainer}>
                  <Ionicons name="checkmark-circle" size={16} color="#27AE60" />
                  <Text style={styles.savingsText}>
                    You saved Rs. {discount}
                  </Text>
                </View>
              </View>
            </View>

            {/* CTA Section */}
            <View style={styles.ctaContainer}>
              <TouchableOpacity style={styles.proceedButton}>
                <Text style={styles.proceedButtonText}>Proceed to Payment</Text>
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
                            color="#FF6B35"
                          />
                        )}
                      </View>
                      <Text style={styles.addressName}>{address.name}</Text>
                      <Text style={styles.addressPhone}>{address.phone}</Text>
                      <Text style={styles.addressText}>{address.address}</Text>
                      <Text style={styles.addressCity}>{address.city}</Text>
                    </TouchableOpacity>
                  ))}

                  {/* Add New Address Button */}
                  <TouchableOpacity
                    onPress={() => setShowAddNewAddress(true)}
                    style={styles.addNewAddressButton}
                  >
                    <Ionicons name="add-circle" size={24} color="#FF6B35" />
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
                      placeholder="Full Name"
                      placeholderTextColor="#999"
                      value={newAddressForm.name}
                      onChangeText={(text: string) =>
                        setNewAddressForm({ ...newAddressForm, name: text })
                      }
                    />

                    <TextInput
                      style={styles.textInput}
                      placeholder="Phone Number"
                      placeholderTextColor="#999"
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
                        setNewAddressForm({ ...newAddressForm, address: text })
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

                    <TouchableOpacity
                      style={styles.saveAddressButton}
                      onPress={() => {
                        if (
                          newAddressForm.name &&
                          newAddressForm.phone &&
                          newAddressForm.address &&
                          newAddressForm.city
                        ) {
                          const newAddr: Address = {
                            id: addresses.length + 1,
                            type: 'Other',
                            ...newAddressForm,
                          };
                          setSelectedAddress(newAddr);
                          setShowAddressModal(false);
                          setShowAddNewAddress(false);
                          setNewAddressForm({
                            name: '',
                            phone: '',
                            address: '',
                            city: '',
                          });
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
              {vouchers.map((voucher) => (
                <TouchableOpacity
                  key={voucher.id}
                  onPress={() => {
                    setAppliedVoucher(voucher);
                    setShowVoucherModal(false);
                  }}
                  style={[
                    styles.voucherCard,
                    appliedVoucher?.id === voucher.id &&
                      styles.voucherCardSelected,
                  ]}
                >
                  <View style={styles.voucherLeft}>
                    <View style={styles.voucherCodeContainer}>
                      <Ionicons name="ticket" size={20} color="#FF6B35" />
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
                  </View>

                  <View style={styles.voucherRight}>
                    <View style={styles.discountCircle}>
                      <Text style={styles.discountPercent}>
                        {voucher.discount}%
                      </Text>
                      <Text style={styles.discountOff}>OFF</Text>
                    </View>
                    {appliedVoucher?.id === voucher.id && (
                      <Ionicons
                        name="checkmark-circle"
                        size={24}
                        color="#27AE60"
                      />
                    )}
                  </View>
                </TouchableOpacity>
              ))}

              {appliedVoucher && (
                <TouchableOpacity
                  onPress={() => {
                    setAppliedVoucher(null);
                    setShowVoucherModal(false);
                  }}
                  style={styles.removeVoucherButton}
                >
                  <Ionicons name="close-circle" size={20} color="#FF6B35" />
                  <Text style={styles.removeVoucherText}>Remove Voucher</Text>
                </TouchableOpacity>
              )}
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
    backgroundColor: '#FF6B35',
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
    backgroundColor: '#FF6B35',
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
    color: '#FF6B35',
  },
  originalPrice: {
    fontSize: moderateScale(12),
    color: '#999',
    textDecorationLine: 'line-through',
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
    color: '#FF6B35',
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
    color: '#FF6B35',
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
    color: '#FF6B35',
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
    backgroundColor: '#FF6B35',
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
    borderColor: '#FF6B35',
    borderRadius: moderateScale(8),
    paddingVertical: verticalScale(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueShoppingText: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: '#FF6B35',
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
    borderColor: '#FF6B35',
    backgroundColor: '#FFF5F0',
  },
  addressCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(8),
  },
  addressType: {
    backgroundColor: '#FF6B35',
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
    color: '#FF6B35',
  },
  addNewAddressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#FF6B35',
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(16),
    marginBottom: verticalScale(16),
  },
  addNewAddressText: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: '#FF6B35',
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
  saveAddressButton: {
    backgroundColor: '#FF6B35',
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
    borderColor: '#FF6B35',
    borderRadius: moderateScale(8),
    paddingVertical: verticalScale(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: '#FF6B35',
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
    borderColor: '#FF6B35',
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
    color: '#FF6B35',
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
    backgroundColor: '#FF6B35',
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
    borderColor: '#FF6B35',
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(12),
    marginTop: verticalScale(16),
  },
  removeVoucherText: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: '#FF6B35',
    marginLeft: scale(8),
  },
});
