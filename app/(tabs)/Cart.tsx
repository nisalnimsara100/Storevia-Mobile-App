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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { s, vs } from 'react-native-size-matters';
import { useAuthStore } from '../stores/useAuthStore';

const BASE_URL = process.env.EXPO_PUBLIC_APP_BASE_URL;

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

const isMeaningfulFeatureValue = (value: string | null | undefined): boolean => {
  const normalized = String(value || '').trim();
  if (!normalized) return false;
  return !/^default(?:\s+(?:color|size))?$/i.test(normalized);
};

const Cart = () => {
  const [selectAll, setSelectAll] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuthStore();


  // Fetch cart from API
  const fetchCart = async () => {
    console.log('Fetching cart for user from zustand:', user?.email);
    const email = user?.email;
    if (!email) {
      return;
    }
    console.log('Fetching cart for email:', email);

    try {
      const res = await fetch(`${BASE_URL}/api/get_cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_email: email }),
      });

      const data = await res.json();
      console.log('Cart data:', data);

      if (data.cart_items && Array.isArray(data.cart_items)) {
        const items = data.cart_items.map((item: CartItem) => ({
          ...item,
          selected: true,
        }));
        setCartItems(items);
      } else {
        setCartItems([]);
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch cart on component mount
  useEffect(() => {
    fetchCart();
  }, []);

  // Refetch cart when screen is focused (real-time update)
  useFocusEffect(
    useCallback(() => {
      fetchCart();
    }, []),
  );

  /* ---------- GROUP BY STORE ---------- */
  const groupedByStore = useMemo(() => {
    return cartItems.reduce<Record<string, CartItem[]>>((acc, item) => {
      const storeName = item.product_store_name?.trim() || 'Unknown Store';

      if (!acc[storeName]) acc[storeName] = [];
      acc[storeName].push(item);

      return acc;
    }, {});
  }, [cartItems]);

  // Calculate totals
  const { subtotal, selectedCount } = useMemo(() => {
    const selected = cartItems.filter((item) => item.selected);
    const total = selected.reduce((sum, item) => {
      return sum + parseFloat(item.product_price) * item.product_quantity;
    }, 0);
    return { subtotal: total.toFixed(2), selectedCount: selected.length };
  }, [cartItems]);

  // Update selectAll state when cart items change
  useEffect(() => {
    if (cartItems.length > 0) {
      setSelectAll(cartItems.every((item) => item.selected));
    } else {
      setSelectAll(false);
    }
  }, [cartItems]);

  const updateQty = (id: number, change: number) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              product_quantity: Math.max(1, item.product_quantity + change),
            }
          : item,
      ),
    );
  };

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

  // Toggle select all items
  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setCartItems((items) =>
      items.map((item) => ({ ...item, selected: newSelectAll })),
    );
  };

  // Toggle select single item
  const handleSelectItem = (id: number) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item,
      ),
    );
  };

  // Handle checkout navigation
  const handleCheckout = () => {
    const selectedItems = cartItems.filter((item) => item.selected);
    if (selectedItems.length === 0) {
      alert('Please select at least one item');
      return;
    }
    router.push({
      pathname: '/screens/checkout_screen',
      params: { cartItems: JSON.stringify(selectedItems) },
    });
  };

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
      {!loading && cartItems.length === 0 ? (
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
            Your cart is empty
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
            Looks like you haven't added anything yet. Start exploring and find
            something you love!
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: '#f97316',
              paddingHorizontal: s(32),
              paddingVertical: vs(12),
              borderRadius: s(8),
            }}
            onPress={() => router.push('/(tabs)/Home')}
          >
            <Text
              style={{ color: '#fff', fontSize: s(15), fontWeight: '700' }}
            >
              Start Shopping
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
          }}
        >
          <Text
            style={{ fontSize: s(20), fontWeight: 'bold', color: '#1f2937' }}
          >
            My Cart
          </Text>
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
                setCartItems((cartItems) =>
                  cartItems.map((cartItem) =>
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
                <TouchableOpacity onPress={() => handleSelectItem(item.id)}>
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
                    onPress={() => updateQty(item.id, -1)}
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
                    onPress={() => updateQty(item.id, 1)}
                  >
                    <Text style={{ fontSize: s(14) }}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
      )}

      {/* ---------- CHECKOUT BAR ---------- */}
      {cartItems.length === 0 ? null : (
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
          onPress={handleSelectAll}
        >
          <CheckBox checked={selectAll} />
          <Text style={{ marginLeft: s(6), fontSize: s(12) }}>All</Text>
        </TouchableOpacity>

        <View>
          <Text style={{ fontSize: s(13), color: '#1f2937' }}>
            Subtotal:{' '}
            <Text style={{ color: '#f97316', fontWeight: 'bold' }}>
              Rs. {subtotal}
            </Text>
          </Text>
          <Text style={{ fontSize: s(11), color: '#6b7280' }}>
            Shipping Fee:{' '}
            <Text style={{ color: '#f97316', fontWeight: 'bold' }}>Rs. 0</Text>
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
        >
          <Text style={{ color: '#fff', fontWeight: '600', fontSize: s(12) }}>
            Checkout ({selectedCount})
          </Text>
        </TouchableOpacity>
      </View>
      )}
    </SafeAreaView>
  );
};

export default Cart;
