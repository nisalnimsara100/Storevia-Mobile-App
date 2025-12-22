import ShopDetails from '@/app/components/item_details/ShopDetails'
import ProductCard from '@/app/components/item_details/ProductCard'
import Vouchers from '@/app/components/item_details/Vouchers'
import { useLocalSearchParams } from 'expo-router'
import React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
// import { products } from '../../../data/productsData'
import Ratings from '@/app/components/item_details/Ratings'
import ProductDetails from '@/app/components/item_details/ProductDetails'
import MoreFromStore from '@/app/components/item_details/MoreFromStore'


const ItemDetailsScreen = () => {
  // const { itemId } = useLocalSearchParams();
  const { product } = useLocalSearchParams();
  
  
  const parsedProduct = product
    ? JSON.parse(product as string)
    : null;

  if (!parsedProduct) {
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
      <ProductCard product={parsedProduct} />

      <View style={styles.sectionContainer}>
        <Vouchers />
      </View>

      <View style={styles.sectionContainer}>
        <ShopDetails />
      </View>

      <View style={styles.sectionContainer}>
        <Ratings />
      </View>

      <View style={styles.sectionContainer}>
        <MoreFromStore />
      </View>

      <View style={styles.sectionContainer}>
        <ProductDetails />
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