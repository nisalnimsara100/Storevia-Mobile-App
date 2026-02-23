import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';

const ToReceive = () => {
  // Expanded list of orders specifically for the "To Receive" state
  const receivingOrders = [
    {
      id: '1',
      shopName: 'shopme',
      status: 'In Transit',
      title: '2835 RGB LED Strip Light With Power Adapter 300 LEDs/5m DC 12V High Lu...',
      colorFamily: '5M RGB',
      price: '1,049',
      totalPrice: '1,389',
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=200', 
    },
    {
      id: '2',
      shopName: 'ANF Electronics',
      status: 'Out for Delivery',
      title: 'Laptop Stand Aluminum For Desk Adjustable Ergonomic Notebook Holder',
      colorFamily: 'Silver Aluminum',
      price: '1,299',
      totalPrice: '1,299',
      image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=200',
    },
    {
      id: '3',
      shopName: 'V Tech',
      status: 'Arrived at Hub',
      title: '12V Neon LED Strip Light, Warm White, 1 Meter - Flexible Neon Strip',
      colorFamily: 'Warm White',
      price: '347',
      totalPrice: '687',
      image: 'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=200',
    },
    {
      id: '4',
      shopName: 'Tech Gear Co.',
      status: 'Shipped',
      title: 'USB-C Hub Multiport Adapter - 7 in 1 with 4K HDMI',
      colorFamily: 'Space Grey',
      price: '2,500',
      totalPrice: '2,750',
      image: 'https://images.unsplash.com/photo-1541140134513-85a161dc4a00?q=80&w=200',
    }
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {receivingOrders.map((item) => (
          <View key={item.id} style={styles.orderCard}>
            {/* Header: Shop Name and Status */}
            <View style={styles.cardHeader}>
              <View style={styles.shopSection}>
                <Text style={styles.shopIcon}>🏪</Text>
                <Text style={styles.shopName}>{item.shopName}</Text>
                <Text style={styles.arrow}>{'>'}</Text>
              </View>
              {/* Using a blue-ish color for "To Receive" status to match delivery themes */}
              <Text style={styles.statusText}>{item.status}</Text>
            </View>

            {/* Product Body */}
            <View style={styles.productSection}>
              <Image source={{ uri: item.image }} style={styles.productImage} />
              <View style={styles.details}>
                <Text style={styles.productTitle} numberOfLines={2}>
                  {item.title}
                </Text>
                <View style={styles.variationBadge}>
                  <Text style={styles.variationText}>Color family: {item.colorFamily}</Text>
                </View>
                <View style={styles.priceRow}>
                  <Text style={styles.price}>Rs. {item.price}</Text>
                  <Text style={styles.quantity}>Qty: 1</Text>
                </View>
              </View>
            </View>

            {/* Footer: Totals and Buttons */}
            <View style={styles.footer}>
              <Text style={styles.totalText}>
                Total(1 Item): <Text style={styles.totalAmount}>Rs. {item.totalPrice}</Text>
              </Text>
              <View style={styles.buttonGroup}>
                <TouchableOpacity style={styles.secondaryButton}>
                  <Text style={styles.secondaryButtonText}>Track Order</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.primaryButton}>
                  <Text style={styles.primaryButtonText}>Confirm Receipt</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40, // Ensures the last order isn't hidden by navigation bars
  },
  orderCard: {
    backgroundColor: '#FFF',
    marginTop: 10,
    padding: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  shopSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shopIcon: {
    fontSize: 14,
  },
  shopName: {
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 5,
  },
  arrow: {
    fontSize: 14,
    color: '#9E9E9E',
    marginLeft: 4,
  },
  statusText: {
    color: '#007AFF', // Professional Blue for delivery status
    fontSize: 13,
    fontWeight: '600',
  },
  productSection: {
    flexDirection: 'row',
  },
  productImage: {
    width: 85,
    height: 85,
    borderRadius: 6,
    backgroundColor: '#F9F9F9',
  },
  details: {
    flex: 1,
    marginLeft: 12,
  },
  productTitle: {
    fontSize: 14,
    color: '#212121',
    lineHeight: 18,
  },
  variationBadge: {
    backgroundColor: '#F5F5F5',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 6,
    borderRadius: 4,
  },
  variationText: {
    fontSize: 12,
    color: '#757575',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
  },
  quantity: {
    color: '#757575',
    fontSize: 12,
  },
  footer: {
    alignItems: 'flex-end',
    marginTop: 15,
    borderTopWidth: 0.5,
    borderTopColor: '#F0F0F0',
    paddingTop: 12,
  },
  totalText: {
    fontSize: 14,
    color: '#212121',
  },
  totalAmount: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#212121',
  },
  buttonGroup: {
    flexDirection: 'row',
    marginTop: 12,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#D1D1D1',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginRight: 10,
  },
  secondaryButtonText: {
    fontSize: 13,
    color: '#424242',
  },
  primaryButton: {
    backgroundColor: '#F85606',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  primaryButtonText: {
    fontSize: 13,
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default ToReceive;