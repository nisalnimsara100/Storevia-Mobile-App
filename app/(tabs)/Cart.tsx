"use client"

import React, { useState, useMemo } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"

type CartItem = {
  id: number
  store: string
  title: string
  brand: string
  family: string
  price: number
  originalPrice: number
  discount: string
  quantity: number
  image: string
}

const Cart = () => {
  const [selectAll, setSelectAll] = useState(false)

  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      store: "FashionApple",
      title: "2 Layers Wooden Jewelry Box with Lock...",
      brand: "No Brand",
      family: "Color Family:1.8CM",
      price: 505,
      originalPrice: 1010,
      discount: "Buy 2 get 2% off",
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200",
    },
    {
      id: 2,
      store: "FashionApple",
      title: "Wooden Ring Holder Box...",
      brand: "No Brand",
      family: "Color Family:Brown",
      price: 320,
      originalPrice: 500,
      discount: "10% off",
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=200",
    },
    {
      id: 3,
      store: "TechWorld",
      title: "Wireless Bluetooth Headset...",
      brand: "Sony",
      family: "Color: Black",
      price: 4500,
      originalPrice: 6500,
      discount: "30% off",
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1518443895471-1c98f7f6a0c2?w=200",
    },
  ])

  /* ---------- GROUP BY STORE ---------- */
const groupedByStore = useMemo(() => {
  return cartItems.reduce<Record<string, CartItem[]>>((acc, item) => {
    const storeName = item.store?.trim() || "Unknown Store"

    if (!acc[storeName]) acc[storeName] = []
    acc[storeName].push(item)

    return acc
  }, {})
}, [cartItems])


  const updateQty = (id: number, change: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    )
  }

  const CheckBox = ({ checked = false }) => (
    <View
      className={`w-5 h-5 rounded border-2 ${
        checked ? "bg-orange-500 border-orange-500" : "border-gray-300"
      }`}
    />
  )

  return (
    <SafeAreaView className="flex-1 bg-gray-100" edges={["top", "bottom"]}>
      {/* ---------- HEADER ---------- */}
      <View className="flex-row items-center bg-orange-500 px-3 py-2">
        <TouchableOpacity>
          <Ionicons name="scan" size={22} color="#333" />
        </TouchableOpacity>

        <View className="flex-1 flex-row bg-white rounded-lg mx-3 px-3 items-center">
          <TextInput
            placeholder="Storevia"
            placeholderTextColor="#aaa"
            className="flex-1 text-sm py-2"
          />
          <TouchableOpacity className="bg-orange-500 px-3 py-1.5 rounded-md">
            <Text className="text-white text-xs font-semibold">Search</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity className="bg-green-500 px-3 py-1.5 rounded-md">
          <Text className="text-white text-xs font-semibold">Pay</Text>
        </TouchableOpacity>
      </View>

      {/* ---------- CONTENT ---------- */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* TITLE */}
        <View className="bg-white px-4 py-3">
          <Text className="text-xl font-bold text-gray-800">My Cart</Text>
        </View>

        {/* STORES */}
        {Object.entries(groupedByStore).map(([storeName, items]) => (
          <View key={storeName} className="mt-2 bg-white">
            {/* STORE HEADER */}
            <View className="flex-row items-center px-4 py-3 border-b border-gray-200">
              <CheckBox checked={selectAll} />
              <Text className="ml-2 text-sm font-semibold text-gray-800">
                🏪 {storeName}
              </Text>
            </View>

            {/* STORE ITEMS */}
            {items.map(item => (
              <View
                key={item.id}
                className="flex-row px-3 py-3 items-center"
              >
                <CheckBox checked={selectAll} />

                <Image
                  source={{ uri: item.image }}
                  className="w-20 h-20 rounded-lg mx-3"
                />

                <View className="flex-1">
                  <Text
                    className="text-sm font-medium text-gray-800"
                    numberOfLines={2}
                  >
                    {item.title}
                  </Text>

                  <Text className="text-xs text-gray-500 mt-1">
                    {item.brand} • {item.family}
                  </Text>

                  <View className="flex-row items-center mt-1">
                    <Text className="text-orange-500 font-bold text-base mr-2">
                      Rs. {item.price}
                    </Text>
                    <Text className="text-gray-400 line-through text-xs">
                      Rs. {item.originalPrice}
                    </Text>
                  </View>

                  <View className="bg-orange-100 px-2 py-0.5 rounded mt-1 self-start">
                    <Text className="text-[10px] text-orange-700">
                      {item.discount}
                    </Text>
                  </View>
                </View>

                {/* QTY */}
                <View className="flex-row border border-gray-300 rounded-md ml-2">
                  <TouchableOpacity
                    className="w-8 h-8 items-center justify-center"
                    onPress={() => updateQty(item.id, -1)}
                  >
                    <Text className="text-lg">−</Text>
                  </TouchableOpacity>

                  <Text className="px-3 self-center">
                    {item.quantity}
                  </Text>

                  <TouchableOpacity
                    className="w-8 h-8 items-center justify-center"
                    onPress={() => updateQty(item.id, 1)}
                  >
                    <Text className="text-lg">+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>

      {/* ---------- CHECKOUT BAR ---------- */}
      <View className="bg-white px-4 py-3 flex-row items-center justify-between border-t border-gray-200">
        <TouchableOpacity
          className="flex-row items-center"
          onPress={() => setSelectAll(!selectAll)}
        >
          <CheckBox checked={selectAll} />
          <Text className="ml-2 text-sm">All</Text>
        </TouchableOpacity>

        <View>
          <Text className="text-orange-500 font-bold">
            Subtotal: Rs. 847
          </Text>
          <Text className="text-xs text-gray-500">
            Shipping: Rs. 590
          </Text>
        </View>

        <TouchableOpacity className="bg-orange-500 px-4 py-2 rounded-md">
          <Text className="text-white font-semibold text-sm">
            Checkout (2)
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default Cart
