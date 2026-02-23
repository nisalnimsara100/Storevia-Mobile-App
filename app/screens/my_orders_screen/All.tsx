import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

const orders = [
  {
    id: '1',
    shopName: 'shopme',
    status: 'Delivered',
    statusColor: '#4A90E2',
    title: '2835 RGB LED Strip Light With Power Adapter 300 LEDs/5m DC 12V High Lu...',
    variant: 'Color family:5M RGB',
    price: '1,049',
    total: '1,389',
    qty: 1,
    // Use high-resolution Unsplash images for better reliability
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=200&auto=format&fit=crop', 
    buttons: ['Return/Refund', 'Buy again'],
  },
  {
    id: '2',
    shopName: 'V Tech',
    status: 'Cancelled',
    statusColor: '#4A90E2',
    title: '12V Neon LED Strip Light, 12V, 1 Meter - Neon Strip -Neon light strip',
    variant: 'Color family:Warm White',
    price: '347',
    total: '687',
    qty: 1,
    image: 'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=200&auto=format&fit=crop',
    buttons: ['Cancelled', 'Buy again'],
  },
  {
    id: '3',
    shopName: 'ANF',
    status: 'Delivered',
    statusColor: '#4A90E2',
    title: 'Laptop Stand Aluminum For Desk Adjustable Ergonomic Notebook Holde...',
    variant: 'Color Family:Multicolor, Fan Dimensions:Not Specified',
    price: '1,299',
    total: '1,299',
    qty: 1,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=200&auto=format&fit=crop',
    buttons: ['Buy again'],
  },
  {
    id: '4',
    shopName: 'Tech Hub',
    status: 'Delivered',
    statusColor: '#4A90E2',
    title: 'Wireless Bluetooth Mouse 2.4G Rechargeable Silent Mouse...',
    variant: 'Color: Matte Black',
    price: '850',
    total: '950',
    qty: 1,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=200&auto=format&fit=crop',
    buttons: ['Return/Refund', 'Buy again'],
  }
];

const All = () => {
  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {orders.map((order) => (
        <View key={order.id} style={styles.orderCard}>
          <View style={styles.shopHeader}>
            <View style={styles.shopInfo}>
              <MaterialCommunityIcons name="storefront-outline" size={18} color="black" />
              <Text style={styles.shopName}>{order.shopName}</Text>
              <Ionicons name="chevron-forward" size={16} color="#999" />
            </View>
            <Text style={[styles.statusText, { color: order.statusColor }]}>{order.status}</Text>
          </View>

          <View style={styles.productSection}>
            {/* Added onError and default background to debug */}
            <View style={styles.imageWrapper}>
              <Image 
                source={{ uri: order.image }} 
                style={styles.productImage}
                resizeMode="cover"
              />
            </View>
            
            <View style={styles.productDetails}>
              <Text style={styles.productTitle} numberOfLines={2}>
                {order.title}
              </Text>
              <View style={styles.variantBadge}>
                <Text style={styles.variantText}>{order.variant}</Text>
              </View>
              <View style={styles.priceQtyRow}>
                <Text style={styles.priceText}>Rs. {order.price}</Text>
                <Text style={styles.qtyText}>Qty: {order.qty}</Text>
              </View>
            </View>
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>
              Total({order.qty} Item): <Text style={styles.totalAmount}>Rs. {order.total}</Text>
            </Text>
          </View>

          <View style={styles.buttonGroup}>
            {order.buttons.map((btn, index) => (
              <TouchableOpacity 
                key={index} 
                style={[
                  styles.button, 
                  btn === 'Buy again' ? styles.primaryButton : styles.secondaryButton
                ]}
              >
                <Text style={[
                  styles.buttonText,
                  btn === 'Buy again' ? styles.primaryButtonText : styles.secondaryButtonText
                ]}>
                  {btn}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  orderCard: {
    padding: 15,
    borderBottomWidth: 12,
    borderBottomColor: '#F5F5F5', 
  },
  shopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  shopInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shopName: {
    fontSize: 15,
    fontWeight: '700',
    marginHorizontal: 6,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '500',
  },
  productSection: {
    flexDirection: 'row',
  },
  imageWrapper: {
    width: 90,
    height: 90,
    backgroundColor: '#E1E1E1', // If image fails, you will see a grey box
    borderRadius: 6,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productDetails: {
    flex: 1,
    marginLeft: 15,
  },
  productTitle: {
    fontSize: 14,
    lineHeight: 18,
    color: '#222',
  },
  variantBadge: {
    backgroundColor: '#F8F8F8',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 4,
    marginTop: 8,
  },
  variantText: {
    fontSize: 12,
    color: '#777',
  },
  priceQtyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  priceText: {
    fontSize: 15,
    fontWeight: '600',
  },
  qtyText: {
    fontSize: 14,
    fontWeight: '500',
  },
  totalRow: {
    alignItems: 'flex-end',
    marginTop: 18,
  },
  totalLabel: {
    fontSize: 14,
    color: '#444',
  },
  totalAmount: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 15,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 4,
    marginLeft: 10,
    borderWidth: 1,
    minWidth: 115,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#FF5722',
    borderColor: '#FF5722',
  },
  secondaryButton: {
    backgroundColor: '#FFF',
    borderColor: '#D1D1D1',
  },
  primaryButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  secondaryButtonText: {
    color: '#333',
    fontWeight: '500',
  },
  buttonText: {
    fontSize: 14,
  }
});

export default All;