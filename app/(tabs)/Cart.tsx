'use client';

import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { s, vs } from 'react-native-size-matters';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '../stores/useAuthStore';

const BASE_URL = process.env.EXPO_PUBLIC_APP_BASE_URL;
const baseUrl2 = BASE_URL;

const storage = {
  set: (key: string, value: any) => {
    AsyncStorage.setItem(key, JSON.stringify(value)).catch((err) =>
      console.error(`Error setting ${key} in storage:`, err),
    );
  },
  get: async (key: string) => {
    try {
      const val = await AsyncStorage.getItem(key);
      return val ? JSON.parse(val) : null;
    } catch (err) {
      console.error(`Error getting ${key} from storage:`, err);
      return null;
    }
  },
};

const confetti = (options?: any) => {
  console.log('Confetti effect triggered:', options);
};

interface CartItem {
  id: number;
  email: string;
  product_id: string;
  product_name: string;
  product_image: string;
  product_price: string;
  product_cod: string;
  product_OriginalPrice: string;
  product_quantity: number;
  stock_available: number;
  product_category: string;
  product_discount: string;
  product_store_name: string;
  product_store_id: number;
  product_selected_color: string;
  product_selected_size: string;
  created_at?: string;
  selected?: boolean;
}

interface UserVoucher {
  voucher_id: number;
  store_id?: number;
  user_email?: string;
  voucher_code: string;
  voucherDescription: string;
  voucherDiscountType: 'percentage' | 'flat';
  voucherDiscountRate: string;
  voucherDiscountPrice: string;
  voucherExpiryDate: string;
  voucher_minimumSpend: string;
  voucherStoreID?: number;
  voucher_type: string;
}

const isMeaningfulFeatureValue = (
  value: string | null | undefined,
): boolean => {
  const normalized = String(value || '').trim();
  if (!normalized) return false;
  return !/^default(?:\s+(?:color|size))?$/i.test(normalized);
};

