"use client"

import { StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView, Image } from "react-native"
import { useState } from "react"
import { Ionicons } from "@expo/vector-icons"
import * as React from "react"

const Cart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      store: "FashionApple",
      title: " 2 Layers Wooden Jewelry Box with Lock...",
      brand: "No Brand",
      family: "Color Family:1.8CM",
      price: 505,
      originalPrice: 1010,
      discount: "Buy 2 get 2% off",
      quantity: 1,
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=200&fit=crop",
    },
  ])
   

  const [unavailableItems] = useState([
    {
      id: 1,
      title: "36 Pairs/batch cute Mini Earrings Randomly Shipped Cute Snowflake...",
      brand: "No Brand",
      family: "Metal Color:A",
      price: 1114,
      originalPrice: 4456,
      image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab609f8?w=200&h=200&fit=crop",
    },
    {
      id: 2,
      title: "Lenuo Sheepskin Leather Shockproof Case For Samsung Galaxy...",
      brand: "LENUO",
      family: "Color Family:Blue, Model:S...",
      price: 1079,
      originalPrice: 1439,
      image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=200&h=200&fit=crop",
    },
  ])

  const [recommendedProducts] = useState([
    {
      id: 1,
      title: "Portable Air Cooler...",
      price: 1880,
      discount: "-37%",
      rating: 4.8,
      reviews: 109,
      sold: "709 sold",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop",
      badges: ["FREE DELIVERY"],
    },
    {
      id: 2,
      title: "T9 Vintage Professional...",
      price: 625,
      discount: "-40%",
      rating: 4.8,
      reviews: 211,
      sold: "1.6k sold",
      image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=200&h=200&fit=crop",
      badges: ["FREE DELIVERY"],
    },
    {
      id: 3,
      title: "Strong Light LED Flashli...",
      price: 699,
      discount: "-53%",
      rating: 0,
      reviews: 0,
      sold: "",
      image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=200&h=200&fit=crop",
      badges: ["FREE DELIVERY", "GEMS"],
    },
    {
      id: 4,
      title: "Bell Collar with Cat Belt...",
      price: 199,
      discount: "-50%",
      rating: 0,
      reviews: 0,
      sold: "",
      image: "https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=200&h=200&fit=crop",
      badges: ["FREE DELIVERY", "GEMS"],
    },
  ])

  const [voucherCode, setVoucherCode] = useState("")
  const [selectAll, setSelectAll] = useState(false)

  const updateQuantity = (id: number, change: number) => {
    setCartItems((items) =>
      items.map((item) => (item.id === id ? { ...item, quantity: Math.max(1, item.quantity + change) } : item)),
    )
  }

  const CheckBox = ({ checked = false }: { checked?: boolean }) => (
    <View style={[styles.checkbox, checked && styles.checkboxChecked]} />
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="scan" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <TextInput style={styles.searchBar} placeholder="Storevia" placeholderTextColor="#aaa" />
          <TouchableOpacity style={styles.searchButton}>
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.payButton}>
          <Text style={styles.payText}>Pay</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Cart Title */}
        <View style={styles.cartHeader}>
          <Text style={styles.cartTitle}>My Cart</Text>
        </View>

        {/* Store Section */}
        <View style={styles.storeSection}>
          <View style={styles.storeHeader}>
            <View style={styles.storeInfo}>
              <CheckBox />
              <Text style={styles.storeIcon}>🏪</Text>
              <Text style={styles.storeName}>FashionApple</Text>
              <Text style={styles.arrow}>›</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.voucherText}>Get Voucher</Text>
            </TouchableOpacity>
          </View>

          {/* Discount Banner */}
          <View style={styles.discountSection}>
            <CheckBox />
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>Enjoy 2% off 2 item(s)</Text>
            </View>
            <View style={styles.addMoreSection}>
              <Text style={styles.addMoreText}>Add More</Text>
              <Text style={styles.arrow}>›</Text>
            </View>
          </View>

          {/* Product Item */}
          {cartItems.map((item) => (
            <View key={item.id} style={styles.productItem}>
              <CheckBox />
              <Image source={{ uri: item.image }} style={styles.productImage} />
              <View style={styles.productInfo}>
                <Text style={styles.productTitle} numberOfLines={2}>
                  {item.title}
                </Text>
                <Text style={styles.productBrand}>
                  {item.brand}, {item.family}
                </Text>
                <View style={styles.priceContainer}>
                  <View style={styles.discountTag}>
                    <Text style={styles.discountTagText}>{item.discount}</Text>
                  </View>
                </View>
                <View style={styles.priceRow}>
                  <Text style={styles.currentPrice}>Rs. {item.price}</Text>
                  <Text style={styles.originalPrice}>Rs. {item.originalPrice}</Text>
                </View>
              </View>
              <View style={styles.quantityContainer}>
                <TouchableOpacity style={styles.quantityButton} onPress={() => updateQuantity(item.id, -1)}>
                  <Text style={styles.quantityButtonText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.quantityText}>{item.quantity}</Text>
                <TouchableOpacity style={styles.quantityButton} onPress={() => updateQuantity(item.id, 1)}>
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Unavailable Items Section */}

        <View style={styles.unavailableSection}>
          <View style={styles.unavailableHeader}>
            <Text style={styles.unavailableTitle}>Unavailable items (2)</Text>
            <View style={styles.unavailableActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="trash-outline" size={20} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="heart-outline" size={20} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          {unavailableItems.map((item) => (
            <View key={item.id} style={styles.unavailableItem}>
              <CheckBox />
              <View style={styles.unavailableImageContainer}>
                <Image source={{ uri: item.image }} style={styles.productImage} />
                <View style={styles.outOfStockBadge}>
                  <Text style={styles.outOfStockText}>Out of stock</Text>
                </View>
              </View>
              <View style={styles.productInfo}>
                <Text style={styles.productTitle} numberOfLines={2}>
                  {item.title}
                </Text>
                <Text style={styles.productBrand}>
                  {item.brand}, {item.family}
                </Text>
                <Text style={styles.outOfStockLabel}>Out of stock</Text>
                <View style={styles.priceRow}>
                  <Text style={styles.currentPrice}>Rs. {item.price}</Text>
                  <Text style={styles.originalPrice}>Rs. {item.originalPrice}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.findSimilarButton}>
                <Text style={styles.findSimilarText}>Find Similar</Text>
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View All</Text>
            <Text style={styles.arrow}>▼</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.voucherSection}>
          <TextInput
            style={styles.voucherInput}
            placeholder="Enter Voucher Code"
            placeholderTextColor="#999"
            value={voucherCode}
            onChangeText={setVoucherCode}
          />
        </View>

        {/* Recommended Products Section */}
        <View style={styles.recommendedSection}>
          <View style={styles.recommendedGrid}>
            {recommendedProducts.map((product) => (
              <View key={product.id} style={styles.recommendedCard}>
                <View style={styles.recommendedImageContainer}>
                  <Image source={{ uri: product.image }} style={styles.recommendedImage} />
                  <View style={styles.badgeContainer}>
                    {product.badges.map((badge, index) => (
                      <View
                        key={index}
                        style={[styles.badge, badge === "FREE DELIVERY" ? styles.deliveryBadge : styles.gemsBadge]}
                      >
                        <Text
                          style={[
                            styles.badgeText,
                            badge === "FREE DELIVERY" ? styles.deliveryBadgeText : styles.gemsBadgeText,
                          ]}
                        >
                          {badge}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
                <View style={styles.recommendedInfo}>
                  <Text style={styles.recommendedTitle} numberOfLines={2}>
                    {product.title}
                  </Text>
                  <View style={styles.recommendedPriceRow}>
                    <Text style={styles.recommendedPrice}>Rs.{product.price}</Text>
                    <Text style={styles.recommendedDiscount}>{product.discount}</Text>
                  </View>
                  {product.rating > 0 && (
                    <View style={styles.ratingRow}>
                      <Text style={styles.rating}>⭐ {product.rating}</Text>
                      <Text style={styles.reviewCount}>({product.reviews})</Text>
                      {product.sold && <Text style={styles.soldCount}>{product.sold}</Text>}
                    </View>
                  )}
                  <TouchableOpacity style={styles.addToCartButton}>
                    <Ionicons name="cart" size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.checkoutSection}>
        <View style={styles.checkoutRow}>
          <TouchableOpacity style={styles.selectAllContainer} onPress={() => setSelectAll(!selectAll)}>
            <CheckBox checked={selectAll} />
            <Text style={styles.selectAllText}>All</Text>
          </TouchableOpacity>

          <View style={styles.totalContainer}>
            <View style={styles.subtotalRow}>
              <Text style={styles.subtotalLabel}>Subtotal: </Text>
              <Text style={styles.subtotalAmount}>Rs. 847</Text>
              <Text style={styles.arrow}>^</Text>
            </View>
            <Text style={styles.shippingFee}>Shipping Fee: Rs. 590</Text>
          </View>

          <TouchableOpacity style={styles.checkoutButton}>
            <Text style={styles.checkoutButtonText}>Check Out(2)</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default Cart

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    paddingTop: 50,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f57c00",
    padding: 10,
  },
  iconButton: {
    padding: 10,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 40,
    marginHorizontal: 10,
  },
  searchBar: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  searchButton: {
    backgroundColor: "#f57c00",
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginLeft: 10,
  },
  searchButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  payButton: {
    backgroundColor: "#4caf50",
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  payText: {
    color: "#fff",
    fontWeight: "bold",
  },
  content: {
    flex: 1,
  },
  cartHeader: {
    backgroundColor: "#fff",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  cartTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  storeSection: {
    backgroundColor: "#fff",
    marginTop: 8,
  },
  storeHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  storeInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  storeIcon: {
    fontSize: 16,
    marginLeft: 12,
    marginRight: 8,
  },
  storeName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginRight: 8,
  },
  arrow: {
    fontSize: 16,
    color: "#999",
  },
  voucherText: {
    color: "#f57c00",
    fontWeight: "500",
  },
  discountSection: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingTop: 8,
  },
  discountBadge: {
    backgroundColor: "#fff3e0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 12,
  },
  discountText: {
    color: "#f57c00",
    fontSize: 12,
  },
  addMoreSection: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: "auto",
  },
  addMoreText: {
    color: "#666",
    fontSize: 14,
    marginRight: 4,
  },
  productItem: {
    flexDirection: "row",
    padding: 16,
    alignItems: "flex-start",
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginLeft: 12,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productTitle: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
    lineHeight: 18,
  },
  productBrand: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },
  priceContainer: {
    marginBottom: 8,
  },
  discountTag: {
    backgroundColor: "#8d6e63",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  discountTagText: {
    color: "#fff",
    fontSize: 10,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  currentPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#f57c00",
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 14,
    color: "#999",
    textDecorationLine: "line-through",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 4,
  },
  quantityButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityButtonText: {
    fontSize: 16,
    color: "#666",
  },
  quantityText: {
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#333",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#ddd",
    borderRadius: 3,
  },
  checkboxChecked: {
    backgroundColor: "#f57c00",
    borderColor: "#f57c00",
  },
  unavailableSection: {
    backgroundColor: "#fff",
    marginTop: 8,
  },
  unavailableHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  unavailableTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  unavailableActions: {
    flexDirection: "row",
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  unavailableItem: {
    flexDirection: "row",
    padding: 16,
    alignItems: "flex-start",
  },
  unavailableImageContainer: {
    position: "relative",
    marginLeft: 12,
    marginRight: 12,
  },
  outOfStockBadge: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  outOfStockText: {
    color: "#fff",
    fontSize: 10,
  },
  outOfStockLabel: {
    fontSize: 12,
    color: "#999",
    marginBottom: 4,
  },
  findSimilarButton: {
    borderWidth: 1,
    borderColor: "#f57c00",
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: "flex-start",
  },
  findSimilarText: {
    color: "#f57c00",
    fontSize: 12,
    fontWeight: "500",
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  viewAllText: {
    color: "#666",
    fontSize: 14,
    marginRight: 4,
  },
  voucherSection: {
    backgroundColor: "#fff",
    marginTop: 8,
    padding: 16,
  },
  voucherInput: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#333",
  },
  checkoutSection: {
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  checkoutRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectAllContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  selectAllText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#333",
  },
  totalContainer: {
    flex: 1,
    alignItems: "center",
  },
  subtotalRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  subtotalLabel: {
    fontSize: 14,
    color: "#666",
  },
  subtotalAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#f57c00",
    marginRight: 4,
  },
  shippingFee: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  checkoutButton: {
    backgroundColor: "#f57c00",
    borderRadius: 4,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  checkoutButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  recommendedSection: {
    backgroundColor: "#fff",
    marginTop: 8,
    padding: 16,
  },
  recommendedGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  recommendedCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  recommendedImageContainer: {
    position: "relative",
  },
  recommendedImage: {
    width: "100%",
    height: 120,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  badgeContainer: {
    position: "absolute",
    top: 8,
    left: 8,
    flexDirection: "column",
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 4,
  },
  deliveryBadge: {
    backgroundColor: "#4caf50",
  },
  gemsBadge: {
    backgroundColor: "#e91e63",
  },
  badgeText: {
    fontSize: 8,
    fontWeight: "bold",
  },
  deliveryBadgeText: {
    color: "#fff",
  },
  gemsBadgeText: {
    color: "#fff",
  },
  recommendedInfo: {
    padding: 12,
    position: "relative",
  },
  recommendedTitle: {
    fontSize: 12,
    color: "#333",
    marginBottom: 8,
    lineHeight: 16,
  },
  recommendedPriceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  recommendedPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#f57c00",
    marginRight: 8,
  },
  recommendedDiscount: {
    fontSize: 12,
    color: "#4caf50",
    fontWeight: "500",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  rating: {
    fontSize: 12,
    color: "#333",
    marginRight: 4,
  },
  reviewCount: {
    fontSize: 10,
    color: "#666",
    marginRight: 8,
  },
  soldCount: {
    fontSize: 10,
    color: "#666",
  },
  addToCartButton: {
    position: "absolute",
    bottom: 12,
    right: 12,
    backgroundColor: "#f57c00",
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
})
