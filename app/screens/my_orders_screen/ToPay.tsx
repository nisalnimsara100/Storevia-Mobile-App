import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';

const ToPay = () => {
  // Expanded list with realistic image URLs
  const pendingOrders = [
    {
      id: '1',
      shopName: 'shopme',
      status: 'Pending Payment',
      title: '2835 RGB LED Strip Light With Power Adapter 300 LEDs/5m DC 12V High Lu...',
      colorFamily: '5M RGB',
      price: '1,049',
      total: '1,389',
      qty: 1,
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=200&q=80' 
    },
    {
      id: '2',
      shopName: 'V Tech',
      status: 'Pending Payment',
      title: '12V Neon LED Strip Light, 12V, 1 Meter - Neon Strip - Neon light strip',
      colorFamily: 'Warm White',
      price: '347',
      total: '687',
      qty: 1,
      image: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=200&q=80'
    },
    {
      id: '3',
      shopName: 'ANF',
      status: 'Pending Payment',
      title: 'Laptop Stand Aluminum For Desk Adjustable Ergonomic Notebook Holder...',
      colorFamily: 'Multicolor',
      price: '1,299',
      total: '1,299',
      qty: 1,
      image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=200&q=80'
    },
    {
      id: '4',
      shopName: 'Tech Zone',
      status: 'Pending Payment',
      title: 'Mechanical RGB Keyboard - Hot Swappable Switches',
      colorFamily: 'Black',
      price: '4,500',
      total: '4,800',
      qty: 1,
      image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=200&q=80'
    },
    {
      id: '5',
      shopName: 'Mobile Care',
      status: 'Pending Payment',
      title: 'Fast Charging USB-C Cable 2M Nylon Braided',
      colorFamily: 'Red',
      price: '850',
      total: '950',
      qty: 2,
      image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=200&q=80'
    }
  ];

  const totalToPay = pendingOrders.reduce((sum, item) => sum + parseInt(item.total.toString().replace(',', '')), 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Scrollable Content */}
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {pendingOrders.map((order) => (
          <View key={order.id} style={styles.orderCard}>
            {/* Shop Header */}
            <View style={styles.header}>
              <View style={styles.shopInfo}>
                <Text style={styles.shopIcon}>🏪</Text>
                <Text style={styles.shopName}>{order.shopName}</Text>
                <Text style={styles.arrow}>{'>'}</Text>
              </View>
              <Text style={styles.statusText}>{order.status}</Text>
            </View>

            {/* Product Section */}
            <View style={styles.productSection}>
              <Image source={{ uri: order.image }} style={styles.productImage} />
              <View style={styles.details}>
                <Text style={styles.productTitle} numberOfLines={2}>{order.title}</Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>Color: {order.colorFamily}</Text>
                </View>
                <View style={styles.priceRow}>
                  <Text style={styles.price}>Rs. {order.price}</Text>
                  <Text style={styles.qty}>Qty: {order.qty}</Text>
                </View>
              </View>
            </View>

            {/* Total & Action Buttons */}
            <View style={styles.footer}>
              <Text style={styles.totalText}>
                Total: <Text style={styles.totalAmount}>Rs. {order.total}</Text>
              </Text>
              <View style={styles.buttonGroup}>
                <TouchableOpacity style={styles.secondaryButton}>
                  <Text style={styles.secondaryButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.primaryButton}>
                  <Text style={styles.primaryButtonText}>Pay Now</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
        {/* Extra space so the last item isn't covered by the footer */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Sticky Bottom Summary Bar */}
      <View style={styles.payAllBar}>
        <View>
          <Text style={styles.payAllLabel}>Total Amount</Text>
          <Text style={styles.payAllPrice}>Rs. {totalToPay.toLocaleString()}</Text>
        </View>
        <TouchableOpacity style={styles.payAllButton}>
          <Text style={styles.payAllButtonText}>PAY ALL ({pendingOrders.length})</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  container: {
    flex: 1,
  },
  orderCard: {
    backgroundColor: '#FFF',
    marginTop: 10,
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  shopInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shopIcon: { fontSize: 18, marginRight: 8 },
  shopName: { fontWeight: '700', fontSize: 15, color: '#333' },
  arrow: { color: '#BBB', marginLeft: 5, fontSize: 16 },
  statusText: { color: '#FF5722', fontSize: 13, fontWeight: '600' },
  productSection: { flexDirection: 'row' },
  productImage: { 
    width: 85, 
    height: 85, 
    borderRadius: 8, 
    backgroundColor: '#F0F0F0' 
  },
  details: { flex: 1, marginLeft: 12 },
  productTitle: { fontSize: 14, color: '#444', fontWeight: '500' },
  badge: { 
    backgroundColor: '#F2F2F2', 
    alignSelf: 'flex-start', 
    paddingHorizontal: 8, 
    paddingVertical: 3, 
    marginTop: 6,
    borderRadius: 4
  },
  badgeText: { fontSize: 11, color: '#888' },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  price: { fontSize: 16, fontWeight: '700', color: '#222' },
  qty: { color: '#999', fontSize: 13 },
  footer: { 
    marginTop: 15, 
    borderTopWidth: 1, 
    borderTopColor: '#F5F5F5', 
    paddingTop: 12, 
    alignItems: 'flex-end' 
  },
  totalText: { fontSize: 13, color: '#666' },
  totalAmount: { fontWeight: 'bold', color: '#FF5722', fontSize: 15 },
  buttonGroup: { flexDirection: 'row', marginTop: 12 },
  primaryButton: { 
    backgroundColor: '#FF5722', 
    paddingHorizontal: 22, 
    paddingVertical: 10, 
    borderRadius: 6, 
    marginLeft: 10 
  },
  primaryButtonText: { color: '#FFF', fontWeight: '700', fontSize: 13 },
  secondaryButton: { 
    borderWidth: 1, 
    borderColor: '#CCC', 
    paddingHorizontal: 22, 
    paddingVertical: 10, 
    borderRadius: 6 
  },
  secondaryButtonText: { color: '#777', fontSize: 13, fontWeight: '500' },
  
  // Bottom Sticky Bar
  payAllBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#FFF',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 10, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  payAllLabel: { fontSize: 12, color: '#999', textTransform: 'uppercase' },
  payAllPrice: { fontSize: 22, fontWeight: '800', color: '#FF5722' },
  payAllButton: { backgroundColor: '#FF5722', paddingHorizontal: 30, paddingVertical: 14, borderRadius: 8 },
  payAllButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
});

export default ToPay;