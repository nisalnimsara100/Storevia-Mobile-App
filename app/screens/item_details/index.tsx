import ShopDetails from '@/app/components/item_details/ShopDetails'
import ProductCard from '@/app/components/item_details/ProductCard'
import Vouchers from '@/app/components/item_details/Vouchers'
import { useLocalSearchParams } from 'expo-router'
import React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'

const ItemDetailsScreen = () => {
  const { itemId } = useLocalSearchParams();
  
  // Mock product data - in a real app, you would fetch this based on the itemId
  const products = [
    {
      id: 1,
      name: 'Cow & Gate',
      image: require('../../../assets/products/watch.jpg'),
      images: [
        require('../../../assets/products/watch.jpg'),
        require('../../../assets/products/phone.jpg'),
        require('../../../assets/products/tab.jpg')
      ],
      price: 1730,
      oldPrice: 2000,
      discount: 14,
      stock: 2,
      rating: 4,
      reviews: 220,
      sold: 100,
      badges: ['Bestseller', 'Free Shipping'],
      description: 'High-quality product with excellent features and durability. Perfect for everyday use.',
    },
    {
      id: 2,
      name: 'Windows 11 Pro',
      image: require('../../../assets/products/laptop.jpg'),
      images: [
        require('../../../assets/products/laptop.jpg'),
        require('../../../assets/products/WhatsApp Image 2025-08-02 at 13.31.12_cfe1f534.jpg'),
        require('../../../assets/products/phone.jpg')
      ],
      price: 99,
      oldPrice: 999,
      discount: 90,
      stock: 1,
      rating: 4,
      reviews: 220,
      sold: 100,
      badges: ['Bestseller', 'Free Shipping'],
      description: 'Latest Windows operating system with advanced features and enhanced security.',
    },
    {
      id: 3,
      name: 'Trinkle Razors',
      image: require('../../../assets/products/tab.jpg'),
      images: [
        require('../../../assets/products/tab.jpg'),
        require('../../../assets/products/watch.jpg'),
        require('../../../assets/products/laptop.jpg')
      ],
      price: 145,
      oldPrice: 520,
      discount: 72,
      stock: 5,
      rating: 4.5,
      reviews: 120,
      sold: 300,
      badges: ['Bestseller', 'Free Shipping'],
      description: 'Premium quality razors for a smooth and comfortable shaving experience.',
    },
  ];
  
  const product = products.find(p => p.id.toString() === itemId);
  
  if (!product) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Product not found</Text>
      </View>
    );
  }
  
  return (
    <ScrollView
      style={styles.container}
      bounces={false}
      overScrollMode="never"
      showsVerticalScrollIndicator={true}
    >
      <ProductCard product={product} />

      <View style={styles.sectionContainer}>
        <Vouchers />
      </View>

      <View style={styles.sectionContainer}>
        <ShopDetails />
      </View>
    </ScrollView>
  );
}

export default ItemDetailsScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF4EAFF',
    paddingHorizontal: 0,
  },
  errorText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginTop: 100,
  },
  sectionContainer: {
    marginTop: 24,
    backgroundColor: '#fff',
    marginHorizontal: -20,
  },
})