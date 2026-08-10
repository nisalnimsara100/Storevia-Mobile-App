import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import Swiper from 'react-native-swiper';
import { theme } from '@/theme';
import { Badge } from './Badge';
import { Button } from './Button';
import { StarRating } from './StarRating';

export type ProductCardVariant = 'grid' | 'list' | 'flashsale' | 'detail';

export interface Product {
  id: string | number;
  image: string | { uri: string };
  images?: (string | { uri: string })[];
  name: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  badges?: string[];
  tags?: string[];
  rating?: number;
  reviews?: number;
  sold?: number;
  stock?: number;
  description?: string;
}

export interface ProductCardProps {
  product: Product;
  variant?: ProductCardVariant;
  onPress?: () => void;
  onAddToCart?: () => void;
}

function resolveImage(image: string | { uri: string } | undefined) {
  if (!image) return undefined;
  return typeof image === 'string' ? { uri: image } : image;
}

function formatSold(n?: number) {
  if (n === undefined || n === null) return '0';
  if (n < 1000) return String(n);
  if (n < 1_000_000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
  return `${(n / 1_000_000).toFixed(1)}M`;
}

function Price({
  price,
  oldPrice,
  discount,
  size = 'lg',
}: {
  price: number;
  oldPrice?: number;
  discount?: number;
  size?: 'lg' | '2xl';
}) {
  return (
    <View style={styles.priceRow}>
      <Text
        style={{
          color: theme.color.primary.DEFAULT,
          fontFamily: theme.font.family.bold,
          fontWeight: theme.font.weight.bold,
          fontSize: theme.font.size[size],
        }}
      >
        Rs.{price.toFixed(2)}
      </Text>
      {oldPrice ? (
        <Text style={styles.oldPrice}>Rs.{oldPrice.toFixed(2)}</Text>
      ) : null}
      {discount ? (
        <Badge
          label={`-${discount}%`}
          tone="discount"
          size="sm"
          style={styles.discountBadge}
        />
      ) : null}
    </View>
  );
}

export function ProductCard({
  product,
  variant = 'grid',
  onPress,
  onAddToCart,
}: ProductCardProps) {
  const router = useRouter();

  const handlePress =
    onPress ??
    (() => {
      router.push({
        pathname: '/screens/item_details',
        params: { product: JSON.stringify(product) },
      });
    });

  if (variant === 'flashsale') {
    return (
      <TouchableOpacity
        style={styles.flashsaleCard}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <Image
          source={resolveImage(product.image)}
          style={styles.flashsaleImage}
          resizeMode="contain"
        />
        {product.stock !== undefined && (
          <Text style={styles.flashsaleStock}>Only {product.stock} left</Text>
        )}
        <Price price={product.price} oldPrice={product.oldPrice} size="lg" />
        {product.discount ? (
          <Badge
            label={`-${product.discount}%`}
            tone="discount"
            style={styles.flashsaleDiscountBadge}
          />
        ) : null}
      </TouchableOpacity>
    );
  }

  if (variant === 'list') {
    return (
      <TouchableOpacity
        style={styles.listCard}
        onPress={handlePress}
        activeOpacity={0.9}
      >
        <View style={styles.listImageWrap}>
          <Image
            source={resolveImage(product.image)}
            style={styles.listImage}
            resizeMode="cover"
          />
          {(product.badges?.length ?? 0) > 0 && (
            <View style={styles.listBadgeStrip}>
              {product.badges!.map((b, i) => (
                <Badge
                  key={i}
                  label={b}
                  tone={i === 0 ? 'freeDelivery' : 'new'}
                  style={styles.listBadgeItem}
                />
              ))}
            </View>
          )}
        </View>
        <View style={styles.listBody}>
          <Text style={styles.listName} numberOfLines={2}>
            {product.name}
          </Text>
          <Price price={product.price} discount={product.discount} size="lg" />
          <View style={styles.metaRow}>
            <StarRating rating={product.rating ?? 0} size={12} />
            <Text style={styles.metaText}>
              {' '}
              ({product.reviews ?? 0}) | {formatSold(product.sold)} Sold
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  if (variant === 'detail') {
    return <DetailCard product={product} onAddToCart={onAddToCart} />;
  }

  // grid (default)
  return (
    <TouchableOpacity
      style={styles.gridCard}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={styles.gridImageWrap}>
        <Image
          source={resolveImage(product.image)}
          style={styles.gridImage}
          resizeMode="contain"
        />
        <Badge
          label="FREE DELIVERY"
          tone="freeDelivery"
          size="sm"
          style={styles.gridFreeBadge}
        />
      </View>
      <Text style={styles.gridName} numberOfLines={2}>
        {product.name}
      </Text>
      <Price
        price={product.price}
        oldPrice={product.oldPrice}
        discount={product.discount}
        size="lg"
      />
      <Text style={styles.metaText}>
        {(product.rating ?? 0).toFixed(1)} ({product.reviews ?? 0}) ·{' '}
        {formatSold(product.sold)} Sold
      </Text>
      {(product.badges?.length ?? 0) > 0 && (
        <View style={styles.gridBadgeRow}>
          {product.badges!.map((b, i) => (
            <Badge
              key={i}
              label={b}
              tone="freeDelivery"
              size="sm"
              style={styles.gridBadgeItem}
            />
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
}

function DetailCard({
  product,
  onAddToCart,
}: {
  product: Product;
  onAddToCart?: () => void;
}) {
  const [imageIndex, setImageIndex] = useState(0);
  const images =
    product.images && product.images.length > 0
      ? product.images
      : product.image
        ? [product.image]
        : [];
  const totalImages = images.length || 1;

  return (
    <View style={styles.detailContainer}>
      <View style={styles.detailImageWrap}>
        <Swiper
          style={styles.detailSwiper}
          loop={false}
          showsButtons={false}
          showsPagination={false}
          bounces={false}
          onIndexChanged={setImageIndex}
        >
          {images.map((img, i) => (
            <View key={i} style={styles.detailSlide}>
              <Image
                source={resolveImage(img)}
                style={styles.detailImage}
                resizeMode="contain"
              />
            </View>
          ))}
        </Swiper>
        <Badge
          label="FREE DELIVERY"
          tone="freeDelivery"
          style={styles.detailFreeBadge}
        />
        <View style={styles.detailPhotoCount}>
          <Text
            style={styles.detailPhotoCountText}
          >{`${imageIndex + 1}/${totalImages}`}</Text>
        </View>
      </View>

      <View style={styles.detailInfo}>
        <Text style={styles.detailName}>{product.name}</Text>
        <View style={styles.metaRow}>
          <StarRating
            rating={product.rating ?? 0}
            size={13}
            showCount
            reviewCount={product.reviews}
          />
          <Text style={styles.metaText}>
            {' '}
            | {formatSold(product.sold)} sold
          </Text>
        </View>

        <Price
          price={product.price}
          oldPrice={product.oldPrice}
          discount={product.discount}
          size="2xl"
        />

        {product.stock !== undefined && (
          <Text style={styles.detailStock}>
            Only {product.stock} left in stock
          </Text>
        )}

        {product.description ? (
          <>
            <Text style={styles.detailSectionTitle}>Description</Text>
            <Text style={styles.detailDescription}>{product.description}</Text>
          </>
        ) : null}

        {onAddToCart && (
          <Button
            label="Add to Cart"
            onPress={onAddToCart}
            variant="primary"
            size="lg"
            fullWidth
            style={styles.detailAddToCart}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: theme.space[1],
  },
  oldPrice: {
    marginLeft: theme.space[1],
    fontSize: theme.font.size.sm,
    color: theme.color.text.disabled,
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    marginLeft: theme.space[1],
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.space[1],
  },
  metaText: {
    fontSize: theme.font.size.xs,
    color: theme.color.text.secondary,
  },

  // grid
  gridCard: {
    flex: 1,
    backgroundColor: theme.color.surface.DEFAULT,
    borderRadius: theme.radius.lg,
    margin: theme.space[1],
    padding: theme.space[2],
  },
  gridImageWrap: {
    position: 'relative',
  },
  gridImage: {
    width: '100%',
    height: 112,
    borderRadius: theme.radius.md,
  },
  gridFreeBadge: {
    position: 'absolute',
    bottom: theme.space[1],
    left: theme.space[1],
  },
  gridName: {
    fontSize: theme.font.size.sm,
    fontFamily: theme.font.family.medium,
    fontWeight: theme.font.weight.medium,
    marginTop: theme.space[2],
    color: theme.color.text.primary,
  },
  gridBadgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: theme.space[1],
  },
  gridBadgeItem: {
    marginRight: theme.space[1],
    marginBottom: theme.space[1],
  },

  // list
  listCard: {
    flex: 1,
    backgroundColor: theme.color.surface.DEFAULT,
    borderRadius: theme.radius.lg,
    margin: theme.space[1],
    overflow: 'hidden',
  },
  listImageWrap: {
    width: '100%',
    height: verticalScale(160),
  },
  listImage: {
    width: '100%',
    height: '100%',
  },
  listBadgeStrip: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    flexDirection: 'row',
  },
  listBadgeItem: {
    borderRadius: 0,
    marginRight: 0,
  },
  listBody: {
    padding: theme.space[2],
  },
  listName: {
    fontSize: theme.font.size.sm,
    fontFamily: theme.font.family.regular,
    color: theme.color.text.primary,
    lineHeight: theme.font.lineHeight.sm,
  },

  // flashsale
  flashsaleCard: {
    width: scale(140),
    backgroundColor: theme.color.surface.DEFAULT,
    borderRadius: moderateScale(theme.radius.lg),
    margin: theme.space[1],
    padding: theme.space[2],
    overflow: 'hidden',
  },
  flashsaleImage: {
    width: '100%',
    height: verticalScale(100),
    borderRadius: moderateScale(theme.radius.md),
  },
  flashsaleStock: {
    fontSize: theme.font.size.xs,
    color: theme.color.danger.DEFAULT,
    marginTop: theme.space[1],
    fontFamily: theme.font.family.medium,
    fontWeight: theme.font.weight.medium,
  },
  flashsaleDiscountBadge: {
    position: 'absolute',
    top: theme.space[2],
    right: theme.space[2],
  },

  // detail
  detailContainer: {},
  detailImageWrap: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: theme.color.background.subtle,
    position: 'relative',
  },
  detailSwiper: { margin: 0 },
  detailSlide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  detailImage: {
    width: '100%',
    height: '100%',
  },
  detailFreeBadge: {
    position: 'absolute',
    bottom: theme.space[3],
    left: theme.space[3],
  },
  detailPhotoCount: {
    position: 'absolute',
    bottom: theme.space[3],
    right: theme.space[3],
    backgroundColor: theme.color.overlay,
    borderRadius: theme.radius.full,
    paddingHorizontal: theme.space[2],
    paddingVertical: theme.space[1],
  },
  detailPhotoCountText: {
    color: theme.color.text.inverse,
    fontSize: theme.font.size.xs,
    fontFamily: theme.font.family.semibold,
    fontWeight: theme.font.weight.semibold,
  },
  detailInfo: {
    padding: theme.space[4],
  },
  detailName: {
    fontSize: theme.font.size.lg,
    fontFamily: theme.font.family.bold,
    fontWeight: theme.font.weight.bold,
    color: theme.color.text.primary,
    lineHeight: theme.font.lineHeight.lg,
  },
  detailStock: {
    marginTop: theme.space[1],
    fontSize: theme.font.size.base,
    color: theme.color.danger.DEFAULT,
  },
  detailSectionTitle: {
    marginTop: theme.space[4],
    fontSize: theme.font.size.lg,
    fontFamily: theme.font.family.bold,
    fontWeight: theme.font.weight.bold,
    color: theme.color.text.primary,
  },
  detailDescription: {
    marginTop: theme.space[2],
    fontSize: theme.font.size.base,
    color: theme.color.text.secondary,
    lineHeight: theme.font.lineHeight.base,
  },
  detailAddToCart: {
    marginTop: theme.space[6],
  },
});

export default ProductCard;
