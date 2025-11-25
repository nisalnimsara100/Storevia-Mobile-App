import ShopDetails from '@/app/components/item_details/ShopDetails'
import Vouchers from '@/app/components/item_details/Vouchers'
import { Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React from 'react'
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const ItemDetailsScreen = () => {
  const { itemId } = useLocalSearchParams();
  const router = useRouter();
  
  // Mock product data - in a real app, you would fetch this based on the itemId
  const products = [
    {
      id: 1,
      name: 'Cow & Gate',
      image: require('../../../assets/products/watch.jpg'),
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
    <ScrollView style={styles.container}>
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>
        <View style={styles.placeholder} />
      </View>
      
      {/* Product Image */}
      <View style={styles.imageContainer}>
        <Image
          source={product.image}
          style={styles.productImage}
          resizeMode="contain"
        />
      </View>
      
      {/* Product Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.productName}>{product.name}</Text>
        
        {/* Badges */}
        <View style={styles.badgesContainer}>
          {product.badges.map((badge, index) => (
            <View key={index} style={styles.badge}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          ))}
        </View>
        
        {/* Rating and Reviews */}
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>⭐ {product.rating}</Text>
          <Text style={styles.reviews}>({product.reviews} reviews)</Text>
          <Text style={styles.sold}>| {product.sold} sold</Text>
        </View>
        
        {/* Price */}
        <View style={styles.priceContainer}>
          <Text style={styles.price}>Rs.{product.price}</Text>
          <Text style={styles.oldPrice}>Rs.{product.oldPrice}</Text>
          <Text style={styles.discount}>-{product.discount}%</Text>
        </View>
        
        {/* Stock */}
        <Text style={styles.stock}>Only {product.stock} left in stock</Text>
        
        {/* Description */}
        <Text style={styles.descriptionTitle}>Description</Text>
        <Text style={styles.description}>{product.description}</Text>
        
        {/* Add to Cart Button */}
        <TouchableOpacity style={styles.addToCartButton}>
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>

        <View style={styles.sectionContainer}>
          <Vouchers />
        </View>

        <View style={styles.sectionContainer}>
          <ShopDetails />
        </View>
        
      </View>
    </ScrollView>
  );
}

export default ItemDetailsScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF4EAFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  imageContainer: {
    backgroundColor: '#f8f8f8',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
  },
  productImage: {
    width: '100%',
    height: '100%',
    maxWidth: 250,
  },
  infoContainer: {
    padding: 16,
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  badge: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 4,
  },
  badgeText: {
    fontSize: 12,
    color: '#2e7d32',
    fontWeight: '500',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rating: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 8,
  },
  reviews: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  sold: {
    fontSize: 14,
    color: '#666',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e53935',
    marginRight: 8,
  },
  oldPrice: {
    fontSize: 16,
    color: '#999',
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  discount: {
    fontSize: 16,
    color: '#43a047',
    fontWeight: 'bold',
  },
  stock: {
    fontSize: 14,
    color: '#e53935',
    marginBottom: 16,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 24,
  },
  addToCartButton: {
    backgroundColor: '#fc8107',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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