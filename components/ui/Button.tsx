import React from 'react';
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { theme } from '@/theme';

export type ButtonVariant =
  'primary' | 'secondary' | 'outline' | 'text' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const HEIGHTS: Record<ButtonSize, number> = { sm: 36, md: 44, lg: 52 };
const FONT_SIZES: Record<ButtonSize, number> = {
  sm: theme.font.size.sm,
  md: theme.font.size.base,
  lg: theme.font.size.lg,
};

function getVariantStyles(variant: ButtonVariant) {
  switch (variant) {
    case 'primary':
      return {
        backgroundColor: theme.color.primary.DEFAULT,
        borderWidth: 0,
        textColor: theme.color.text.inverse,
      };
    case 'secondary':
      return {
        backgroundColor: theme.color.secondary.DEFAULT,
        borderWidth: 0,
        textColor: theme.color.text.inverse,
      };
    case 'danger':
      return {
        backgroundColor: theme.color.danger.DEFAULT,
        borderWidth: 0,
        textColor: theme.color.text.inverse,
      };
    case 'outline':
      return {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: theme.color.border.DEFAULT,
        textColor: theme.color.text.primary,
      };
    case 'text':
      return {
        backgroundColor: 'transparent',
        borderWidth: 0,
        textColor: theme.color.primary.DEFAULT,
      };
  }
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
  testID,
}: ButtonProps) {
  const variantStyle = getVariantStyles(variant);
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      testID={testID}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      style={[
        styles.base,
        {
          height: HEIGHTS[size],
          backgroundColor: variantStyle.backgroundColor,
          borderWidth: variantStyle.borderWidth,
          borderColor: (variantStyle as any).borderColor,
          opacity: isDisabled ? 0.5 : 1,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
          paddingHorizontal: size === 'sm' ? theme.space[3] : theme.space[4],
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={
            variant === 'outline' || variant === 'text'
              ? theme.color.primary.DEFAULT
              : theme.color.text.inverse
          }
        />
      ) : (
        <View style={styles.content}>
          {icon && iconPosition === 'left' && (
            <View style={styles.iconLeft}>{icon}</View>
          )}
          <Text
            style={{
              color: variantStyle.textColor,
              fontSize: FONT_SIZES[size],
              fontFamily: theme.font.family.semibold,
              fontWeight: theme.font.weight.semibold,
            }}
            numberOfLines={1}
          >
            {label}
          </Text>
          {icon && iconPosition === 'right' && (
            <View style={styles.iconRight}>{icon}</View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: theme.space[2],
  },
  iconRight: {
    marginLeft: theme.space[2],
  },
});

export default Button;
