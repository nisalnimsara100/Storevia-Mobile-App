import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const scale = (size: number): number => (screenWidth / 375) * size;

const responsiveFontSize = (size: number): number => {
  const newSize = size * (screenWidth / 375);
  return Math.max(newSize, size * 0.85);
};

const Account = () => {
  const [username] = useState('Ashen Widanagamage');

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.headerContainer}>
        <View style={styles.topIcons}>
          <TouchableOpacity
            onPress={() => router.push('/screens/settings_screen')}
          >
            <Ionicons name="settings-outline" size={scale(22)} color="#333" />
          </TouchableOpacity>
        </View>

        <View style={styles.profileRow}>
          <View style={styles.avatarContainer}>
            <Image
              source={require('../../assets/products/WhatsApp Image 2025-08-02 at 13.31.12_cfe1f534.jpg')}
              style={styles.profilePic}
            />
            <View style={styles.cameraIcon}>
              <Ionicons name="camera" size={scale(10)} color="white" />
            </View>
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.usernameText}>{username}</Text>
            <Text style={styles.statsText}>
              Wishlist · <Text style={styles.boldStat}>0</Text> FollowedStores ·{' '}
              <Text style={styles.boldStat}>0</Text> Vouchers ·{' '}
              <Text style={styles.boldStat}>0</Text>
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.promoRow}>
        <View style={styles.promoCard}>
          <View style={styles.promoHeader}>
            <Image
              source={{ uri: 'https://img.icons8.com/color/48/ruby.png' }}
              style={styles.smallIcon}
            />
            <Text style={styles.promoTitle}> Storevia Gems</Text>
          </View>

          <View style={styles.promoContentRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.promoSubText}>
                Enjoy{' '}
                <Text style={{ color: '#f36d21', fontWeight: 'bold' }}>
                  60% OFF
                </Text>
                {'\n'}with Gems
              </Text>
              <TouchableOpacity style={styles.collectBtn}>
                <Text style={styles.btnText}>Collect</Text>
              </TouchableOpacity>
            </View>
            <Image
              source={{ uri: 'https://img.icons8.com/fluency/96/diamond.png' }}
              style={styles.promoImage}
            />
          </View>
        </View>

        <View style={styles.promoCard}>
          <View style={styles.promoHeader}>
            <Image
              source={{ uri: 'https://img.icons8.com/color/48/gift--v1.png' }}
              style={styles.smallIcon}
            />
            <Text style={styles.promoTitle}> Storevia Freebie</Text>
          </View>

          <View style={styles.promoContentRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.promoSubText}>
                Share, Invite &{'\n'}Win{' '}
                <Text style={{ color: '#f36d21', fontWeight: 'bold' }}>
                  Free Prizes!
                </Text>
              </Text>
              <TouchableOpacity style={styles.playBtn}>
                <Text style={styles.btnText}>Play</Text>
              </TouchableOpacity>
            </View>
            <Image
              source={{ uri: 'https://img.icons8.com/fluency/96/gift.png' }}
              style={styles.promoImage}
            />
          </View>
        </View>
      </View>

      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Orders</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>View All Orders {'>'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.orderIconsRow}>
          <OrderItem icon="wallet-outline" label="To Pay" />
          <OrderItem icon="archive-outline" label="To Ship" />
          <OrderItem icon="bus-outline" label="To Receive" />
          <OrderItem
            icon="chatbox-ellipses-outline"
            label="To Review"
            badge={1}
          />
          <OrderItem icon="refresh-circle-outline" label="Returns" />
        </View>

        <TouchableOpacity style={styles.reviewBanner}>
          <Image
            source={{ uri: 'https://img.icons8.com/fluency/96/box.png' }}
            style={styles.reviewThumb}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.reviewText}>Review your purchase today!</Text>
            <Text style={styles.reviewSubText}>
              Share your review with others...
            </Text>
          </View>
          <View style={styles.reviewBtn}>
            <Text style={styles.reviewBtnText}>Review Now</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.bannerWrapper}>
        <Image
          source={require('../../assets/banners/banner2.jpg')}
          style={styles.adBanner}
          resizeMode="stretch"
        />
      </View>

      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recently Viewed</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>View More {'>'}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <ProductCard
            img={require('../../assets/products/watch.jpg')}
            price="4,274"
            oldPrice="17,096"
            discount="75%"
          />
          <ProductCard
            img={require('../../assets/products/wallet.png')}
            price="1,650"
            oldPrice="3,000"
            discount="30%"
          />
          <ProductCard
            img={require('../../assets/products/laptop.jpg')}
            price="145,455"
            oldPrice="180,000"
            discount="5%"
          />
        </ScrollView>
      </View>

      <View style={styles.gridContainer}>
        <GridTool
          img="https://img.icons8.com/fluency/96/mail.png"
          label="My Messages"
        />
        <GridTool
          img="https://img.icons8.com/color/96/low-price.png"
          label="Everyday Low Price"
        />
        <GridTool
          img="https://img.icons8.com/fluency/48/box.png"
          label="Pickup Points"
        />
        <GridTool
          img="https://img.icons8.com/color/96/wallet.png"
          label="PayLater"
        />
        <GridTool
          img="https://img.icons8.com/fluency/96/help.png"
          label="Help Center"
        />
        <GridTool
          img="https://img.icons8.com/fluency/96/customer-support.png"
          label="Contact Care"
        />
        <GridTool
          img="https://img.icons8.com/fluency/96/star.png"
          label="My Reviews"
        />
        <GridTool
          img="https://img.icons8.com/fluency/96/groups.png"
          label="My Affiliates"
        />
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const OrderItem = ({ icon, label, badge }: any) => (
  <TouchableOpacity style={styles.orderItem}>
    <View>
      <Ionicons name={icon} size={scale(24)} color="#f36d21" />
      {badge && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}
    </View>
    <Text style={styles.orderLabel}>{label}</Text>
  </TouchableOpacity>
);

