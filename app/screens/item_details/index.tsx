import ProductCard from '@/app/components/item_details/ProductCard'
import ShopDetails from '@/app/components/item_details/ShopDetails'
import Vouchers from '@/app/components/item_details/Vouchers'
import { useLocalSearchParams } from 'expo-router'
import React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
// import { products } from '../../../data/productsData'
import MoreFromStore from '@/app/components/item_details/MoreFromStore'
import ProductDetails from '@/app/components/item_details/ProductDetails'
import Ratings from '@/app/components/item_details/Ratings'


const ItemDetailsScreen = () => {
  // const { itemId } = useLocalSearchParams();
  const { product } = useLocalSearchParams();
  
  
  const parsedProduct = product
    ? JSON.parse(product as string)
    : null;

  const storeId = parsedProduct?.store_id ?? parsedProduct?.store?.store_id;
  const storeName =
    parsedProduct?.store_name ?? parsedProduct?.store?.store_name ?? 'Store';
  const productName = parsedProduct?.name ?? parsedProduct?.product_name ?? 'Product';
  const productId = parsedProduct?.id ?? parsedProduct?.product_id;
  const productImage =
    typeof parsedProduct?.product_image === 'string'
      ? parsedProduct.product_image
      : typeof parsedProduct?.image === 'string'
        ? parsedProduct.image
        : typeof parsedProduct?.images?.[0] === 'string'
          ? parsedProduct.images[0]
          : undefined;
  console.log('Received storeId:', typeof(storeId));

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
        <Vouchers storeID={storeId} />
      </View>

      <View style={styles.sectionContainer}>
        <ShopDetails
          storeId={storeId}
          storeName={storeName}
          productName={productName}
          productImage={productImage}
          productId={productId}
        />
      </View>

      <View style={styles.sectionContainer}>
        <Ratings productId={productId} />
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