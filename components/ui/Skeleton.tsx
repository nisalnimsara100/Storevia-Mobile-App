import { ActivityIndicator, StyleProp, View, ViewStyle } from 'react-native';
import { theme } from '@/theme';

export interface SpinnerProps {
  size?: 'small' | 'large';
  style?: StyleProp<ViewStyle>;
}

export function Spinner({ size = 'large', style }: SpinnerProps) {
  return (
    <ActivityIndicator
      size={size}
      color={theme.color.primary.DEFAULT}
      style={style}
    />
  );
}

export interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
}

export function Skeleton({
  width = '100%',
  height = 16,
  borderRadius = theme.radius.sm,
  style,
}: SkeletonProps) {
  return (
    <View
      style={[
        {
          width: width as any,
          height,
          borderRadius,
          backgroundColor: theme.color.neutral[200],
        },
        style,
      ]}
    />
  );
}

export default Spinner;
