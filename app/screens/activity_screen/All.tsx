import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const BASE_URL = process.env.EXPO_PUBLIC_APP_BASE_URL;

const { width: screenWidth } = Dimensions.get('window');

const scale = (size: number): number => (screenWidth / 375) * size;
const responsiveFontSize = (size: number): number => {
  const newSize = size * (screenWidth / 375);
  return Math.max(newSize, size * 0.85);
};

interface ActivityBanner {
  id: number;
  title: string;
  description: string;
  banner: string;
  created_at: string;
  updated_at: string;
}

const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
};

const ActivityCard = ({ item }: { item: ActivityBanner }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <View style={styles.iconWrapper}>
        <Ionicons name="notifications" size={18} color="#f39c12" />
      </View>

      <View style={{ flex: 1, marginLeft: scale(8) }}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDate}>{formatDate(item.created_at)}</Text>
      </View>
    </View>

    <Image
      source={{ uri: item.banner }}
      style={styles.cardImage}
      resizeMode="cover"
    />
    <Text style={styles.cardDesc}>{item.description}</Text>
  </View>
);

const TabScreen = () => {
  const [banners, setBanners] = useState<ActivityBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBanners = async () => {
    if (!BASE_URL) {
      setError('Base URL not configured.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${BASE_URL}/api/admin/activity-banners`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch activity banners.');
      }

      const data = await response.json();
      setBanners(data.banners ?? []);
    } catch (err) {
      console.error('Error fetching activity banners:', err);
      setError('Unable to load activities. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  if (loading) {
    return (
      <View style={styles.stateContainer}>
        <ActivityIndicator size="small" color="#f39c12" />
        <Text style={styles.stateText}>Loading activities...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.stateContainer}>
        <Text style={styles.stateText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchBanners}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (banners.length === 0) {
    return (
      <View style={styles.stateContainer}>
        <Text style={styles.stateText}>No activities available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={banners}
        keyExtractor={(item) => String(item.id)}
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
  stateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#fff',
  },
  stateText: {
    marginTop: 10,
    fontSize: responsiveFontSize(13),
    color: '#555',
    textAlign: 'center',
    fontFamily: 'PoppinsRegular',
  },
  retryButton: {
    marginTop: 12,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#f39c12',
  },
  retryButtonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: responsiveFontSize(13),
    fontFamily: 'PoppinsBold',
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
  cardImage: {
    width: '100%',
    height: scale(160),
    borderRadius: scale(10),
    marginBottom: scale(8),
  },
  cardDesc: {
    fontSize: responsiveFontSize(10),
    color: '#333',
    fontFamily: 'PoppinsRegular',
  },
});

export default TabScreen;
