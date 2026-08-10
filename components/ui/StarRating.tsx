import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '@/theme';

export interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: number;
  interactive?: boolean;
  onChange?: (value: number) => void;
  showCount?: boolean;
  reviewCount?: number;
}

export function StarRating({
  rating,
  maxStars = 5,
  size = 14,
  interactive = false,
  onChange,
  showCount = false,
  reviewCount,
}: StarRatingProps) {
  const stars = Array.from({ length: maxStars }, (_, i) => i + 1);

  return (
    <View style={styles.row}>
      {stars.map((starValue) => {
        const filled = starValue <= Math.round(rating);
        const star = (
          <Ionicons
            key={starValue}
            name={filled ? 'star' : 'star-outline'}
            size={size}
            color={theme.color.star}
          />
        );
        if (!interactive) return star;
        return (
          <TouchableOpacity
            key={starValue}
            onPress={() => onChange?.(starValue)}
            hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
            activeOpacity={0.7}
          >
            {star}
          </TouchableOpacity>
        );
      })}
      {showCount && (
        <Text style={styles.count}>
          {rating.toFixed(1)}
          {reviewCount !== undefined ? ` (${reviewCount})` : ''}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  count: {
    marginLeft: theme.space[1],
    fontSize: theme.font.size.xs,
    color: theme.color.text.secondary,
    fontFamily: theme.font.family.regular,
  },
});

export default StarRating;
