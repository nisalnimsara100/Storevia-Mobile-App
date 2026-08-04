import { Ionicons } from '@expo/vector-icons';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const BASE_URL = process.env.EXPO_PUBLIC_APP_BASE_URL ?? '';

const AVATAR_COLORS = [
  '#FF7043',
  '#26A69A',
  '#5C6BC0',
  '#EC407A',
  '#8D6E63',
  '#7CB342',
  '#42A5F5',
];

// Shape returned by the API
interface ApiReview {
  review_id: number;
  rating: number;
  comment: string;
  created_at: string;
  user_name: string;
  user_image: string;
  images: string[];
}

// Internal review shape used by the UI
interface Review {
  id: string;
  name: string;
  userImage: string;
  rating: number;
  date: string;
  recency: number;
  variant: string;
  text: string;
  images: string[];
  likes: number;
  liked: boolean;
  disliked: boolean;
  comments: number;
}

interface ImageEntry {
  uri: string;
  reviewId: string;
  imageIndexInReview: number;
}

const formatDate = (dateStr: string): string => {
  try {
    const d = new Date(dateStr.replace(' ', 'T'));
    return d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
};

const mapApiReview = (apiReview: ApiReview, index: number): Review => ({
  id: String(apiReview.review_id),
  name: apiReview.user_name,
  userImage: apiReview.user_image,
  rating: apiReview.rating,
  date: formatDate(apiReview.created_at),
  recency: index,
  variant: '',
  text: apiReview.comment,
  images: apiReview.images ?? [],
  likes: 0,
  liked: false,
  disliked: false,
  comments: 0,
});

const getAvatarColor = (name: string) => {
  const code = name.charCodeAt(0) || 0;
  return AVATAR_COLORS[code % AVATAR_COLORS.length];
};

type FilterKey = 'all' | 'images' | 'low';
type SortKey = 'relevance' | 'newest' | 'highest' | 'lowest';

interface RatingsProps {
  productId?: number | string;
}

const SORT_LABELS: Record<SortKey, string> = {
  relevance: 'Relevance',
  newest: 'Newest',
  highest: 'Highest Rating',
  lowest: 'Lowest Rating',
};

const StarRow = ({
  rating,
  size = 14,
  color = '#FFC107',
  emptyColor = '#E0E0E0',
}: {
  rating: number;
  size?: number;
  color?: string;
  emptyColor?: string;
}) => {
  const filled = Math.round(rating);
  return (
    <View style={styles.starRow}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Ionicons
          key={i}
          name="star"
          size={size}
          color={i < filled ? color : emptyColor}
          style={styles.starIcon}
        />
      ))}
    </View>
  );
};

