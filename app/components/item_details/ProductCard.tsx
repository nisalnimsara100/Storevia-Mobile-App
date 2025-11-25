import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

interface ProductCardProps {
  product: {
    image: any;
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
  return (
    <View>
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
    backgroundColor: '#fff',
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