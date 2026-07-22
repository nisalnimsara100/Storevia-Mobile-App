import { useAuthStore } from '@/app/stores/useAuthStore';
import { reviewKey, useReviewsStore } from '@/app/stores/useReviewsStore';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const BASE_URL = process.env.EXPO_PUBLIC_APP_BASE_URL;

const MIN_COMMENT_LENGTH = 30;
const MAX_IMAGES = 5;
const RATING_GEMS = 100;
const COMMENT_GEMS = 200;
const PHOTO_GEMS = 300;
const MAX_GEMS = RATING_GEMS + COMMENT_GEMS + PHOTO_GEMS;

const WriteReview = () => {
  const params = useLocalSearchParams<{
    orderId: string;
    productId: string;
    productName: string;
    productImage: string;
    variant?: string;
  }>();

  const { user } = useAuthStore();
  const addSubmittedReview = useReviewsStore((state) => state.addSubmittedReview);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [anonymous, setAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const orderId = Number(params.orderId);
  const productId = Number(params.productId);
  const commentGemsEarned = comment.trim().length >= MIN_COMMENT_LENGTH ? COMMENT_GEMS : 0;
  const photoGemsEarned = images.length > 0 ? PHOTO_GEMS : 0;
  const totalGems = RATING_GEMS + commentGemsEarned + photoGemsEarned;
  const progress = totalGems / MAX_GEMS;

  const hasContent = comment.trim().length > 0 || images.length > 0;

  const pickImages = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Please allow photo library access to add photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsMultipleSelection: true,
      selectionLimit: MAX_IMAGES - images.length,
      quality: 0.7,
    });

    if (!result.canceled) {
      const uris = result.assets.map((asset) => asset.uri);
      setImages((prev) => [...prev, ...uris].slice(0, MAX_IMAGES));
    }
  };

  const removeImage = (uri: string) => {
    setImages((prev) => prev.filter((img) => img !== uri));
  };

  const handleSubmit = async () => {
    if (comment.trim().length > 0 && comment.trim().length < MIN_COMMENT_LENGTH) {
      Alert.alert(
        'Review too short',
        `Please enter at least ${MIN_COMMENT_LENGTH} characters, or clear the box to rate only.`
      );
      return;
    }

    setSubmitting(true);

    const review = {
      key: reviewKey(orderId, productId),
      orderId,
      productId,
      productName: params.productName ?? 'Product',
      productImage: params.productImage ?? '',
      variant: params.variant,
      rating,
      comment: comment.trim(),
      images,
      anonymous,
      gemsEarned: totalGems,
      createdAt: new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    };

    // Best-effort sync to the backend; the local review record is the
    // source of truth for the My Reviews UI regardless of network outcome.
    if (BASE_URL && user?.email) {
      try {
        await fetch(`${BASE_URL}/api/products/reviews/add`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user.email,
            order_id: orderId,
            product_id: productId,
            rating,
            comment: review.comment,
            images,
            anonymous,
          }),
        });
      } catch (err) {
        console.warn('Review sync failed, kept locally:', err);
      }
    }

    addSubmittedReview(review);
    setSubmitting(false);

    Alert.alert('Thank you!', `You earned ${totalGems} Gems for this review.`, [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  const gemsInfo = () =>
    Alert.alert(
      'Gems',
      'Earn Gems by rating, writing a detailed review (30+ characters), and adding photos or videos. Gems can be redeemed for discounts.'
    );

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Write Review</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.scrollContent}>
        <View style={styles.productRow}>
          {params.productImage ? (
            <Image source={{ uri: params.productImage }} style={styles.productImage} />
          ) : (
            <View style={[styles.productImage, styles.productImagePlaceholder]} />
          )}
          <View style={styles.productInfo}>
            <Text style={styles.productName} numberOfLines={2}>
              {params.productName}
            </Text>
            {!!params.variant && <Text style={styles.productVariant}>{params.variant}</Text>}
          </View>
        </View>

        <View style={styles.ratingRow}>
          <Text style={styles.ratingLabel}>Overall Rating</Text>
          <View style={styles.starsRow}>
            {Array.from({ length: 5 }).map((_, i) => (
              <TouchableOpacity key={i} onPress={() => setRating(i + 1)} hitSlop={6}>
                <Ionicons
                  name="star"
                  size={24}
                  color={i < rating ? '#FFC107' : '#E0E0E0'}
                  style={styles.starIcon}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.hintRow}>
          <Text style={styles.hintText}>Please enter at least {MIN_COMMENT_LENGTH} characters</Text>
          <Text style={styles.gemsHint}>Get {COMMENT_GEMS} Gems</Text>
        </View>
        <TextInput
          style={styles.textArea}
          placeholder="What do you think of the quality and appearance?"
          placeholderTextColor="#999"
          multiline
          value={comment}
          onChangeText={setComment}
          textAlignVertical="top"
        />

        <View style={styles.hintRow}>
          <Text style={styles.hintText}>Upload photos/video</Text>
          <Text style={styles.gemsHint}>Get {PHOTO_GEMS} Gems</Text>
        </View>
        <View style={styles.mediaRow}>
          {images.map((uri) => (
            <View key={uri} style={styles.mediaThumbWrap}>
              <Image source={{ uri }} style={styles.mediaThumb} />
              <TouchableOpacity style={styles.removeMediaBtn} onPress={() => removeImage(uri)}>
                <Ionicons name="close" size={12} color="#fff" />
              </TouchableOpacity>
            </View>
          ))}
          {images.length < MAX_IMAGES && (
            <TouchableOpacity style={styles.uploadBox} activeOpacity={0.7} onPress={pickImages}>
              <Ionicons name="camera-outline" size={22} color="#999" />
              <Text style={styles.uploadText}>Upload Photo/Video</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={styles.anonymousRow}
          activeOpacity={0.7}
          onPress={() => setAnonymous((v) => !v)}
        >
          <View style={[styles.checkbox, anonymous && styles.checkboxChecked]}>
            {anonymous && <Ionicons name="checkmark" size={13} color="#fff" />}
          </View>
          <Text style={styles.anonymousText}>Anonymously</Text>
        </TouchableOpacity>

        <View style={{ height: 20 }} />
      </ScrollView>

      <View style={styles.bottomBar}>
        <View style={styles.gemsProgressBlock}>
          <View style={styles.gemsProgressLabelRow}>
            <Text style={styles.gemsProgressText}>
              {totalGems}
              <Text style={styles.gemsProgressMax}>/{MAX_GEMS} Gems</Text>
            </Text>
            <TouchableOpacity onPress={gemsInfo} hitSlop={6}>
              <Ionicons name="alert-circle-outline" size={15} color="#999" />
            </TouchableOpacity>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>
        </View>

        <TouchableOpacity
          style={styles.submitBtn}
          activeOpacity={0.85}
          onPress={handleSubmit}
          disabled={submitting}
        >
          <Text style={styles.submitBtnText}>
            {submitting ? 'Submitting...' : hasContent ? 'Submit Review' : 'Rate only'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default WriteReview;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#000',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  productImage: {
    width: 52,
    height: 52,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
  },
  productImagePlaceholder: {
    backgroundColor: '#eee',
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222',
    lineHeight: 19,
  },
  productVariant: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ratingLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#222',
  },
  starsRow: {
    flexDirection: 'row',
  },
  starIcon: {
    marginLeft: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 18,
    marginHorizontal: -16,
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  hintText: {
    fontSize: 12.5,
    color: '#999',
  },
  gemsHint: {
    fontSize: 12.5,
    color: '#FFA000',
    fontWeight: '600',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 6,
    minHeight: 130,
    padding: 12,
    fontSize: 14,
    color: '#222',
    marginBottom: 22,
  },
  mediaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 18,
  },
  uploadBox: {
    width: 84,
    height: 84,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAFAFA',
    marginRight: 10,
    marginBottom: 10,
  },
  uploadText: {
    fontSize: 10,
    color: '#999',
    marginTop: 6,
    textAlign: 'center',
    paddingHorizontal: 6,
  },
  mediaThumbWrap: {
    width: 84,
    height: 84,
    marginRight: 10,
    marginBottom: 10,
    position: 'relative',
  },
  mediaThumb: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
    backgroundColor: '#eee',
  },
  removeMediaBtn: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  anonymousRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 3,
    borderWidth: 1.5,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: '#FF5722',
    borderColor: '#FF5722',
  },
  anonymousText: {
    fontSize: 13,
    color: '#444',
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  gemsProgressBlock: {
    flex: 1,
    marginRight: 14,
  },
  gemsProgressLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  gemsProgressText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFA000',
    marginRight: 5,
  },
  gemsProgressMax: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
  },
  progressTrack: {
    height: 5,
    borderRadius: 3,
    backgroundColor: '#F0E0C0',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFA000',
    borderRadius: 3,
  },
  submitBtn: {
    backgroundColor: '#EC0C6D',
    paddingHorizontal: 26,
    paddingVertical: 13,
    borderRadius: 6,
  },
  submitBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
});
