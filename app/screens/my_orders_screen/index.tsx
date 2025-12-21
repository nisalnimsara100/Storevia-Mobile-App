"use client"

import { Ionicons } from "@expo/vector-icons"
import * as React from "react"
import { Clipboard, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"

const ordersData = [
  {
    id: 1,
    status: "Delivered",
    date: "19/09/2025",
    message: "Your feedback will help others make the right choice. Tap here to share your review",
    orderNumber: "22137961564012",
    tracking: "LK-DM-DEX-026360943",
    image: "https://via.placeholder.com/80",
    showReview: true,
    customerName: "Devinda Thisera",
    customerRef: "767286976",
    address: "Kurunegala Town, 54/1/D Kandawalpola Road Maraluwa...",
    storeName: "ssmobile",
    productName: "Bajaj Pulsar 150 180 Pulsar N160 N125 NS200 Fabric Waterproof Outdoor Moto...",
    price: 1399,
    quantity: 1,
    total: 1553,
  },
  {
    id: 2,
    status: "Delivered",
    date: "19/09/2025",
    message: "Your feedback will help others make the right choice. Tap here to share your review",
    orderNumber: "22137961484012",
    tracking: "LK-DM-DEX-026364441",
    image: "https://via.placeholder.com/80",
    showReview: true,
    customerName: "Devinda Thisera",
    customerRef: "767286976",
    address: "Kurunegala Town, 54/1/D Kandawalpola Road Maraluwa...",
    storeName: "ssmobile",
    productName: "Smart Watch with Multiple Features and Long Battery Life",
    price: 2499,
    quantity: 1,
    total: 2650,
  },
  {
    id: 3,
    status: "Your order is just a click away!",
    date: "17/09/2025",
    message: "Complete your payment within the next 30 minutes to avoid cancellation of your order",
    orderNumber: "22137961384012",
    tracking: "",
    image: "https://via.placeholder.com/80",
    showReview: true,
    customerName: "Devinda Thisera",
    customerRef: "767286976",
    address: "Kurunegala Town, 54/1/D Kandawalpola Road Maraluwa...",
    storeName: "ssmobile",
    productName: "Smart Watch with Multiple Features and Long Battery Life",
    price: 2499,
    quantity: 1,
    total: 2650,
  },
  {
    id: 4,
    status: "Your order is just a click away!",
    date: "17/09/2025",
    message: "Complete your payment within the next 30 minutes to avoid cancellation of your order",
    orderNumber: "22137961284012",
    tracking: "",
    image: "https://via.placeholder.com/80",
    showReview: true,
    customerName: "Devinda Thisera",
    customerRef: "767286976",
    address: "Kurunegala Town, 54/1/D Kandawalpola Road Maraluwa...",
    storeName: "ssmobile",
    productName: "Bajaj Pulsar 150 180 Pulsar N160 N125 NS200 Fabric Waterproof Outdoor Moto...",
    price: 1399,
    quantity: 1,
    total: 1553,
  },
]

type Order = (typeof ordersData)[number]

const MyOrdersScreen = () => {
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null)
  const [showSummary, setShowSummary] = React.useState(false)

  const handleOrderPress = (order: Order) => {
    setSelectedOrder(order)
  }

  const handleBackToList = () => {
    setSelectedOrder(null)
    setShowSummary(false)
  }

  const copyOrderNumber = () => {
    if (selectedOrder) {
      Clipboard.setString(selectedOrder.orderNumber)
      // You can add a toast notification here
    }
  }

  // Show Order Details View
  if (selectedOrder) {
    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackToList}>
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Order Details</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.cartButton}>
              <Ionicons name="cart-outline" size={24} color="#000" />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>1</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuButton}>
              <Ionicons name="ellipsis-horizontal" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Delivery Status Banner */}
          <View style={styles.statusBanner}>
            <View style={styles.statusContent}>
              <Text style={styles.statusTitle}>Delivered</Text>
              <Text style={styles.statusMessage}>
                You have confirmed that your order has been delivered and received. Thank you for shopping with us.
              </Text>
            </View>
            <Image source={{ uri: "https://via.placeholder.com/80" }} style={styles.statusIllustration} />
          </View>

          {/* Package Delivered Info */}
          <TouchableOpacity style={styles.infoRow}>
            <Ionicons name="cube" size={20} color="#2563eb" />
            <Text style={styles.infoText}>19 Sep-Package delivered!</Text>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" style={styles.chevron} />
          </TouchableOpacity>

          {/* Delivery Address */}
          <View style={styles.section}>
            <View style={styles.addressHeader}>
              <Ionicons name="location-outline" size={20} color="#000" />
              <View style={styles.addressContent}>
                <Text style={styles.customerName}>
                  {selectedOrder.customerName} <Text style={styles.orderRef}>{selectedOrder.customerRef}</Text>
                </Text>
                <Text style={styles.address}>{selectedOrder.address}</Text>
              </View>
            </View>
          </View>

          {/* Store Info */}
          <TouchableOpacity style={styles.storeRow}>
            <Ionicons name="storefront-outline" size={20} color="#000" />
            <Text style={styles.storeName}>{selectedOrder.storeName}</Text>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>

          {/* Product Details */}
          <View style={styles.productSection}>
            <View style={styles.productRow}>
              <Image source={{ uri: selectedOrder.image }} style={styles.productImage} />
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{selectedOrder.productName}</Text>
                <View style={styles.priceRow}>
                  <Text style={styles.price}>Rs. {selectedOrder.price.toLocaleString()}</Text>
                  <Text style={styles.quantity}>Qty: {selectedOrder.quantity}</Text>
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.returnButton}>
                <Text style={styles.returnButtonText}>Return/Refund</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.reviewButtonOrange}>
                <Text style={styles.reviewButtonTextOrange}>Write A Review</Text>
              </TouchableOpacity>
            </View>

            {/* Chat with Seller */}
            <TouchableOpacity style={styles.chatButton}>
              <Ionicons name="chatbubble-outline" size={16} color="#ef4444" />
              <Text style={styles.chatText}>Chat with Seller</Text>
              <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
            </TouchableOpacity>
          </View>

          {/* Order Summary */}
          <View style={styles.summarySection}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalAmount}>Rs. {selectedOrder.total.toLocaleString()}</Text>
            </View>
            <View style={styles.orderNumberRow}>
              <Text style={styles.orderNumberLabel}>Order No.</Text>
              <View style={styles.orderNumberValue}>
                <Text style={styles.orderNumber}>{selectedOrder.orderNumber}</Text>
                <TouchableOpacity onPress={copyOrderNumber}>
                  <Text style={styles.copyText}>copy</Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity style={styles.viewSummaryButton} onPress={() => setShowSummary(!showSummary)}>
              <Text style={styles.viewSummaryText}>View Order Summary</Text>
              <Ionicons name={showSummary ? "chevron-up" : "chevron-down"} size={20} color="#2563eb" />
            </TouchableOpacity>
          </View>

          {/* Related Products */}
          <View style={styles.relatedSection}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <Image source={{ uri: "https://via.placeholder.com/150" }} style={styles.relatedImage} />
              <Image source={{ uri: "https://via.placeholder.com/150" }} style={styles.relatedImage} />
            </ScrollView>
          </View>

          {/* Buy Again Button */}
          <TouchableOpacity style={styles.buyAgainButton}>
            <Text style={styles.buyAgainText}>Buy again</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    )
  }

  // Show Orders List View
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Orders</Text>
        <TouchableOpacity style={styles.cameraButton}>
          <Ionicons name="camera-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Orders List */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {ordersData.map((order) => (
          <TouchableOpacity
            key={order.id}
            style={styles.orderCard}
            onPress={() => handleOrderPress(order)}
            activeOpacity={0.7}
          >
            {/* Order Header */}
            <View style={styles.orderHeader}>
              <View style={styles.iconContainer}>
                <Ionicons name="cube" size={24} color="#fff" />
              </View>
              <View style={styles.orderHeaderText}>
                <Text style={styles.orderStatus}>{order.status}</Text>
                <Text style={styles.orderDate}>{order.date}</Text>
              </View>
            </View>

            {/* Order Content */}
            <View style={styles.orderContent}>
              <Image source={{ uri: order.image }} style={styles.productImageSmall} />
              <View style={styles.orderDetails}>
                <Text style={styles.orderMessage}>{order.message}</Text>
                {order.orderNumber && (
                  <>
                    <Text style={styles.orderInfo}>Order # {order.orderNumber}</Text>
                    <Text style={styles.orderInfo}>Tracking # {order.tracking}</Text>
                  </>
                )}
              </View>
            </View>

            {/* Order Footer */}
            {order.showReview && (
              <View style={styles.orderFooter}>
                <View style={styles.rewardContainer}>
                  <Text style={styles.rewardText}>Review products and earn up to </Text>
                  <Text style={styles.rewardAmount}>❤️ 600</Text>
                </View>
                <TouchableOpacity style={styles.reviewButton}>
                  <Text style={styles.reviewButtonText}>Review</Text>
                </TouchableOpacity>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    flex: 1,
    marginLeft: 12,
  },
  cameraButton: {
    padding: 4,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  cartButton: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#ef4444",
    borderRadius: 10,
    width: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
  menuButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
    marginTop: -1,
    paddingTop: 0,
  },
  // Orders List Styles
  orderCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 2,
    marginBottom: 4,
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  orderHeaderText: {
    flex: 1,
  },
  orderStatus: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000",
    marginBottom: 2,
  },
  orderDate: {
    fontSize: 13,
    color: "#9ca3af",
  },
  orderContent: {
    flexDirection: "row",
    marginBottom: 12,
  },
  productImageSmall: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
    marginRight: 12,
  },
  orderDetails: {
    flex: 1,
    justifyContent: "center",
  },
  orderMessage: {
    fontSize: 13,
    color: "#6b7280",
    lineHeight: 18,
    marginBottom: 8,
  },
  orderInfo: {
    fontSize: 12,
    color: "#9ca3af",
    marginBottom: 2,
  },
  orderFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  rewardContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  rewardText: {
    fontSize: 13,
    color: "#6b7280",
  },
  rewardAmount: {
    fontSize: 13,
    fontWeight: "600",
    color: "#000",
  },
  reviewButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ec4899",
  },
  reviewButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ec4899",
  },
  // Order Details Styles
  statusBanner: {
    backgroundColor: "#fce7f3",
    flexDirection: "row",
    padding: 20,
    alignItems: "center",
    justifyContent: "space-between",
  },
  statusContent: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
    marginBottom: 8,
  },
  statusMessage: {
    fontSize: 13,
    color: "#6b7280",
    lineHeight: 18,
  },
  statusIllustration: {
    width: 80,
    height: 80,
    marginLeft: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  infoText: {
    fontSize: 14,
    color: "#000",
    marginLeft: 12,
    flex: 1,
  },
  chevron: {
    marginLeft: "auto",
  },
  section: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  addressHeader: {
    flexDirection: "row",
  },
  addressContent: {
    flex: 1,
    marginLeft: 12,
  },
  customerName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  orderRef: {
    fontSize: 13,
    fontWeight: "400",
    color: "#9ca3af",
  },
  address: {
    fontSize: 13,
    color: "#6b7280",
    lineHeight: 18,
  },
  storeRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  storeName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000",
    marginLeft: 12,
    flex: 1,
  },
  productSection: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 8,
    borderBottomColor: "#f3f4f6",
  },
  productRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  productName: {
    fontSize: 14,
    color: "#000",
    lineHeight: 18,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000",
  },
  quantity: {
    fontSize: 14,
    color: "#6b7280",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  returnButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d1d5db",
    alignItems: "center",
  },
  returnButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
  },
  reviewButtonOrange: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#fb923c",
    alignItems: "center",
  },
  reviewButtonTextOrange: {
    fontSize: 14,
    fontWeight: "500",
    color: "#fb923c",
  },
  chatButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    gap: 6,
  },
  chatText: {
    fontSize: 14,
    color: "#ef4444",
    fontWeight: "500",
  },
  summarySection: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 8,
    borderBottomColor: "#f3f4f6",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000",
  },
  totalAmount: {
    fontSize: 15,
    fontWeight: "700",
    color: "#000",
  },
  orderNumberRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  orderNumberLabel: {
    fontSize: 14,
    color: "#000",
  },
  orderNumberValue: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  orderNumber: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
  copyText: {
    fontSize: 14,
    color: "#2563eb",
  },
  viewSummaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  viewSummaryText: {
    fontSize: 14,
    color: "#2563eb",
    fontWeight: "500",
  },
  relatedSection: {
    padding: 16,
    backgroundColor: "#f9fafb",
  },
  relatedImage: {
    width: 150,
    height: 150,
    borderRadius: 8,
    backgroundColor: "#fff",
    marginRight: 12,
  },
  buyAgainButton: {
    margin: 16,
    backgroundColor: "#fb923c",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buyAgainText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
})

export default MyOrdersScreen
