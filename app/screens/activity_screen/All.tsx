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

const activities = [
  {
    id: '1',
    title: 'Turn Gems Into Discounts💎',
    date: 'Yesterday',
    desc: 'Toggle ON & enjoy up to 20% OFF now!🔥',
    banner: require('../../../assets/banners/banner1.jpg'),
  },
  {
    id: '2',
    title: 'Level Up Savings With Gems!💎',
    date: '29/09/2025',
    desc: 'Payday Alert: Collect Gems💎 Save Up to 40%! 🔥',
    banner: require('../../../assets/banners/banner2.jpg'),
  },
  {
    id: '3',
    title: 'Level Up Savings With Gems!💎',
    date: '28/09/2025',
    desc: 'Payday Alert: Collect Gems💎 Save Up to 40%! 🔥',
    banner: require('../../../assets/banners/banner1.jpg'),
  },
  {
    id: '4',
    title: 'Level Up Savings With Gems!💎',
    date: '28/09/2025',
    desc: 'Payday Alert: Collect Gems💎 Save Up to 40%! 🔥',
    banner: require('../../../assets/banners/banner2.jpg'),
  },
];

const ActivityCard = ({ item }: { item: any }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <View style={styles.iconWrapper}>
        <Ionicons name="notifications" size={18} color="#f39c12" />
        {item.id === '1' && <View style={styles.redDot} />}
      </View>

      <View style={{ flex: 1, marginLeft: scale(8) }}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDate}>{item.date}</Text>
      </View>
    </View>

    <Image source={item.banner} style={styles.cardImage} resizeMode="cover" />
    <Text style={styles.cardDesc}>{item.desc}</Text>
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
    alignItems: 'center',
    marginBottom: scale(8),

  },
  iconWrapper: {
    width: scale(28),
    height: scale(28),
    borderRadius: scale(14),
    backgroundColor: '#FFF5E6',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  redDot: {
    position: 'absolute',
    top: scale(-2),
    right: scale(-2),
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
    backgroundColor: 'red',
  },
  cardTitle: {
    fontSize: responsiveFontSize(12),
    fontWeight: '400',
    color: '#000',
    fontFamily: "PoppinsBold",
  },
  cardDate: {
    fontSize: responsiveFontSize(10),
    color: '#999',
    fontFamily: "PoppinsRegular",
  },
  cardImage: {
    width: '100%',
    height: scale(160),
    borderRadius: scale(10),
    marginBottom: scale(8),
  },
  cardDesc: {
    fontSize: responsiveFontSize(10),
    color: '#333',
    fontFamily: "PoppinsRegular",
    
  },
});

export default TabScreen;
