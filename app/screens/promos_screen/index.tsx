import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import promotions data from existing JSON
import messagesData from '../../../data/messagesData.json';

const PromosScreen: React.FC = () => {
  const [promotions, setPromotions] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadPromotions();
  }, []);

  const loadPromotions = async () => {
    setRefreshing(true);
    try {
      const data: any = messagesData;
      const customer = data.existingCustomer || data.newCustomer || null;
      const promos = (customer && customer.promotions) || data.promotionTemplates || [];

      // Attach image source, aspectRatio and a bounded imageHeight for each promo
      const mapped = await Promise.all(
        promos.map(async (p: any, idx: number) => {
          // If the promo already contains an `image` field use it, otherwise fallback to banner1.jpg
          // Normalize source to either a local module (number) or an object with `{ uri }`
          let source: any = p.image ? p.image : require('../../../assets/banners/banner1.jpg');
          if (typeof source === 'string') {
            // convert raw URL string to { uri }
            source = { uri: source };
          }

          let aspectRatio = 16 / 7; // default fallback

          try {
            // Local module (require(...)) usually becomes a number; resolveAssetSource returns width/height
            if (typeof source === 'number') {
              const resolved = Image.resolveAssetSource(source as any);
              if (resolved && resolved.width && resolved.height) {
                aspectRatio = resolved.width / resolved.height;
              }
            } else if (source && source.uri && typeof source.uri === 'string') {
              // Remote image (or object with uri) — get its size
              const uri = source.uri;
              const size = await new Promise<{ width: number; height: number }>((resolve, reject) => {
                Image.getSize(
                  uri,
                  (w, h) => resolve({ width: w, height: h }),
                  (err) => reject(err)
                );
              });
              if (size && size.width && size.height) {
                aspectRatio = size.width / size.height;
              }
            }
          } catch (err) {
            console.warn('Failed to resolve image size for promo', p.title, err);
          }

          // Compute a concrete height using screen width and aspect ratio, then clamp it
          const screenWidth = Dimensions.get('window').width;
          // margins: promoMessageContainer margin 12 (left+right) and promoImageWrapper margin 12 (left+right)
          const horizontalMargins = 12 + 12 + 12 + 12; // safe estimate to ensure image fits within card padding
          const imageWidth = Math.max(0, screenWidth - horizontalMargins);
          const MAX_IMAGE_HEIGHT = 120; // lower cap to reduce visible image height
          const finalAspect = aspectRatio || 16 / 7;
          const computedHeight = Math.max(0, Math.round(imageWidth / finalAspect));
          const imageHeight = Math.min(computedHeight || MAX_IMAGE_HEIGHT, MAX_IMAGE_HEIGHT);

          return { ...p, image: source, aspectRatio: finalAspect, imageHeight };
        })
      );

      setPromotions(mapped);
    } catch (e) {
      console.warn('Failed to load promotions', e);
      setPromotions([]);
    } finally {
      setRefreshing(false);
    }
  };

  const handlePress = (item: any) => {
    // temporary placeholder action
    console.log('Pressed promo', item.title || item);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity>
          <Text style={styles.markAsReadText}>🧾 Mark all as read</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity style={styles.tab}>
          <View style={[styles.tabIcon, { backgroundColor: '#04C897' }]}>
            <Ionicons name="chatbubble" size={20} color="white" />
          </View>
          <Text style={styles.tabText}>Chats</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tab}>
          <View style={[styles.tabIcon, { backgroundColor: '#2B83FF' }]}>
            <Ionicons name="receipt" size={20} color="white" />
          </View>
          <Text style={styles.tabText}>Orders</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tab}>
          <View style={[styles.tabIcon, { backgroundColor: '#F6A800' }]}>
            <Ionicons name="notifications" size={20} color="white" />
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>14</Text>
            </View>
          </View>
          <Text style={styles.tabText}>Activities</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tab}>
          <View style={[styles.tabIcon, { backgroundColor: '#FF4C99' }]}>
            <Ionicons name="megaphone" size={20} color="white" />
            <View style={styles.notificationDot} />
          </View>
          <Text style={styles.tabText}>Promos</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadPromotions} />}
      >
        <View style={styles.lastDaysHeader}>
          <Text style={styles.lastDaysText}>Last 7 days</Text>
        </View>

        {promotions.map((p, idx) => (
          <TouchableOpacity
            key={p.id ?? idx}
            style={styles.promoMessageContainer}
            onPress={() => handlePress(p)}
          >
            <View style={styles.promoHeader}>
              <View style={styles.promoIconContainer}>
                <Ionicons name="megaphone" size={18} color="#FF9800" />
              </View>
              <View style={styles.titleColumn}>
                <Text style={styles.promoTitle} numberOfLines={2}>
                  {p.title}
                </Text>
                <Text style={styles.messageDate}>{p.date || 'Yesterday'}</Text>
              </View>
            </View>

            <View style={styles.promoImageWrapper}>
              <Image
                source={p.image ? p.image : require('../../../assets/banners/banner1.jpg')}
                style={[styles.promoBanner, { height: p.imageHeight ?? 100, maxHeight: 140 }]}
                resizeMode="cover"
              />
            </View>

            <Text style={styles.promoFooter}>{p.footerText || ''}</Text>
          </TouchableOpacity>
        ))}
        
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#111827' },
  markAsReadText: { color: '#6B7280', fontSize: 14 },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 14,
    backgroundColor: '#FAFAFA',
  },
  tab: { alignItems: 'center', flex: 1 },
  tabIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    position: 'relative',
  },
  tabText: { fontSize: 12, color: '#6B7280' },
  notificationDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF3B30',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  countBadge: {
    position: 'absolute',
    top: -6,
    right: -10,
    backgroundColor: '#FF3B30',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
  },
  countBadgeText: { color: 'white', fontSize: 12, fontWeight: '700' },
  messagesContainer: { flex: 1 },
  lastDaysHeader: { paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#F6F6F6' },
  lastDaysText: { color: '#6B7280', fontSize: 14, fontWeight: '600' },
  promoMessageContainer: {
    margin: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  promoHeader: { flexDirection: 'row', alignItems: 'center', padding: 12 },
  promoIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF5F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  promoTitle: { fontSize: 15, fontWeight: '700', color: '#111827', flex: 1 },
  // title column groups title + date so date aligns naturally under the title
  titleColumn: { flex: 1 },
  messageDate: { fontSize: 12, color: '#9CA3AF', marginTop: 6, marginBottom: 8 },
  promoImageContainer: { margin: 12, borderRadius: 10, padding: 14 },
  promoContent: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  promoFooter: { padding: 12, color: '#6B7280', fontSize: 13 },
  promoImageWrapper: { margin: 12, borderRadius: 10, overflow: 'hidden' },
  promoBanner: { width: '100%' },
});

export default PromosScreen;

