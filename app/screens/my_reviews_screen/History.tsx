import { useReviewsStore } from '@/app/stores/useReviewsStore';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

const StarRow = ({ rating }: { rating: number }) => (
  <View style={{ flexDirection: 'row' }}>
    {Array.from({ length: 5 }).map((_, i) => (
      <Ionicons
        key={i}
        name="star"
        size={13}
        color={i < rating ? '#FFC107' : '#E0E0E0'}
        style={{ marginRight: 1 }}
      />
    ))}
  </View>
);

const History = () => {
  const submittedReviews = useReviewsStore((state) => state.submittedReviews);

  if (submittedReviews.length === 0) {
    return (
      <View style={styles.stateContainer}>
        <Ionicons name="time-outline" size={40} color="#ccc" />
        <Text style={styles.stateText}>You haven&apos;t written any reviews yet.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {submittedReviews.map((review) => (
        <View key={review.key} style={styles.card}>
          <View style={styles.productRow}>
            <Image source={{ uri: review.productImage }} style={styles.productImage} />
            <View style={styles.productInfo}>
              <Text style={styles.productName} numberOfLines={2}>
                {review.productName}
              </Text>
              <StarRow rating={review.rating} />
            </View>
          </View>

          {review.comment.length > 0 && <Text style={styles.comment}>{review.comment}</Text>}

          {review.images.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagesRow}>
              {review.images.map((uri, idx) => (
                <Image key={idx} source={{ uri }} style={styles.reviewImage} />
              ))}
            </ScrollView>
          )}

          <View style={styles.footerRow}>
            <Text style={styles.gemsEarned}>+{review.gemsEarned} Gems earned</Text>
            <Text style={styles.date}>{review.createdAt}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default History;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  stateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  stateText: {
    marginTop: 10,
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
  card: {
    padding: 15,
    borderBottomWidth: 8,
    borderBottomColor: '#F5F5F5',
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImage: {
    width: 56,
    height: 56,
    borderRadius: 6,
    backgroundColor: '#E1E1E1',
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
  },
  productName: {
    fontSize: 13.5,
    color: '#222',
    marginBottom: 6,
  },
  comment: {
    fontSize: 13,
    color: '#444',
    lineHeight: 19,
    marginTop: 10,
  },
  imagesRow: {
    marginTop: 10,
  },
  reviewImage: {
    width: 64,
    height: 64,
    borderRadius: 6,
    marginRight: 8,
    backgroundColor: '#eee',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  gemsEarned: {
    fontSize: 12,
    color: '#e53935',
    fontWeight: '600',
  },
  date: {
    fontSize: 11,
    color: '#999',
  },
});