const ReviewPreviewCard = ({
  review,
  onPressCard,
  onPressImage,
}: {
  review: Review;
  onPressCard: () => void;
  onPressImage: (index: number) => void;
}) => {
  const shownImages = review.images.slice(0, 2);
  const extraCount = review.images.length - shownImages.length;

  return (
    <TouchableOpacity
      style={styles.previewCard}
      activeOpacity={0.8}
      onPress={onPressCard}
    >
      <View style={styles.previewTextCol}>
        <Text style={styles.previewText} numberOfLines={2}>
          {review.text}
        </Text>
        <View style={styles.previewMetaRow}>
          <StarRow rating={review.rating} size={12} />
          <Text style={styles.previewName} numberOfLines={1}>
            {review.name}
          </Text>
        </View>
      </View>

      {shownImages.length > 0 && (
        <View style={styles.previewImagesCol}>
          {shownImages.map((uri, idx) => {
            const isLastWithOverlay =
              idx === shownImages.length - 1 && extraCount > 0;
            return (
              <TouchableOpacity
                key={idx}
                activeOpacity={0.85}
                onPress={() => onPressImage(idx)}
                style={styles.previewThumbWrap}
              >
                <Image source={{ uri }} style={styles.previewThumb} />
                {isLastWithOverlay && (
                  <View style={styles.previewThumbOverlay}>
                    <Text style={styles.previewThumbOverlayText}>
                      +{extraCount}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </TouchableOpacity>
  );
};

const FullReviewItem = ({
  review,
  onToggleLike,
  onToggleDislike,
  onPressImage,
}: {
  review: Review;
  onToggleLike: () => void;
  onToggleDislike: () => void;
  onPressImage: (index: number) => void;
}) => {
  const [expanded, setExpanded] = useState(false);
  const isLong = review.text.length > 140;

  return (
    <View style={styles.fullReviewCard}>
      <View style={styles.fullReviewHeader}>
        {review.userImage ? (
          <Image
            source={{ uri: review.userImage }}
            style={styles.avatarImage}
          />
        ) : (
          <View
            style={[
              styles.avatar,
              { backgroundColor: getAvatarColor(review.name) },
            ]}
          >
            <Text style={styles.avatarText}>
              {review.name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        <View style={styles.fullReviewHeaderInfo}>
          <Text style={styles.fullReviewName} numberOfLines={1}>
            {review.name}
          </Text>
          <Text style={styles.fullReviewMeta} numberOfLines={1}>
            {review.date}
            {review.variant ? ` | ${review.variant}` : ''}
          </Text>
        </View>
        <StarRow rating={review.rating} size={14} />
      </View>

      <Text
        style={styles.fullReviewText}
        numberOfLines={expanded ? undefined : 4}
      >
        {review.text}
      </Text>
      {isLong && (
        <TouchableOpacity onPress={() => setExpanded((v) => !v)}>
          <Text style={styles.moreText}>{expanded ? 'Less' : 'More'}</Text>
        </TouchableOpacity>
      )}

      {review.images.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.fullReviewImagesRow}
        >
          {review.images.map((uri, idx) => (
            <TouchableOpacity
              key={idx}
              activeOpacity={0.85}
              onPress={() => onPressImage(idx)}
            >
              <Image source={{ uri }} style={styles.fullReviewImage} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <View style={styles.fullReviewFooter}>
        <TouchableOpacity style={styles.footerAction} onPress={onToggleLike}>
          <Ionicons
            name={review.liked ? 'thumbs-up' : 'thumbs-up-outline'}
            size={16}
            color={review.liked ? '#f97316' : '#888'}
          />
          <Text
            style={[
              styles.footerActionText,
              review.liked && styles.footerActionTextActive,
            ]}
          >
            {review.likes} Likes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerAction} onPress={onToggleDislike}>
          <Ionicons
            name={review.disliked ? 'thumbs-down' : 'thumbs-down-outline'}
            size={16}
            color={review.disliked ? '#f97316' : '#888'}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerAction}>
          <Ionicons name="chatbubble-outline" size={15} color="#888" />
          <Text style={styles.footerActionText}>{review.comments} Comment</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerActionRight}>
          <Ionicons name="ellipsis-horizontal" size={16} color="#888" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const Ratings = ({ productId }: RatingsProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reviewsModalVisible, setReviewsModalVisible] = useState(false);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [filter, setFilter] = useState<FilterKey>('all');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [categoryMenuVisible, setCategoryMenuVisible] = useState(false);
  const [sortBy, setSortBy] = useState<SortKey>('relevance');
  const [sortMenuVisible, setSortMenuVisible] = useState(false);
  const [gridVisible, setGridVisible] = useState(false);
  const [captionExpanded, setCaptionExpanded] = useState(false);
  const viewerListRef = useRef<FlatList<ImageEntry>>(null);

  const fetchReviews = useCallback(async () => {
    if (!productId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/api/products/reviews/fetch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId }),
      });
      const data = await response.json();
      if (data.success && Array.isArray(data.reviews)) {
        setReviews(data.reviews.map(mapApiReview));
      } else {
        setError('Failed to load reviews.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Derived stats from fetched reviews
  const totalReviews = reviews.length;
  const avgRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return sum / reviews.length;
  }, [reviews]);

  const withImagesActualCount = useMemo(
    () => reviews.filter((r) => r.images.length > 0).length,
    [reviews],
  );

  const uniqueVariants = useMemo(
    () => Array.from(new Set(reviews.map((r) => r.variant).filter(Boolean))),
    [reviews],
  );

  const allImages = useMemo<ImageEntry[]>(
    () =>
      reviews.flatMap((r) =>
        r.images.map((uri, imageIndexInReview) => ({
          uri,
          reviewId: r.id,
          imageIndexInReview,
        })),
      ),
    [reviews],
  );

  const filteredSortedReviews = useMemo(() => {
    let list = [...reviews];
    if (filter === 'images') list = list.filter((r) => r.images.length > 0);
    if (filter === 'low') list = list.filter((r) => r.rating <= 3);
    if (categoryFilter) list = list.filter((r) => r.variant === categoryFilter);

    if (sortBy === 'highest') list.sort((a, b) => b.rating - a.rating);
    else if (sortBy === 'lowest') list.sort((a, b) => a.rating - b.rating);
    else if (sortBy === 'newest') list.sort((a, b) => b.recency - a.recency);

    return list;
  }, [reviews, filter, categoryFilter, sortBy]);

  const previewReviews = useMemo(() => reviews.slice(0, 3), [reviews]);

  const currentViewerImage = allImages[viewerIndex];
  const currentViewerReview = currentViewerImage
    ? (reviews.find((r) => r.id === currentViewerImage.reviewId) ?? null)
    : null;

  useEffect(() => {
    setCaptionExpanded(false);
  }, [viewerIndex]);

  const toggleLike = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const liked = !r.liked;
        return {
          ...r,
          liked,
          disliked: liked ? false : r.disliked,
          likes: r.likes + (liked ? 1 : -1),
        };
      }),
    );
  };

  const toggleDislike = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const disliked = !r.disliked;
        return {
          ...r,
          disliked,
          liked: disliked ? false : r.liked,
          likes: r.liked && disliked ? r.likes - 1 : r.likes,
        };
      }),
    );
  };

  const openReviewsModal = (initialFilter?: FilterKey) => {
    if (initialFilter) setFilter(initialFilter);
    setReviewsModalVisible(true);
  };

  const closeReviewsModal = () => {
    setCategoryMenuVisible(false);
    setSortMenuVisible(false);
    setReviewsModalVisible(false);
  };

  const openImageViewer = (reviewId: string, imageIndexInReview: number) => {
    const index = allImages.findIndex(
      (img) =>
        img.reviewId === reviewId &&
        img.imageIndexInReview === imageIndexInReview,
    );
    setViewerIndex(index >= 0 ? index : 0);
    setGridVisible(false);
    setImageViewerVisible(true);
  };

  const closeImageViewer = () => {
    setImageViewerVisible(false);
    setGridVisible(false);
  };

  const jumpToImage = (index: number) => {
    setViewerIndex(index);
    setGridVisible(false);
    requestAnimationFrame(() => {
      viewerListRef.current?.scrollToIndex({ index, animated: false });
    });
  };

  return (
    <View style={styles.container}>
      {/* Summary header */}
      <TouchableOpacity
        style={styles.headerRow}
        activeOpacity={0.7}
        onPress={() => openReviewsModal()}
      >
        <Text style={styles.headerTitle}>
          Ratings & Reviews ({totalReviews})
        </Text>
        <View style={styles.headerRight}>
          <Text style={styles.headerRating}>
            {avgRating > 0 ? avgRating.toFixed(1) : '—'}
          </Text>
          <StarRow rating={avgRating} size={14} />
          <Ionicons name="chevron-forward" size={18} color="#B0B0B0" />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.imagesChip}
        activeOpacity={0.7}
        onPress={() => openReviewsModal('images')}
      >
        <Ionicons name="image-outline" size={14} color="#f97316" />
        <Text style={styles.imagesChipText}>
          With images/videos ({withImagesActualCount})
        </Text>
      </TouchableOpacity>

      {/* Loading / error / preview states */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#f97316" />
          <Text style={styles.loadingText}>Loading reviews…</Text>
        </View>
      )}

      {!loading && error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={fetchReviews} style={styles.retryBtn}>
            <Text style={styles.retryBtnText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {!loading &&
        !error &&
        previewReviews.map((review) => (
          <ReviewPreviewCard
            key={review.id}
            review={review}
            onPressCard={() => openReviewsModal()}
            onPressImage={(idx) => openImageViewer(review.id, idx)}
          />
        ))}

      {!loading && !error && totalReviews === 0 && (
        <Text style={styles.emptyText}>No reviews yet for this product.</Text>
      )}

      <TouchableOpacity
        style={styles.seeAllBtn}
        activeOpacity={0.7}
        onPress={() => openReviewsModal()}
      >
        <Text style={styles.seeAllText}>See all {totalReviews} reviews</Text>
        <Ionicons name="chevron-forward" size={15} color="#f97316" />
      </TouchableOpacity>

      {/* Full ratings & reviews modal */}
      <Modal
        visible={reviewsModalVisible}
        animationType="slide"
        onRequestClose={closeReviewsModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={closeReviewsModal}
              style={styles.modalIconBtn}
            >
              <Ionicons name="chevron-back" size={22} color="#333" />
            </TouchableOpacity>
            <Text style={styles.modalHeaderTitle}>Ratings & Reviews</Text>
            <View style={styles.modalIconBtn} />
          </View>

          <FlatList
            data={filteredSortedReviews}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.modalListContent}
            ItemSeparatorComponent={() => (
              <View style={styles.reviewSeparator} />
            )}
            ListHeaderComponent={
              <View>
                <View style={styles.summaryBox}>
                  <Text style={styles.summaryRatingNum}>
                    {avgRating > 0 ? avgRating.toFixed(1) : '—'}
                  </Text>
                  <StarRow rating={avgRating} size={16} />
                  <Text style={styles.summaryReviewsCount}>
                    {totalReviews} Reviews
                  </Text>
                </View>

                <View style={styles.aiSummaryBox}>
                  <View style={styles.aiSummaryHeaderRow}>
                    <View style={styles.aiSummaryTitleRow}>
                      <Ionicons name="sparkles" size={14} color="#7C4DFF" />
                      <Text style={styles.aiSummaryTitle}>AI summary</Text>
                    </View>
                    <Text style={styles.aiSummaryBadge}>
                      Powered by AI from genuine reviews
                    </Text>
                  </View>
                  <Text style={styles.aiSummaryText}>
                    {
                      'Reviews are summarised based on verified purchases from customers on Storevia.'
                    }
                  </Text>
                </View>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.filterChipsRow}
                >
                  <TouchableOpacity
                    style={[
                      styles.filterChip,
                      filter === 'all' && styles.filterChipActive,
                    ]}
                    onPress={() => setFilter('all')}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        filter === 'all' && styles.filterChipTextActive,
                      ]}
                    >
                      ALL
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.filterChip,
                      filter === 'images' && styles.filterChipActive,
                    ]}
                    onPress={() => setFilter('images')}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        filter === 'images' && styles.filterChipTextActive,
                      ]}
                    >
                      With image/video ({withImagesActualCount})
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.filterChip,
                      filter === 'low' && styles.filterChipActive,
                    ]}
                    onPress={() => setFilter('low')}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        filter === 'low' && styles.filterChipTextActive,
                      ]}
                    >
                      Low rating
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.categoryChip}
                    onPress={() => {
                      setCategoryMenuVisible((v) => !v);
                      setSortMenuVisible(false);
                    }}
                  >
                    <Text style={styles.categoryChipText}>
                      {categoryFilter ?? 'By category'}
                    </Text>
                    <Ionicons name="chevron-down" size={13} color="#666" />
                  </TouchableOpacity>
                </ScrollView>

                {categoryMenuVisible && (
                  <View style={styles.dropdownMenu}>
                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={() => {
                        setCategoryFilter(null);
                        setCategoryMenuVisible(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>All variants</Text>
                    </TouchableOpacity>
                    {uniqueVariants.map((variant) => (
                      <TouchableOpacity
                        key={variant}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setCategoryFilter(variant);
                          setCategoryMenuVisible(false);
                        }}
                      >
                        <Text style={styles.dropdownItemText}>{variant}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                <View style={styles.subFilterRow}>
                  <TouchableOpacity
                    style={styles.genuineRow}
                    onPress={() =>
                      Alert.alert(
                        'Genuine Reviews',
                        'These reviews are collected only from customers who purchased this product through Storevia.',
                      )
                    }
                  >
                    <Ionicons
                      name="shield-checkmark"
                      size={14}
                      color="#4CAF50"
                    />
                    <Text style={styles.genuineText}>Genuine Reviews</Text>
                    <Ionicons
                      name="help-circle-outline"
                      size={13}
                      color="#999"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.sortRow}
                    onPress={() => {
                      setSortMenuVisible((v) => !v);
                      setCategoryMenuVisible(false);
                    }}
                  >
                    <Text style={styles.sortText}>{SORT_LABELS[sortBy]}</Text>
                    <Ionicons name="chevron-down" size={13} color="#666" />
                  </TouchableOpacity>
                </View>

                {sortMenuVisible && (
                  <View style={[styles.dropdownMenu, styles.dropdownMenuRight]}>
                    {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
                      <TouchableOpacity
                        key={key}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setSortBy(key);
                          setSortMenuVisible(false);
                        }}
                      >
                        <Text style={styles.dropdownItemText}>
                          {SORT_LABELS[key]}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            }
            renderItem={({ item }) => (
              <FullReviewItem
                review={item}
                onToggleLike={() => toggleLike(item.id)}
                onToggleDislike={() => toggleDislike(item.id)}
                onPressImage={(idx) => openImageViewer(item.id, idx)}
              />
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                No reviews match this filter.
              </Text>
            }
          />
        </View>
      </Modal>

      {/* Full-screen image viewer */}
      <Modal
        visible={imageViewerVisible}
        animationType="fade"
        onRequestClose={closeImageViewer}
      >
        <View style={styles.viewerContainer}>
          <View style={styles.viewerHeader}>
            <TouchableOpacity
              onPress={closeImageViewer}
              style={styles.viewerIconBtn}
            >
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.viewerCounter}>
              {allImages.length > 0
                ? `${viewerIndex + 1}/${allImages.length}`
                : ''}
            </Text>
            <TouchableOpacity
              onPress={() => setGridVisible((v) => !v)}
              style={styles.viewerIconBtn}
            >
              <Ionicons name="grid-outline" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {!gridVisible ? (
            <>
              <FlatList
                ref={viewerListRef}
                data={allImages}
                keyExtractor={(_, i) => `viewer-img-${i}`}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                initialScrollIndex={viewerIndex}
                getItemLayout={(_, index) => ({
                  length: SCREEN_WIDTH,
                  offset: SCREEN_WIDTH * index,
                  index,
                })}
                onMomentumScrollEnd={(e) => {
                  const idx = Math.round(
                    e.nativeEvent.contentOffset.x / SCREEN_WIDTH,
                  );
                  setViewerIndex(idx);
                }}
                renderItem={({ item }) => (
                  <View style={styles.viewerImageWrap}>
                    <Image
                      source={{ uri: item.uri }}
                      style={styles.viewerImage}
                      resizeMode="contain"
                    />
                  </View>
                )}
              />

              {currentViewerReview && (
                <View style={styles.viewerCaption}>
                  <StarRow rating={currentViewerReview.rating} size={13} />
                  <Text style={styles.viewerCaptionName}>
                    {currentViewerReview.name}
                  </Text>
                  <Text
                    style={styles.viewerCaptionText}
                    numberOfLines={captionExpanded ? undefined : 2}
                  >
                    {currentViewerReview.text}
                  </Text>
                  {currentViewerReview.text.length > 90 && (
                    <TouchableOpacity
                      onPress={() => setCaptionExpanded((v) => !v)}
                    >
                      <Text style={styles.viewerMoreText}>
                        {captionExpanded ? 'Less' : 'More'}
                      </Text>
                    </TouchableOpacity>
                  )}
                  <View style={styles.viewerActionsRow}>
                    <TouchableOpacity
                      style={styles.viewerActionBtn}
                      onPress={() => toggleLike(currentViewerReview.id)}
                    >
                      <Ionicons
                        name={
                          currentViewerReview.liked
                            ? 'thumbs-up'
                            : 'thumbs-up-outline'
                        }
                        size={18}
                        color="#fff"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.viewerActionBtn}
                      onPress={() => toggleDislike(currentViewerReview.id)}
                    >
                      <Ionicons
                        name={
                          currentViewerReview.disliked
                            ? 'thumbs-down'
                            : 'thumbs-down-outline'
                        }
                        size={18}
                        color="#fff"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.viewerActionBtn}>
                      <Ionicons
                        name="chatbubble-outline"
                        size={17}
                        color="#fff"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.viewerActionBtn}>
                      <Ionicons
                        name="ellipsis-horizontal"
                        size={18}
                        color="#fff"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </>
          ) : (
            <ScrollView contentContainerStyle={styles.gridContainer}>
              {allImages.map((img, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.gridItem}
                  activeOpacity={0.8}
                  onPress={() => jumpToImage(idx)}
                >
                  <Image source={{ uri: img.uri }} style={styles.gridImage} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      </Modal>
    </View>
  );
};

export default Ratings;

const GRID_GAP = 2;
const GRID_ITEM_SIZE = (SCREEN_WIDTH - GRID_GAP * 4) / 3;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginHorizontal: 16,
  },
  starRow: {
    flexDirection: 'row',
  },
  starIcon: {
    marginRight: 1,
  },

  /* --- Inline summary --- */
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRating: {
    fontSize: 15,
    fontWeight: '700',
    color: '#222',
    marginRight: 6,
  },
  imagesChip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FFF3E9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 12,
  },
  imagesChipText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: '600',
    color: '#f97316',
  },

  previewCard: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  previewTextCol: {
    flex: 1,
    paddingRight: 10,
  },
  previewText: {
    fontSize: 13,
    color: '#333',
    lineHeight: 18,
    marginBottom: 8,
  },
  previewMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  previewName: {
    marginLeft: 6,
    fontSize: 12,
    color: '#666',
    flexShrink: 1,
  },
  previewImagesCol: {
    flexDirection: 'row',
  },
  previewThumbWrap: {
    width: 56,
    height: 56,
    borderRadius: 6,
    overflow: 'hidden',
    marginLeft: 6,
  },
  previewThumb: {
    width: '100%',
    height: '100%',
    backgroundColor: '#eee',
  },
  previewThumbOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewThumbOverlayText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },

  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#f97316',
    marginRight: 4,
  },

  /* --- Full reviews modal --- */
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingTop: 50,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalIconBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
  },
  modalListContent: {
    paddingBottom: 40,
  },

  summaryBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 10,
  },
  summaryRatingNum: {
    fontSize: 28,
    fontWeight: '800',
    color: '#222',
    marginRight: 10,
  },
  summaryReviewsCount: {
    marginLeft: 'auto',
    fontSize: 13,
    color: '#666',
  },

  aiSummaryBox: {
    backgroundColor: '#F3F0FF',
    marginHorizontal: 16,
    marginTop: 12,
    padding: 14,
    borderRadius: 10,
  },
  aiSummaryHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  aiSummaryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiSummaryTitle: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: '700',
    color: '#4A148C',
  },
  aiSummaryBadge: {
    fontSize: 10,
    color: '#7C4DFF',
    fontWeight: '600',
  },
  aiSummaryText: {
    fontSize: 12.5,
    color: '#4a3f66',
    lineHeight: 18,
  },

  filterChipsRow: {
    marginTop: 14,
    paddingHorizontal: 16,
  },
  filterChip: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  filterChipActive: {
    borderColor: '#f97316',
    backgroundColor: '#FFF3E9',
  },
  filterChipText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#f97316',
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  categoryChipText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    marginRight: 4,
  },

  dropdownMenu: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 8,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  dropdownMenuRight: {
    alignSelf: 'flex-end',
    width: 180,
    marginRight: 16,
  },
  dropdownItem: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  dropdownItemText: {
    fontSize: 13,
    color: '#333',
  },

  subFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  genuineRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  genuineText: {
    marginLeft: 5,
    marginRight: 4,
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    marginRight: 4,
  },

  reviewSeparator: {
    height: 8,
    backgroundColor: '#F8F9FA',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 13,
    paddingVertical: 40,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 13,
    color: '#999',
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  errorText: {
    fontSize: 13,
    color: '#d32f2f',
    marginBottom: 8,
    textAlign: 'center',
  },
  retryBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#f97316',
  },
  retryBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  fullReviewCard: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  fullReviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  avatarImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  fullReviewHeaderInfo: {
    flex: 1,
  },
  fullReviewName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#222',
  },
  fullReviewMeta: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  fullReviewText: {
    fontSize: 13.5,
    color: '#333',
    lineHeight: 20,
  },
  moreText: {
    fontSize: 12,
    color: '#f97316',
    fontWeight: '600',
    marginTop: 2,
  },
  fullReviewImagesRow: {
    marginTop: 10,
  },
  fullReviewImage: {
    width: 76,
    height: 76,
    borderRadius: 6,
    marginRight: 8,
    backgroundColor: '#eee',
  },
  fullReviewFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  footerAction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  footerActionText: {
    marginLeft: 5,
    fontSize: 12,
    color: '#888',
  },
  footerActionTextActive: {
    color: '#f97316',
  },
  footerActionRight: {
    marginLeft: 'auto',
  },

  /* --- Image viewer --- */
  viewerContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  viewerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingTop: 50,
    paddingBottom: 12,
  },
  viewerIconBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewerCounter: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  viewerImageWrap: {
    width: SCREEN_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewerImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
  },
  viewerCaption: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 30,
  },
  viewerCaptionName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 6,
  },
  viewerCaptionText: {
    color: '#ddd',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
  },
  viewerMoreText: {
    color: '#FF8A65',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  viewerActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
  },
  viewerActionBtn: {
    marginRight: 24,
  },

  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: GRID_GAP,
  },
  gridItem: {
    width: GRID_ITEM_SIZE,
    height: GRID_ITEM_SIZE,
    margin: GRID_GAP,
  },
  gridImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#111',
  },
});
