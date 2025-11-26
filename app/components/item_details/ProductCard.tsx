import { FontAwesome } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Swiper from 'react-native-swiper';

interface ProductCardProps {
  product: {
    image: any;
    images?: any[];
    name: string;
    badges?: string[];
    rating?: number;
    reviews?: number;
    sold?: number;
    price: number;
    oldPrice?: number;
    discount?: number;
    stock: number;
    description: string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const totalImages = product.images?.length ?? 1;
  
  const images = product.images && product.images.length > 0
    ? product.images
    : [product.image];

  return (
    <View style={styles.container}>
      {/* Product Image */}
      <View style={styles.imageContainer}>
        <Swiper
          style={styles.wrapper}
          loop={false}
          showsButtons={false}
          showsPagination={false}
          bounces={false}
          onIndexChanged={(index) => setCurrentImageIndex(index)}
        >
          {images.map((image, index) => (
            <View key={index} style={styles.slide}>
              <Image
                source={image}
                style={styles.productImage}
                resizeMode="cover"
              />
            </View>
          ))}
        </Swiper>

        {/* Free Delivery badge (left-bottom) */}
        <View style={styles.freeBadgeWrapper} pointerEvents="none">
            <View style={styles.freeBadge}>
              <View style={styles.freeIcon}>
                <FontAwesome name="truck" size={12} color="rgba(55, 121, 101, 1)" />
              </View>
              <Text style={styles.freeBadgeText}>FAST DELIVERY</Text>
            </View>
          {/** Example voucher pill next to it (kept visually similar to screenshot) */}
          {/* <View style={styles.voucherPill} pointerEvents="none">
            <Text style={styles.voucherText}>VOUCHER MAX</Text>
          </View> */}
        </View>

        {/* Photo count (right-bottom) */}
        <View style={styles.photoCountWrapper} pointerEvents="none">
          <View style={styles.photoCountBubble}>
            <Text style={styles.photoCountText}>{`${currentImageIndex + 1}/${totalImages}`}</Text>
          </View>
        </View>
      </View>
      
      {/* Product Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.productName}>{product.name}</Text>
        
        {/* Badges */}
        <View style={styles.badgesContainer}>
          {product.badges?.map((badge, index) => (
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
        <Text style={styles.addToCartButton}>Add to Cart</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 0,
    paddingHorizontal: 0,
  },
  imageContainer: {
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    aspectRatio: 1, 
    position: 'relative',
  },
  wrapper: {
    margin: 0,
    padding: 0,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    margin: 0,
    padding: 0,
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
    resizeMode: 'contain', // Ensures the entire image fits within the container
  },
  freeBadgeWrapper: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  freeBadge: {
    backgroundColor: 'rgba(55, 121, 101)',
    paddingHorizontal: 5,
    paddingVertical: 6,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  freeIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 3,
  },
  freeBadgeText: {
    color: '#fff',
    fontWeight: '700',
    letterSpacing: -0.5,
    fontSize: 12,
  },
  voucherPill: {
    marginLeft: 8,
    backgroundColor: '#ff2d78',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
  },
  voucherText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
  photoCountWrapper: {
    position: 'absolute',
    bottom: 12,
    right: 12,
  },
  photoCountBubble: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  photoCountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  infoContainer: {
    padding: 16,
    backgroundColor: '#fff',
    marginHorizontal: 0,
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
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});