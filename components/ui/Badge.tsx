import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { theme } from '@/theme';

export type BadgeTone =
  'discount' | 'stock' | 'freeDelivery' | 'new' | 'neutral';
export type BadgeShape = 'pill' | 'rect';

export interface BadgeProps {
  label: string;
  tone?: BadgeTone;
  size?: 'sm' | 'md';
  shape?: BadgeShape;
  style?: StyleProp<ViewStyle>;
}

function getToneColors(tone: BadgeTone) {
  switch (tone) {
    case 'discount':
      return { bg: theme.color.danger.bg, fg: theme.color.danger.DEFAULT };
    case 'stock':
      return { bg: theme.color.warning.bg, fg: theme.color.warning.DEFAULT };
    case 'freeDelivery':
      return { bg: theme.color.success.bg, fg: theme.color.success.DEFAULT };
    case 'new':
      return {
        bg: theme.color.primary[50] ?? theme.color.primary.DEFAULT,
        fg: theme.color.primary.DEFAULT,
      };
    default:
      return { bg: theme.color.neutral[100], fg: theme.color.neutral[700] };
  }
}

export function Badge({
  label,
  tone = 'neutral',
  size = 'md',
  shape = 'rect',
  style,
}: BadgeProps) {
  const { bg, fg } = getToneColors(tone);
  return (
    <View
      style={[
        styles.base,
        {
          backgroundColor: bg,
          borderRadius: shape === 'pill' ? theme.radius.full : theme.radius.sm,
          paddingHorizontal: size === 'sm' ? theme.space[1] : theme.space[2],
          paddingVertical: size === 'sm' ? 2 : theme.space[1],
        },
        style,
      ]}
    >
      <Text
        style={{
          color: fg,
          fontSize: theme.font.size.xs,
          fontFamily: theme.font.family.semibold,
          fontWeight: theme.font.weight.semibold,
        }}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
  },
});

export default Badge;