const Cart = () => {
  const [cartData, setCartData] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userVouchers, setUserVouchers] = useState<UserVoucher[]>([]);
  const [filteredVouchers, setFilteredVouchers] = useState<UserVoucher[]>([]);
  const [selectedVouchers, setSelectedVouchers] = useState<UserVoucher[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteType, setDeleteType] = useState<'single' | 'all' | null>(null);
  const [itemToDelete, setItemToDelete] = useState<CartItem | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const router = useRouter();
  const { user, setCartCount } = useAuthStore();

  const getUserEmail = () => user?.email || '';

  // Fetch cart from API
  const fetchCart = useCallback(async () => {
    const email = user?.email;
    if (!email) {
      setLoading(false);
      setCartData([]);
      setCartCount(0);
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/api/get_cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_email: email }),
      });

      const data = await res.json();

      if (data.cart_items && Array.isArray(data.cart_items)) {
        const items = data.cart_items.map((item: CartItem) => ({
          ...item,
          selected: true,
        }));
        setCartData(items);
        setCartCount(items.length);
      } else {
        setCartData([]);
        setCartCount(0);
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
      setCartData([]);
      setCartCount(0);
    } finally {
      setLoading(false);
    }
  }, [user?.email, setCartCount]);

  const fetchUserVouchers = useCallback(async () => {
    const email = user?.email;
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
  }, [user?.email]);

  // Refetch cart when screen is focused (real-time update)
  useFocusEffect(
    useCallback(() => {
      fetchCart();
      fetchUserVouchers();
    }, [fetchCart, fetchUserVouchers]),
  );

  /* ---------- GROUP BY STORE ---------- */
  const groupedByStore = useMemo(() => {
    return cartData.reduce<Record<string, CartItem[]>>((acc, item) => {
      const storeName = item.product_store_name?.trim() || 'Unknown Store';

      if (!acc[storeName]) acc[storeName] = [];
      acc[storeName].push(item);

      return acc;
    }, {});
  }, [cartData]);

  // Update cart item quantity
  // TODO: Replace with real API when ready: POST /api/update_cart { cart_id, quantity }
  const handleQuantityChange = async (item: CartItem, change: number) => {
    const newQty = Math.max(
      1,
      Math.min(item.stock_available, item.product_quantity + change),
    );

    // Update local state
    setCartData((prev) => {
      const updated = prev.map((i) =>
        i.id === item.id ? { ...i, product_quantity: newQty } : i,
      );
      storage.set('cartItems', updated);
      return updated;
    });

    // TODO: Uncomment when API is ready
    // try {
    //   await fetch(`${baseUrl2}/api/update_cart`, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ cart_id: item.id, quantity: newQty }),
    //   });
    // } catch (err) {
    //   console.error('Error updating quantity:', err);
    //   fetchCart();
    // }
  };

  // Show confirmation for removing single item
  const confirmRemoveItem = (item: CartItem) => {
    setItemToDelete(item);
    setDeleteType('single');
    setShowDeleteConfirm(true);
  };

  // Show confirmation for deleting all items
  const confirmDeleteAll = () => {
    if (cartData.length === 0) return;
    setDeleteType('all');
    setShowDeleteConfirm(true);
  };

  // Remove cart item
  const handleRemoveItem = async (item: CartItem) => {
    // Update local state
    setCartData((prev) => {
      const updated = prev.filter((i) => i.id !== item.id);
      storage.set('cartItems', updated);
      storage.set('cartCount', updated.length);
      setCartCount(updated.length); // Update context
      return updated;
    });

    try {
      await fetch(`${baseUrl2}/api/delete_cart_item`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart_item_id: item.id }),
      });
    } catch (err) {
      console.error('Error removing item:', err);
      fetchCart();
    }
  };

  // Delete all cart items
  const handleDeleteAll = async () => {
    if (cartData.length === 0) return;

    // Clear local state
    setCartData([]);
    storage.set('cartItems', []);
    storage.set('cartCount', 0);
    storage.set('cartItemsToCheckout', []);
    setCartCount(0); // Update context

    try {
      await fetch(`${baseUrl2}/api/delete_cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_email: getUserEmail() }),
      });
    } catch (err) {
      console.error('Error clearing cart:', err);
      fetchCart();
    }
  };

  // Handle confirm delete
  const handleConfirmDelete = () => {
    if (deleteType === 'single' && itemToDelete) {
      handleRemoveItem(itemToDelete);
    } else if (deleteType === 'all') {
      handleDeleteAll();
    }
    setShowDeleteConfirm(false);
    setItemToDelete(null);
  };

  // Handle cancel delete
  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setItemToDelete(null);
  };

  // Toggle item selection
  const toggleSelectItem = (id: number) => {
    setCartData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item,
      ),
    );
  };

  // Toggle select all
  const toggleSelectAll = (checked: boolean) => {
    setCartData((prev) => prev.map((item) => ({ ...item, selected: checked })));
  };

  // Calculate totals
  const selectedItems = useMemo(
    () => cartData.filter((item) => item.selected),
    [cartData],
  );

  const subtotal = useMemo(
    () =>
      selectedItems.reduce(
        (sum, item) =>
          sum + parseFloat(item.product_price) * item.product_quantity,
        0,
      ),
    [selectedItems],
  );

  const shippingFee = useMemo(() => {
    // Group items by store and find max COD per store
    const storeMaxCod: Record<number, number> = {};
    selectedItems.forEach((item) => {
      const cod = parseFloat(item.product_cod || '0');
      const storeId = item.product_store_id;
      if (!storeMaxCod[storeId]) {
        storeMaxCod[storeId] = cod;
      } else {
        storeMaxCod[storeId] = Math.max(storeMaxCod[storeId], cod);
      }
    });
    // Sum the highest COD from each store
    return Object.values(storeMaxCod).reduce((sum, cod) => sum + cod, 0);
  }, [selectedItems]);

  const voucherDiscount = useMemo(() => {
    let discount = 0;
    for (const voucher of selectedVouchers) {
      if (voucher.voucher_type === 'shipping') {
        discount += shippingFee;
      } else if (voucher.voucherDiscountType === 'percentage') {
        discount += subtotal * (parseFloat(voucher.voucherDiscountRate) / 100);
      } else {
        discount += parseFloat(voucher.voucherDiscountPrice);
      }
    }
    return Math.min(discount, subtotal + shippingFee);
  }, [selectedVouchers, subtotal, shippingFee]);

  const total = subtotal + shippingFee - voucherDiscount;

  const getVoucherProductIds = (voucher: UserVoucher): number[] => {
    const rawProductIds = (voucher as UserVoucher & { product_ids?: unknown })
      .product_ids;

    if (Array.isArray(rawProductIds)) {
      return rawProductIds
        .map((id) => Number(id))
        .filter((id) => Number.isFinite(id));
    }

    return [];
  };

  const getVoucherGroup = (voucher: UserVoucher): 'shipping' | 'product' => {
    return voucher.voucher_type === 'shipping' ? 'shipping' : 'product';
  };

  const applyVoucher = (voucher: UserVoucher) => {
    const isAlreadySelected = selectedVouchers.some(
      (v) => v.voucher_id === voucher.voucher_id,
    );
    if (isAlreadySelected) {
      // Deselect
      setSelectedVouchers((prev) =>
        prev.filter((v) => v.voucher_id !== voucher.voucher_id),
      );
      return;
    }
    const minSpend = parseFloat(voucher.voucher_minimumSpend);
    if (subtotal < minSpend) {
      alert(
        `Minimum spend of Rs. ${minSpend.toLocaleString()} is required to use this voucher.`,
      );
      return;
    }

    const nextGroup = getVoucherGroup(voucher);
    // Keep only one voucher per group (shipping or product-like)
    setSelectedVouchers((prev) => [
      ...prev.filter((v) => getVoucherGroup(v) !== nextGroup),
      voucher,
    ]);
  };

  // Handle checkout
  const handleCheckout = async () => {
    if (selectedItems.length === 0) return;

    setCheckoutLoading(true);
    storage.set('cartItemsToCheckout', selectedItems);
    storage.set('finalTotal', total.toFixed(2));

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#FACC15', '#000000', '#FF0000'],
      });
      router.push({
        pathname: '/screens/checkout_screen',
        params: { cartItems: JSON.stringify(selectedItems) },
      });
    } finally {
      setCheckoutLoading(false);
    }
  };

  // Effects
  useEffect(() => {
    fetchCart();
    fetchUserVouchers();
  }, [fetchCart, fetchUserVouchers]);

  const storeIds = useMemo(() => {
    return Array.from(
      new Set(
        cartData
          .map((item) => item.product_store_id)
          .filter((id): id is number => typeof id === 'number'),
      ),
    );
  }, [cartData]);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const cartProductIds = new Set(
      selectedItems
        .map((item) => Number(item.product_id || item.id))
        .filter((id) => Number.isFinite(id)),
    );

    const filtered = userVouchers.filter((v) => {
      if (v.voucherExpiryDate < today) return false;

      // Admin vouchers are cross-store and use product targeting rules
      if (v.voucher_type === 'admin_all') {
        return cartProductIds.size > 0;
      }

      if (v.voucher_type === 'admin_selected') {
        const targetProductIds = getVoucherProductIds(v);
        return targetProductIds.some((id) => cartProductIds.has(id));
      }

      // Seller vouchers remain store-scoped
      return (
        typeof v.voucherStoreID === 'number' &&
        storeIds.includes(v.voucherStoreID)
      );
    });

    setFilteredVouchers(filtered);

    // Remove any selected vouchers no longer in the filtered list
    setSelectedVouchers((prev) =>
      prev.filter((sv) => filtered.some((v) => v.voucher_id === sv.voucher_id)),
    );
  }, [userVouchers, storeIds, selectedItems]);

  const CheckBox = ({ checked = false }) => (
    <View
      style={{
        width: s(16),
        height: s(16),
        borderRadius: s(4),
        borderWidth: 1.5,
        backgroundColor: checked ? '#f97316' : 'transparent',
        borderColor: checked ? '#f97316' : '#d1d5db',
      }}
    />
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100" edges={['top']}>
      {/* ---------- HEADER ---------- */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#f97316',
          paddingHorizontal: s(12),
          paddingVertical: vs(8),
        }}
      >
        <TouchableOpacity>
          <Ionicons name="scan" size={s(22)} color="#333" />
        </TouchableOpacity>

        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            backgroundColor: '#fff',
            borderRadius: s(8),
            marginHorizontal: s(12),
            paddingHorizontal: s(12),
            alignItems: 'center',
          }}
        >
          <TextInput
            placeholder="Storevia"
            placeholderTextColor="#aaa"
            style={{ flex: 1, fontSize: s(14), paddingVertical: vs(8) }}
          />
          <TouchableOpacity
            style={{
              backgroundColor: '#f97316',
              paddingHorizontal: s(12),
              paddingVertical: vs(6),
              borderRadius: s(6),
            }}
          >
            <Text style={{ color: '#fff', fontSize: s(12), fontWeight: '600' }}>
              Search
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: '#22c55e',
            paddingHorizontal: s(12),
            paddingVertical: vs(6),
            borderRadius: s(6),
          }}
        >
          <Text style={{ color: '#fff', fontSize: s(12), fontWeight: '600' }}>
            Pay
          </Text>
        </TouchableOpacity>
      </View>

      {/* ---------- CONTENT ---------- */}
      {!loading && cartData.length === 0 ? (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: s(32),
          }}
        >
          <View
            style={{
              width: s(100),
              height: s(100),
              borderRadius: s(50),
              backgroundColor: '#fff7ed',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: vs(20),
            }}
          >
            <Ionicons name="cart-outline" size={s(52)} color="#f97316" />
          </View>
          <Text
            style={{
              fontSize: s(20),
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: vs(8),
            }}
          >
            {user ? 'Your cart is empty' : 'Login to view your cart'}
          </Text>
          <Text
            style={{
              fontSize: s(13),
              color: '#6b7280',
              textAlign: 'center',
              marginBottom: vs(28),
              lineHeight: s(20),
            }}
          >
            {user
              ? "Looks like you haven't added anything yet. Start exploring and find something you love!"
              : 'Please login first to view your cart and start shopping with Storevia!'}
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: '#f97316',
              paddingHorizontal: s(32),
              paddingVertical: vs(12),
              borderRadius: s(8),
            }}
            onPress={() =>
              user
                ? router.push('/(tabs)/Home')
                : router.push('/(tabs)/Account')
            }
          >
            <Text style={{ color: '#fff', fontSize: s(15), fontWeight: '700' }}>
              {user ? 'Start Shopping' : 'Login First'}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: vs(120) }}
          showsVerticalScrollIndicator={false}
        >
          {/* TITLE */}
          <View
            style={{
              backgroundColor: '#fff',
              paddingHorizontal: s(16),
              paddingVertical: vs(12),
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text
              style={{ fontSize: s(20), fontWeight: 'bold', color: '#1f2937' }}
            >
              My Cart
            </Text>
            {cartData.length > 0 && (
              <TouchableOpacity onPress={confirmDeleteAll}>
                <Text
                  style={{
                    color: '#ef4444',
                    fontSize: s(13),
                    fontWeight: '600',
                  }}
                >
                  Clear All
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* STORES */}
          {Object.entries(groupedByStore).map(([storeName, items]) => (
            <View
              key={storeName}
              style={{ marginTop: vs(8), backgroundColor: '#fff' }}
            >
              {/* STORE HEADER */}
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: s(16),
                  paddingVertical: vs(12),
                  borderBottomWidth: 1,
                  borderBottomColor: '#e5e7eb',
                }}
                onPress={() => {
                  const allSelected = items.every((item) => item.selected);
                  setCartData((prev) =>
                    prev.map((cartItem) =>
                      items.some((i) => i.id === cartItem.id)
                        ? { ...cartItem, selected: !allSelected }
                        : cartItem,
                    ),
                  );
                }}
              >
                <CheckBox checked={items.every((item) => item.selected)} />
                <Text
                  style={{
                    marginLeft: s(8),
                    fontSize: s(13),
                    fontWeight: '600',
                    color: '#1f2937',
                  }}
                >
                  🏪 {storeName}
                </Text>
              </TouchableOpacity>

              {/* STORE ITEMS */}
              {items.map((item) => (
                <View
                  key={item.id}
                  style={{
                    flexDirection: 'row',
                    paddingHorizontal: s(12),
                    paddingVertical: vs(12),
                    alignItems: 'center',
                  }}
                >
                  <TouchableOpacity onPress={() => toggleSelectItem(item.id)}>
                    <CheckBox checked={item.selected ?? false} />
                  </TouchableOpacity>

                  <Image
                    source={{ uri: item.product_image }}
                    style={{
                      width: s(64),
                      height: s(64),
                      borderRadius: s(8),
                      marginHorizontal: s(10),
                    }}
                  />

                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: s(12),
                        fontWeight: '500',
                        color: '#1f2937',
                      }}
                      numberOfLines={2}
                    >
                      {item.product_name}
                    </Text>

                    <Text
                      style={{
                        fontSize: s(10),
                        color: '#6b7280',
                        marginTop: vs(4),
                      }}
                    >
                      {item.product_category}
                    </Text>

                    {(isMeaningfulFeatureValue(item.product_selected_color) ||
                      isMeaningfulFeatureValue(item.product_selected_size)) && (
                      <Text
                        style={{
                          fontSize: s(10),
                          color: '#6b7280',
                          marginTop: vs(2),
                        }}
                        numberOfLines={1}
                      >
                        {[
                          isMeaningfulFeatureValue(item.product_selected_color)
                            ? `Color: ${item.product_selected_color}`
                            : null,
                          isMeaningfulFeatureValue(item.product_selected_size)
                            ? `Size: ${item.product_selected_size}`
                            : null,
                        ]
                          .filter(Boolean)
                          .join(', ')}
                      </Text>
                    )}

                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: vs(4),
                      }}
                    >
                      <Text
                        style={{
                          color: '#f97316',
                          fontWeight: 'bold',
                          fontSize: s(12),
                          marginRight: s(8),
                        }}
                      >
                        Rs. {item.product_price}
                      </Text>
                      <Text
                        style={{
                          color: '#9ca3af',
                          textDecorationLine: 'line-through',
                          fontSize: s(10),
                        }}
                      >
                        Rs. {item.product_OriginalPrice}
                      </Text>
                    </View>

                    <View
                      style={{
                        backgroundColor: '#fed7aa',
                        paddingHorizontal: s(8),
                        paddingVertical: vs(2),
                        borderRadius: s(4),
                        marginTop: vs(4),
                        alignSelf: 'flex-start',
                      }}
                    >
                      <Text style={{ fontSize: s(10), color: '#b45309' }}>
                        {item.product_discount}%
                      </Text>
                    </View>
                  </View>

                  {/* QTY */}
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderWidth: 1,
                      borderColor: '#d1d5db',
                      borderRadius: s(6),
                      marginLeft: s(8),
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        width: s(20),
                        height: s(20),
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      onPress={() => handleQuantityChange(item, -1)}
                    >
                      <Text style={{ fontSize: s(14) }}>−</Text>
                    </TouchableOpacity>

                    <Text
                      style={{
                        paddingHorizontal: s(8),
                        alignSelf: 'center',
                        fontSize: s(12),
                      }}
                    >
                      {item.product_quantity}
                    </Text>

                    <TouchableOpacity
                      style={{
                        width: s(20),
                        height: s(20),
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      onPress={() => handleQuantityChange(item, 1)}
                    >
                      <Text style={{ fontSize: s(14) }}>+</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Delete button */}
                  <TouchableOpacity
                    onPress={() => confirmRemoveItem(item)}
                    style={{ marginLeft: s(10) }}
                  >
                    <Ionicons
                      name="trash-outline"
                      size={s(20)}
                      color="#ef4444"
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ))}

          {/* Vouchers Section */}
          {filteredVouchers.length > 0 && (
            <View
              style={{
                backgroundColor: '#fff',
                marginTop: vs(8),
                padding: s(16),
              }}
            >
              <Text
                style={{
                  fontSize: s(14),
                  fontWeight: 'bold',
                  color: '#1f2937',
                  marginBottom: vs(8),
                }}
              >
                Available Vouchers
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {filteredVouchers.map((voucher) => {
                  const isSelected = selectedVouchers.some(
                    (v) => v.voucher_id === voucher.voucher_id,
                  );
                  return (
                    <TouchableOpacity
                      key={voucher.voucher_id}
                      onPress={() => applyVoucher(voucher)}
                      style={{
                        backgroundColor: isSelected ? '#ffedd5' : '#f3f4f6',
                        borderColor: isSelected ? '#f97316' : '#e5e7eb',
                        borderWidth: 1,
                        borderRadius: s(8),
                        padding: s(10),
                        marginRight: s(10),
                        minWidth: s(120),
                      }}
                    >
                      <Text
                        style={{
                          fontSize: s(12),
                          fontWeight: 'bold',
                          color: isSelected ? '#ea580c' : '#374151',
                        }}
                      >
                        {voucher.voucher_code}
                      </Text>
                      <Text
                        style={{
                          fontSize: s(10),
                          color: '#6b7280',
                          marginTop: vs(2),
                        }}
                        numberOfLines={1}
                      >
                        {voucher.voucherDescription}
                      </Text>
                      <Text
                        style={{
                          fontSize: s(9),
                          color: '#9ca3af',
                          marginTop: vs(2),
                        }}
                      >
                        Min: Rs. {voucher.voucher_minimumSpend}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          )}
        </ScrollView>
      )}

      {/* ---------- CHECKOUT BAR ---------- */}
      {cartData.length === 0 ? null : (
        <View
          style={{
            backgroundColor: '#fff',
            paddingHorizontal: s(16),
            paddingVertical: vs(12),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTopWidth: 1,
            borderTopColor: '#e5e7eb',
          }}
        >
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center' }}
            onPress={() =>
              toggleSelectAll(
                !selectedItems.length || selectedItems.length < cartData.length,
              )
            }
          >
            <CheckBox checked={selectedItems.length === cartData.length} />
            <Text style={{ marginLeft: s(6), fontSize: s(12) }}>All</Text>
          </TouchableOpacity>

          <View style={{ flex: 1, marginRight: s(10), marginLeft: s(12) }}>
            <Text style={{ fontSize: s(11), color: '#1f2937' }}>
              Subtotal:{' '}
              <Text style={{ fontWeight: '600' }}>
                Rs. {subtotal.toFixed(2)}
              </Text>
            </Text>
            {shippingFee > 0 && (
              <Text style={{ fontSize: s(10), color: '#6b7280' }}>
                Shipping:{' '}
                <Text style={{ color: '#ef4444' }}>
                  Rs. {shippingFee.toFixed(2)}
                </Text>
              </Text>
            )}
            {voucherDiscount > 0 && (
              <Text style={{ fontSize: s(10), color: '#10b981' }}>
                Discount: <Text>-Rs. {voucherDiscount.toFixed(2)}</Text>
              </Text>
            )}
            <Text
              style={{
                fontSize: s(12),
                color: '#1f2937',
                fontWeight: 'bold',
                marginTop: vs(2),
              }}
            >
              Total:{' '}
              <Text style={{ color: '#f97316' }}>Rs. {total.toFixed(2)}</Text>
            </Text>
          </View>

          <TouchableOpacity
            style={{
              backgroundColor: '#f97316',
              paddingHorizontal: s(14),
              paddingVertical: vs(7),
              borderRadius: s(6),
            }}
            onPress={handleCheckout}
            disabled={checkoutLoading}
          >
            <Text style={{ color: '#fff', fontWeight: '600', fontSize: s(12) }}>
              {checkoutLoading ? '...' : `Checkout (${selectedItems.length})`}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ---------- DELETE CONFIRMATION MODAL ---------- */}
      <Modal
        visible={showDeleteConfirm}
        transparent
        animationType="fade"
        onRequestClose={handleCancelDelete}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: s(20),
          }}
        >
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: s(12),
              padding: s(20),
              width: '100%',
              maxHeight: vs(200),
              alignItems: 'center',
            }}
          >
            <Ionicons name="warning-outline" size={s(40)} color="#ef4444" />
            <Text
              style={{
                fontSize: s(16),
                fontWeight: 'bold',
                color: '#1f2937',
                marginTop: vs(10),
                textAlign: 'center',
              }}
            >
              {deleteType === 'all' ? 'Clear Cart?' : 'Remove Item?'}
            </Text>
            <Text
              style={{
                fontSize: s(13),
                color: '#6b7280',
                marginTop: vs(6),
                textAlign: 'center',
                marginBottom: vs(20),
              }}
            >
              {deleteType === 'all'
                ? 'Are you sure you want to remove all items from your cart?'
                : 'Are you sure you want to remove this item from your cart?'}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'space-between',
              }}
            >
              <TouchableOpacity
                onPress={handleCancelDelete}
                style={{
                  flex: 1,
                  paddingVertical: vs(10),
                  marginRight: s(10),
                  borderRadius: s(8),
                  backgroundColor: '#f3f4f6',
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: '#374151', fontWeight: '600' }}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleConfirmDelete}
                style={{
                  flex: 1,
                  paddingVertical: vs(10),
                  borderRadius: s(8),
                  backgroundColor: '#ef4444',
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: '#fff', fontWeight: '600' }}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Cart;