const ProductCard = ({ img, price, oldPrice, discount }: any) => (
  <View style={styles.productCard}>
    <View style={styles.discountBadge}>
      <Text style={styles.discountText}>↓ {discount}</Text>
    </View>

    <Image source={img} style={styles.productImg} />
    <Text style={styles.priceText}>Rs {price}</Text>
    <Text style={styles.oldPriceText}>Rs {oldPrice}</Text>
  </View>
);

const GridTool = ({ img, label }: any) => (
  <TouchableOpacity style={styles.gridItem}>
    <Image source={{ uri: img }} style={styles.gridImg} />
    <Text style={styles.gridLabel}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F2F4',
  },

  headerContainer: {
    backgroundColor: '#fff',
    padding: scale(15),
    paddingTop: scale(40),
  },

  topIcons: {
    alignSelf: 'flex-end',
  },

  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: scale(10),
  },

  avatarContainer: {
    position: 'relative',
  },

  profilePic: {
    width: scale(55),
    height: scale(55),
    borderRadius: scale(30),
    backgroundColor: '#eee',
  },

  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#555',
    borderRadius: scale(10),
    padding: scale(2),
  },

  profileInfo: {
    marginLeft: scale(12),
  },

  usernameText: {
    fontSize: responsiveFontSize(18),
    fontWeight: 'bold',
    color: '#1a1c1e',
  },

  statsText: {
    fontSize: responsiveFontSize(10),
    color: '#888',
    marginTop: scale(2),
  },

  boldStat: {
    color: '#333',
    fontWeight: 'bold',
  },

  promoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: scale(10),
  },

  promoCard: {
    backgroundColor: '#fff',
    width: '49%',
    borderRadius: scale(8),
    padding: scale(10),
  },

  promoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(8),
  },

  smallIcon: {
    width: scale(14),
    height: scale(14),
  },

  promoTitle: {
    fontWeight: 'bold',
    fontSize: responsiveFontSize(11),
  },

  promoContentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  promoSubText: {
    fontSize: responsiveFontSize(9),
    color: '#333',
    marginBottom: scale(8),
  },

  promoImage: {
    width: scale(45),
    height: scale(45),
    marginLeft: 5,
  },

  collectBtn: {
    backgroundColor: '#f36d21',
    paddingHorizontal: scale(10),
    paddingVertical: scale(3),
    borderRadius: scale(15),
    alignSelf: 'flex-start',
  },

  playBtn: {
    backgroundColor: '#f36d21',
    paddingHorizontal: scale(12),
    paddingVertical: scale(3),
    borderRadius: scale(15),
    alignSelf: 'flex-start',
  },

  btnText: {
    color: '#fff',
    fontSize: responsiveFontSize(9),
    fontWeight: 'bold',
  },

  sectionCard: {
    backgroundColor: '#fff',
    marginHorizontal: scale(10),
    borderRadius: scale(8),
    padding: scale(12),
    marginBottom: scale(10),
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: scale(12),
  },

  sectionTitle: {
    fontWeight: 'bold',
    fontSize: responsiveFontSize(13),
  },

  viewAll: {
    fontSize: responsiveFontSize(10),
    color: '#999',
  },

  orderIconsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  orderItem: {
    alignItems: 'center',
    width: '19%',
  },

  orderLabel: {
    fontSize: responsiveFontSize(8.5),
    textAlign: 'center',
    marginTop: scale(5),
    color: '#333',
  },

  badge: {
    position: 'absolute',
    right: scale(-4),
    top: scale(-4),
    backgroundColor: '#ff4d4f',
    borderRadius: scale(8),
    width: scale(14),
    height: scale(14),
    justifyContent: 'center',
    alignItems: 'center',
  },

  badgeText: {
    color: 'white',
    fontSize: scale(8),
    fontWeight: 'bold',
  },

  reviewBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: scale(15),
    paddingTop: scale(10),
    borderTopWidth: 0.5,
    borderTopColor: '#eee',
  },

  reviewThumb: {
    width: scale(35),
    height: scale(35),
    marginRight: scale(10),
    borderRadius: 4,
  },

  reviewText: {
    fontSize: responsiveFontSize(11),
    fontWeight: 'bold',
    color: '#333',
  },

  reviewSubText: {
    color: '#999',
    fontSize: responsiveFontSize(9),
  },

  reviewBtn: {
    borderWidth: 1,
    borderColor: '#f36d21',
    paddingHorizontal: scale(8),
    paddingVertical: scale(4),
    borderRadius: scale(4),
  },

  reviewBtnText: {
    color: '#f36d21',
    fontSize: responsiveFontSize(9),
    fontWeight: 'bold',
  },

  bannerWrapper: {
    marginHorizontal: scale(10),
    marginBottom: scale(10),
  },

  adBanner: {
    width: '100%',
    height: scale(150),
    borderRadius: scale(8),
  },

  productCard: {
    width: scale(95),
    marginRight: scale(15),
  },

  productImg: {
    width: scale(95),
    height: scale(95),
    borderRadius: 4,
    backgroundColor: '#f9f9f9',
  },

  discountBadge: {
    position: 'absolute',
    top: 5,
    left: 5,
    backgroundColor: '#ff4d4f',
    paddingHorizontal: 4,
    borderRadius: 2,
    zIndex: 1,
  },

  discountText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: 'bold',
  },

  priceText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#ff4d4f',
    marginTop: 5,
  },

  oldPriceText: {
    fontSize: 9,
    color: '#999',
    textDecorationLine: 'line-through',
  },

  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#fff',
    marginHorizontal: scale(10),
    borderRadius: scale(8),
    paddingVertical: scale(12),
  },

  gridItem: {
    width: '25%',
    alignItems: 'center',
    paddingVertical: scale(10),
  },

  gridImg: {
    width: scale(26),
    height: scale(26),
    marginBottom: scale(8),
  },

  gridLabel: {
    fontSize: responsiveFontSize(8.5),
    textAlign: 'center',
    color: '#333',
  },
});

export default Account;
