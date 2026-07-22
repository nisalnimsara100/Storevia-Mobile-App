import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface StoreProduct {
  id: number;
  name: string;
  image: any;
  images: any[];
  price: number;
  oldPrice?: number;
  discount?: number;
  stock: number;
  rating?: number;
  reviews?: number;
  sold?: number;
  tag?: string;
  description: string;
}

const STORE_PRODUCTS: StoreProduct[] = [
  {
    id: 101,
    name: '10000mAh Mini Fast Charging Power Bank',
    image: require('../../../assets/products/tab.jpg'),
    images: [require('../../../assets/products/tab.jpg')],
    price: 4590,
    oldPrice: 5900,
    discount: 22,
    stock: 24,
    rating: 4.8,
    reviews: 340,
    sold: 1200,
    tag: 'Bestseller',
    description: 'Compact 10000mAh power bank with 22.5W fast charging support.',
  },
  {
    id: 102,
    name: '15W Wireless Charging Pad',
    image: require('../../../assets/products/phone.jpg'),
    images: [require('../../../assets/products/phone.jpg')],
    price: 2450,
    oldPrice: 3200,
    discount: 23,
    stock: 15,
    rating: 4.6,
    reviews: 512,
    sold: 980,
    description: 'Slim wireless charging pad compatible with all Qi-enabled devices.',
  },
  {
    id: 103,
    name: 'USB-C Hub 6-in-1 Adapter',
    image: require('../../../assets/products/laptop.jpg'),
    images: [require('../../../assets/products/laptop.jpg')],
    price: 3600,
    stock: 9,
    rating: 4.9,
    reviews: 128,
    sold: 430,
    tag: 'New',
    description: '6-in-1 USB-C hub with HDMI, USB 3.0 and fast charging pass-through.',
  },
  {
    id: 104,
    name: 'Magnetic Neckband Bluetooth Earphones',
    image: require('../../../assets/products/watch.jpg'),
    images: [require('../../../assets/products/watch.jpg')],
    price: 1990,
    oldPrice: 2500,
    discount: 20,
    stock: 32,
    rating: 4.7,
    reviews: 875,
    sold: 2400,
    description: 'Sweat-resistant Bluetooth 5.0 neckband earphones with deep bass.',
  },
  {
    id: 105,
    name: '65W Fast Charging Cable & Adapter Set',
    image: require('../../../assets/products/wallet.png'),
    images: [require('../../../assets/products/wallet.png')],
    price: 1250,
    stock: 50,
    rating: 4.5,
    reviews: 96,
    sold: 310,
    description: 'Durable braided cable with 65W wall adapter for rapid charging.',
  },
  {
    id: 106,
    name: 'Laptop Sleeve 15.6" Water Resistant',
    image: require('../../../assets/products/WhatsApp Image 2025-08-02 at 13.31.12_cfe1f534.jpg'),
    images: [require('../../../assets/products/WhatsApp Image 2025-08-02 at 13.31.12_cfe1f534.jpg')],
    price: 1800,
    stock: 18,
    rating: 4.4,
    reviews: 60,
    sold: 145,
    description: 'Padded, water-resistant sleeve that fits laptops up to 15.6 inches.',
  },
];

const MoreFromStore = () => {
  const router = useRouter();

  const handlePress = (item: StoreProduct) => {
    router.push({
      pathname: '/screens/item_details',
      params: { product: JSON.stringify(item) },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>More from Store</Text>
        <TouchableOpacity style={styles.viewAllBtn} activeOpacity={0.7}>
          <Text style={styles.viewAllText}>View All</Text>
          <Ionicons name="chevron-forward" size={15} color="#888" />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardsRow}
      >
        {STORE_PRODUCTS.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => handlePress(item)}
          >
            <View style={styles.imageWrap}>
              <Image source={item.image} style={styles.image} resizeMode="contain" />
              {item.tag && (
                <View style={styles.tagBadge}>
                  <Text style={styles.tagBadgeText}>{item.tag}</Text>
                </View>
              )}
            </View>

            <Text style={styles.name} numberOfLines={2}>
              {item.name}
            </Text>

            <View style={styles.priceRow}>
              <Text style={styles.price}>Rs.{item.price.toLocaleString()}</Text>
            </View>
            {item.oldPrice && (
              <View style={styles.oldPriceRow}>
                <Text style={styles.oldPrice}>Rs.{item.oldPrice.toLocaleString()}</Text>
                {item.discount && <Text style={styles.discount}>-{item.discount}%</Text>}
              </View>
            )}

            {item.rating && (
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={12} color="#FFC107" />
                <Text style={styles.ratingText}>
                  {item.rating} ({item.reviews})
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default MoreFromStore;

const CARD_WIDTH = 140;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginHorizontal: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 13,
    color: '#888',
    marginRight: 2,
  },
  cardsRow: {
    paddingRight: 4,
  },
  card: {
    width: CARD_WIDTH,
    marginRight: 12,
  },
  imageWrap: {
    width: CARD_WIDTH,
    height: 110,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  tagBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: '#FFC107',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderBottomRightRadius: 6,
  },
  tagBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#222',
  },
  name: {
    fontSize: 12.5,
    color: '#333',
    marginTop: 8,
    lineHeight: 17,
    minHeight: 34,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    color: '#e53935',
  },
  oldPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  oldPrice: {
    fontSize: 11,
    color: '#999',
    textDecorationLine: 'line-through',
    marginRight: 6,
  },
  discount: {
    fontSize: 11,
    color: '#43a047',
    fontWeight: '600',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 11,
    color: '#999',
  },
});
