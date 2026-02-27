import React from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ToReview = () => {
  // Expanded list of orders specifically for the "To Review" state
  const reviewOrders = [
    {
      id: '1',
      shopName: 'shopme',
      status: 'Delivered',
      title: '2835 RGB LED Strip Light With Power Adapter 300 LEDs/5m DC 12V High Lu...',
      colorFamily: '5M RGB',
      price: '1,049',
      totalPrice: '1,389',
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=200', 
    },
    {
      id: '2',
      shopName: 'V Tech',
      status: 'Cancelled',
      title: '12V Neon LED Strip Light, 12V, 1 Meter - Neon Strip -Neon light strip',
      colorFamily: 'Warm White',
      price: '347',
      totalPrice: '687',
      image: 'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=200',
    },
    {
      id: '3',
      shopName: 'ANF',
      status: 'Delivered',
      title: 'Laptop Stand Aluminum For Desk Adjustable Ergonomic Notebook Holder',
      colorFamily: 'Multicolor, Fan Dimensions:Not Specified',
      price: '1,299',
      totalPrice: '1,299',
      image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=200',
    },
    {
      id: '4',
      shopName: 'Smart Home Store',
      status: 'Delivered',
      title: 'Wireless Smart Doorbell with Camera - 1080p HD Video & Two-Way Audio',
      colorFamily: 'Matte Black',
      price: '2,450',
      totalPrice: '2,600',
      image: 'https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=200',
    },
    {
      id: '5',
      shopName: 'Audio Lab',
      status: 'Delivered',
      title: 'Over-Ear Noise Cancelling Headphones - Wireless Bluetooth 5.0',
      colorFamily: 'Midnight Blue',
      price: '5,800',
      totalPrice: '5,800',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=200',
    }
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {reviewOrders.map((item) => (
          <View key={item.id} style={styles.orderCard}>
            {/* Header: Shop Name and Status */}
            <View style={styles.cardHeader}>
              <View style={styles.shopSection}>
                <Text style={styles.shopIcon}>🏪</Text>
                <Text style={styles.shopName}>{item.shopName}</Text>
                {/* Fixed the arrow character handling */}
                <Text style={styles.arrow}>{'>'}</Text>
              </View>
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

            {/* Footer: Action Buttons */}
            <View style={styles.footer}>
              <Text style={styles.totalText}>
                Total(1 Item): <Text style={styles.totalAmount}>Rs. {item.totalPrice}</Text>
              </Text>
              <View style={styles.buttonGroup}>
                <TouchableOpacity style={styles.secondaryButton}>
                  <Text style={styles.secondaryButtonText}>
                    {item.status === 'Cancelled' ? 'Cancelled' : 'Return/Refund'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.primaryButton}>
                  <Text style={styles.primaryButtonText}>Buy again</Text>
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
    paddingBottom: 40,
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
    fontSize: 16,
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
    fontSize: 13,
    fontWeight: '600',
    color: '#4A90E2', // Blue as seen in screenshot
  },
  productSection: {
    flexDirection: 'row',
  },
  productImage: {
    width: 90,
    height: 90,
    borderRadius: 8,
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
    paddingVertical: 4,
    marginTop: 6,
    borderRadius: 4,
  },
  variationText: {
    fontSize: 12,
    color: '#8E8E93',
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
    color: '#212121',
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'flex-end',
    marginTop: 15,
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
    marginTop: 15,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#8E8E93',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 2,
    marginRight: 10,
  },
  secondaryButtonText: {
    fontSize: 15,
    color: '#212121',
  },
  primaryButton: {
    backgroundColor: '#F85606',
    paddingVertical: 8,
    paddingHorizontal: 25,
    borderRadius: 2,
  },
  primaryButtonText: {
    fontSize: 15,
    color: '#FFF',
    fontWeight: '600',
  },
});

export default ToReview;