import React from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');

const scale = (size: number): number => (screenWidth / 375) * size;
const responsiveFontSize = (size: number): number => {
  const newSize = size * (screenWidth / 375);
  return Math.max(newSize, size * 0.85);
};

// Activities list with LOCAL product image
const activities = [
  {
    id: '1',
    title: 'Your order has arrived! Need assistance? Tap here.',
    date: '20/09/2025',
    desc: 'Great news! Your order has been delivered successfully. We hope you enjoy your purchase. Thank you for shopping with Storevia.',
    image: require('../../../assets/products/WhatsApp Image 2025-08-02 at 13.31.12_cfe1f534.jpg'),
  },
  {
    id: '2',
    title: 'Your order has arrived! Need assistance? Tap here.',
    date: '20/09/2025',
    desc: 'Great news! Your order has been delivered successfully. We hope you enjoy your purchase. Thank you for shopping with Storevia.',
    image: require('../../../assets/products/WhatsApp Image 2025-08-02 at 13.31.12_cfe1f534.jpg'),
  },
  {
    id: '3',
    title: 'Your order has arrived! Need assistance? Tap here.',
    date: '20/09/2025',
    desc: 'Great news! Your order has been delivered successfully. We hope you enjoy your purchase. Thank you for shopping with Storevia.',
    image: require('../../../assets/products/WhatsApp Image 2025-08-02 at 13.31.12_cfe1f534.jpg'),
  },
  {
    id: '4',
    title: 'Your order has arrived! Need assistance? Tap here.',
    date: '20/09/2025',
    desc: 'Great news! Your order has been delivered successfully. We hope you enjoy your purchase. Thank you for shopping with Storevia.',
    image: require('../../../assets/products/WhatsApp Image 2025-08-02 at 13.31.12_cfe1f534.jpg'),
  },
];

const ActivityCard = ({ item }: { item: any }) => (
  <View style={styles.card}>
   
    <View style={styles.cardHeader}>
      <View style={styles.iconWrapper}>
        <Ionicons name="notifications" size={18} color="#f39c12" />
      </View>
      <View style={{ flex: 1, marginLeft: scale(8) }}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDate}>{item.date}</Text>
      </View>
    </View>

   
    <View style={styles.bodyBox}>
      <Image source={item.image} style={styles.smallImage} />
      <Text style={styles.cardDesc}>{item.desc}</Text>
    </View>
  </View>
);

const TabScreen = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={activities}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ActivityCard item={item} />}
        contentContainerStyle={{ paddingBottom: scale(40) }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  card: {
    marginBottom: scale(16),
    backgroundColor: '#fff',
    borderRadius: scale(12),
    padding: scale(10),
    borderWidth: 1,
    borderColor: '#eee',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: scale(8),
  },
  iconWrapper: {
    width: scale(28),
    height: scale(28),
    borderRadius: scale(14),
    backgroundColor: '#FFF5E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(6),
    marginTop: scale(6),
  },
  bodyBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F7F7F7',
    padding: scale(10),
    borderRadius: scale(8),
  },
  smallImage: {
    width: scale(54),
    height: scale(54),
    borderRadius: scale(27), 
    marginRight: scale(10),
  },
  cardTitle: {
    fontSize: responsiveFontSize(12),
    fontWeight: '400',
    color: '#000',
    fontFamily: 'PoppinsBold',
  },
  cardDate: {
    fontSize: responsiveFontSize(10),
    color: '#999',
    fontFamily: 'PoppinsRegular',
  },
  cardDesc: {
    flex: 1,
    fontSize: responsiveFontSize(10),
    color: '#333',
    fontFamily: 'PoppinsRegular',
  },
});

export default TabScreen;
