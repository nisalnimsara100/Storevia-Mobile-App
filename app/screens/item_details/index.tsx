import ShopDetails from '@/app/components/item_details/ShopDetails'
import ProductCard from '@/app/components/item_details/ProductCard'
import Vouchers from '@/app/components/item_details/Vouchers'
import { useLocalSearchParams } from 'expo-router'
import React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { products } from '../../../data/productsData'
import Ratings from '@/app/components/item_details/Ratings'

const ItemDetailsScreen = () => {
  const { itemId } = useLocalSearchParams();
  
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

      <View style={styles.sectionContainer}>
        <Ratings />
      </View>
    </ScrollView>
  );
}

export default ItemDetailsScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(248, 249, 249, 1)',
    paddingHorizontal: 0,
    marginBottom: 40,
  },
  errorText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginTop: 100,
  },
  sectionContainer: {
    marginTop: 10,
    backgroundColor: '#fff',
    marginHorizontal: -20,
  },
})