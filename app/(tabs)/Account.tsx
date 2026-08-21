import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { useCallback, useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../../firebaseConfig';
// IMPORT THE LOGIN PAGE
import LoginSignup from '../(auth)/LoginSignup';
import { useAuthStore } from '../stores/useAuthStore';

const { width: screenWidth } = Dimensions.get('window');
const scale = (size: number): number => (screenWidth / 375) * size;
const responsiveFontSize = (size: number): number => {
  const newSize = size * (screenWidth / 375);
  return Math.max(newSize, size * 0.85);
};
const BASEURL = process.env.EXPO_PUBLIC_APP_BASE_URL;
const Account = () => {
  // STATE TO CHECK LOGIN
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [followedStoresCount, setFollowedStoresCount] = useState(0);
  const [collectedVoucherCount, setCollectedVoucherCount] = useState(0);
  const profilePicture = useAuthStore((state) => state.user?.profilePicture);
  const [personalizedProducts, setPersonalizedProducts] = useState<any[]>([]);

  //GET STATS OF USER
  const getStats = useCallback(async (email: string) => {
    try {
      const res1 = await fetch(
        `${BASEURL}/api/user/followed_stores/${encodeURIComponent(email)}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
        },
      );
      const res2 = await fetch(
        `${BASEURL}/api/user/get_voucher/${encodeURIComponent(email)}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
        },
      );
      const data1 = await res1.json();
      const data2 = await res2.json();
      setFollowedStoresCount(data1.followedStores.length);
      setCollectedVoucherCount(data2.vouchers.length);
    } catch (err) {
      console.error('Error fetching search results:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        getStats(currentUser.email || '');
      }
    });
    return () => unsubscribe();
  }, [getStats]);

  useEffect(() => {
    const email = user?.email;
    if (!email) {
      setPersonalizedProducts([]);
      return;
    }

    const fetchPersonalizedProducts = async () => {
      try {
        const response = await fetch(`${BASEURL}/api/products/personalized`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();
        const raw = data?.products || data?.data?.products || data?.data || [];

        if (Array.isArray(raw)) {
          // Just grab the first 6 products, adapting your transformation lightly
          // without relying on undefined external helpers.
          const transformed = raw.map((p: any) => {
            const price = parseFloat(p.product_price ?? p.price ?? '0');
            const originalPrice = parseFloat(
              p.originalPrice ?? p.product_originalPrice ?? '0',
            );
            return {
              ...p,
              product_image: p.product_image || p.image,
              price: price,
              originalPrice: originalPrice > price ? originalPrice : undefined,
            };
          });
          const inStockProducts = transformed.filter(
            (p: any) =>
              p.product_stock === undefined || Number(p.product_stock) > 0,
          );
          setPersonalizedProducts(inStockProducts.slice(0, 6));
        } else {
          setPersonalizedProducts([]);
        }
      } catch (error) {
        console.error('Failed to fetch personalized products:', error);
        setPersonalizedProducts([]);
      }
    };

    fetchPersonalizedProducts();
  }, [user?.email]);

  const handleLogout = () => {
    signOut(auth).catch((_error) => {});
  };

  // IF NOT LOGGED IN, SHOW THE LOGIN PAGE
  if (!user && !loading) {
    return <LoginSignup onLogin={() => {}} />;
  }

  // IF LOGGED IN, SHOW THE FULL PROFILE
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* --- HEADER SECTION --- */}
        <View style={styles.headerContainer}>
          <View style={styles.topIcons}>
            <TouchableOpacity
              onPress={() => router.push('/screens/settings_screen')}
            >
              <Ionicons name="settings-outline" size={scale(22)} color="#333" />
            </TouchableOpacity>
            {/* Logout button */}
            <TouchableOpacity onPress={handleLogout} style={{ marginLeft: 15 }}>
              <Ionicons
                name="log-out-outline"
                size={scale(22)}
                color="#ff4d4f"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.profileRow}>
            <View style={styles.avatarContainer}>
              <Image
                source={
                  profilePicture
                    ? { uri: profilePicture }
                    : user?.photoURL
                      ? { uri: user.photoURL }
                      : require('../../assets/products/placeholder.jpg')
                }
                style={styles.profilePic}
              />
              <View style={styles.cameraIcon}>
                <Ionicons name="camera" size={scale(10)} color="white" />
              </View>
            </View>

            <View style={styles.profileInfo}>
              <Text style={styles.usernameText}>
                {user?.displayName || user?.email || 'Storevia User'}
              </Text>
              <Text style={styles.statsText}>
                Followed Stores ·{' '}
                <Text style={styles.boldStat}>{followedStoresCount}</Text>{' '}
                Vouchers ·{' '}
                <Text style={styles.boldStat}>{collectedVoucherCount}</Text>
              </Text>
            </View>
          </View>
        </View>

        {/* --- PROMO SECTION --- */}
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
                  <Text
                    style={{
                      color: '#f97316',
                      fontFamily: 'PoppinsBold',
                      fontWeight: 'bold',
                    }}
                  >
                    60% OFF
                  </Text>
                  {'\n'}with Gems
                </Text>
                <TouchableOpacity style={styles.collectBtn}>
                  <Text style={styles.btnText}>Collect</Text>
                </TouchableOpacity>
              </View>
              <Image
                source={{
                  uri: 'https://img.icons8.com/fluency/96/diamond.png',
                }}
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
                  <Text
                    style={{
                      color: '#f97316',
                      fontFamily: 'PoppinsBold',
                      fontWeight: 'bold',
                    }}
                  >
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

        {/* --- ORDERS SECTION --- */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Orders</Text>
            <TouchableOpacity
              onPress={() => router.push('/screens/my_orders_screen')}
            >
              <Text style={styles.viewAll}>View All Orders {'>'}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.orderIconsRow}>
            <OrderItem
              icon="wallet-outline"
              label="To Pay"
              onPress={() => router.push('/screens/my_orders_screen')}
            />
            <OrderItem
              icon="archive-outline"
              label="To Ship"
              onPress={() => router.push('/screens/my_orders_screen')}
            />
            <OrderItem
              icon="bus-outline"
              label="To Receive"
              onPress={() => router.push('/screens/my_orders_screen')}
            />
            <OrderItem
              icon="chatbox-ellipses-outline"
              label="To Review"
              badge={1}
              onPress={() => router.push('/screens/my_reviews_screen')}
            />
            <OrderItem
              icon="refresh-circle-outline"
              label="Returns"
              onPress={() => router.push('/screens/my_orders_screen')}
            />
          </View>

          {/* Review Banner */}
          <TouchableOpacity
            style={styles.reviewBanner}
            onPress={() => router.push('/screens/my_reviews_screen')}
          >
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

        {/* --- AD BANNER --- */}
        <View style={styles.bannerWrapper}>
          <Image
            source={require('../../assets/banners/banner2.jpg')}
            style={styles.adBanner}
            resizeMode="stretch"
          />
        </View>

        {/* --- RECENTLY VIEWED --- */}
        {user && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recently Viewed</Text>
              <TouchableOpacity>
                <Text style={styles.viewAll}>View More {'>'}</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {personalizedProducts.length > 0 ? (
                personalizedProducts.map((p, index) => {
                  const discount = p.originalPrice
                    ? `${Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)}%`
                    : undefined;
                  return (
                    <ProductCard
                      key={index}
                      title={p.product_name || p.name}
                      img={{
                        uri:
                          p.product_image || 'https://via.placeholder.com/150',
                      }}
                      price={p.price.toLocaleString()}
                      oldPrice={
                        p.originalPrice
                          ? p.originalPrice.toLocaleString()
                          : undefined
                      }
                      discount={discount}
                    />
                  );
                })
              ) : (
                <>
                  <ProductCard
                    title="Luxury Watch"
                    img={require('../../assets/products/watch.jpg')}
                    price="4,274"
                    oldPrice="17,096"
                    discount="75%"
                  />
                  <ProductCard
                    title="Leather Wallet"
                    img={require('../../assets/products/wallet.png')}
                    price="1,650"
                    oldPrice="3,000"
                    discount="30%"
                  />
                  <ProductCard
                    title="Gaming Laptop"
                    img={require('../../assets/products/laptop.jpg')}
                    price="145,455"
                    oldPrice="180,000"
                    discount="5%"
                  />
                </>
              )}
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

// --- SUB-COMPONENTS ---
const OrderItem = ({ icon, label, badge, onPress }: any) => (
  <TouchableOpacity style={styles.orderItem} onPress={onPress}>
    <View>
      <Ionicons name={icon} size={scale(24)} color="#f97316" />
      {badge && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}
    </View>
    <Text style={styles.orderLabel}>{label}</Text>
  </TouchableOpacity>
);

const ProductCard = ({ img, title, price, oldPrice, discount }: any) => (
  <View style={styles.productCard}>
    <View style={styles.imageContainer}>
      {discount ? (
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>-{discount}</Text>
        </View>
      ) : null}
      <Image source={img} style={styles.productImg} resizeMode="cover" />
    </View>
    <View style={styles.productInfo}>
      {title ? (
        <Text style={styles.productTitle} numberOfLines={2}>
          {title}
        </Text>
      ) : null}
      <View style={styles.priceRow}>
        <Text style={styles.priceText}>Rs {price}</Text>
        {oldPrice ? (
          <Text style={styles.oldPriceText}>Rs {oldPrice}</Text>
        ) : null}
      </View>
    </View>
  </View>
);

// --- STYLES ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, backgroundColor: '#F1F2F4' },
  scrollContent: { flexGrow: 1, backgroundColor: '#F1F2F4', paddingBottom: 16 },
  headerContainer: { backgroundColor: '#fff', padding: scale(15) },
  topIcons: { flexDirection: 'row', justifyContent: 'flex-end' },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: scale(10),
  },
  avatarContainer: { position: 'relative' },
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
  profileInfo: { marginLeft: scale(12) },
  usernameText: {
    fontSize: responsiveFontSize(18),
    fontWeight: 'bold',
    fontFamily: 'PoppinsBold',
    color: '#1a1c1e',
  },
  statsText: {
    fontSize: responsiveFontSize(12),
    color: '#888',
    marginTop: scale(2),
  },
  boldStat: { color: '#333', fontFamily: 'PoppinsBold', fontWeight: 'bold' },
  promoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: scale(10),
  },
  promoCard: {
    backgroundColor: '#fff',
    width: '49%',
    borderRadius: scale(10),
    borderWidth: 1,
    borderColor: '#e8e8e8',
    padding: scale(10),
  },
  promoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(8),
  },
  smallIcon: { width: scale(14), height: scale(14) },
  promoTitle: {
    fontFamily: 'PoppinsBold',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(12),
  },
  promoContentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  promoSubText: {
    fontSize: responsiveFontSize(12),
    color: '#333',
    marginBottom: scale(8),
  },
  promoImage: { width: scale(45), height: scale(45), marginLeft: 5 },
  collectBtn: {
    backgroundColor: '#f97316',
    paddingHorizontal: scale(10),
    paddingVertical: scale(3),
    borderRadius: scale(15),
    alignSelf: 'flex-start',
  },
  playBtn: {
    backgroundColor: '#f97316',
    paddingHorizontal: scale(12),
    paddingVertical: scale(3),
    borderRadius: scale(15),
    alignSelf: 'flex-start',
  },
  btnText: {
    color: '#fff',
    fontSize: responsiveFontSize(11),
    fontWeight: 'bold',
    fontFamily: 'PoppinsBold',
  },
  sectionCard: {
    backgroundColor: '#fff',
    marginHorizontal: scale(10),
    borderRadius: scale(10),
    borderWidth: 1,
    borderColor: '#e8e8e8',
    padding: scale(12),
    marginBottom: scale(10),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: scale(12),
  },
  sectionTitle: {
    fontFamily: 'PoppinsBold',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(13),
  },
  viewAll: { fontSize: responsiveFontSize(12), color: '#999' },
  orderIconsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  orderItem: { alignItems: 'center', width: '19%' },
  orderLabel: {
    fontSize: responsiveFontSize(10),
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
    fontSize: scale(9),
    fontFamily: 'PoppinsBold',
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
    fontSize: responsiveFontSize(12),
    fontWeight: 'bold',
    fontFamily: 'PoppinsBold',
    color: '#333',
  },
  reviewSubText: { color: '#999', fontSize: responsiveFontSize(12) },
  reviewBtn: {
    borderWidth: 1,
    borderColor: '#f97316',
    paddingHorizontal: scale(8),
    paddingVertical: scale(4),
    borderRadius: scale(4),
  },
  reviewBtnText: {
    color: '#f97316',
    fontSize: responsiveFontSize(11),
    fontWeight: 'bold',
    fontFamily: 'PoppinsBold',
  },
  bannerWrapper: { marginHorizontal: scale(10), marginBottom: scale(10) },
  adBanner: { width: '100%', height: scale(150), borderRadius: scale(8) },
  productCard: {
    width: scale(120),
    marginRight: scale(12),
    backgroundColor: '#fff',
    borderRadius: scale(8),
    borderWidth: 1,
    borderColor: '#f0f0f0',
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: scale(110),
    backgroundColor: '#f9f9f9',
    position: 'relative',
  },
  productImg: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: scale(6),
    left: scale(6),
    backgroundColor: '#f97316',
    paddingHorizontal: scale(6),
    paddingVertical: scale(2),
    borderRadius: scale(4),
    zIndex: 1,
  },
  discountText: {
    color: '#fff',
    fontSize: responsiveFontSize(10),
    fontWeight: 'bold',
    fontFamily: 'PoppinsBold',
  },
  productInfo: {
    padding: scale(8),
  },
  productTitle: {
    fontSize: responsiveFontSize(11),
    color: '#333',
    marginBottom: scale(4),
    lineHeight: scale(14),
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  priceText: {
    fontSize: responsiveFontSize(12),
    fontWeight: 'bold',
    fontFamily: 'PoppinsBold',
    color: '#f97316',
    marginRight: scale(4),
  },
  oldPriceText: {
    fontSize: responsiveFontSize(10),
    color: '#999',
    textDecorationLine: 'line-through',
  },
});

export default Account;
