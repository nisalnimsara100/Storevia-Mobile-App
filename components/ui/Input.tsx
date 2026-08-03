import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import { theme } from '@/theme';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  containerStyle?: StyleProp<ViewStyle>;
}

const HEIGHTS = { sm: 40, md: 44, lg: 52 };

export function Input({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  size = 'md',
  containerStyle,
  ...textInputProps
}: InputProps) {
  return (
    <View style={containerStyle}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.field,
          {
            height: HEIGHTS[size],
            borderColor: error
              ? theme.color.danger.DEFAULT
              : theme.color.border.DEFAULT,
          },
        ]}
      >
        {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
        <TextInput
          style={styles.input}
          placeholderTextColor={theme.color.text.disabled}
          {...textInputProps}
        />
        {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
      </View>
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: theme.font.size.sm,
    fontFamily: theme.font.family.semibold,
    fontWeight: theme.font.weight.semibold,
    color: theme.color.text.secondary,
    marginBottom: theme.space[1],
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.space[4],
    backgroundColor: theme.color.background.DEFAULT,
  },
  input: {
    flex: 1,
    fontSize: theme.font.size.base,
    color: theme.color.text.primary,
    fontFamily: theme.font.family.regular,
  },
  iconLeft: {
    marginRight: theme.space[2],
  },
  iconRight: {
    marginLeft: theme.space[2],
  },
  errorText: {
    marginTop: theme.space[1],
    fontSize: theme.font.size.xs,
    color: theme.color.danger.DEFAULT,
  },
  helperText: {
    marginTop: theme.space[1],
    fontSize: theme.font.size.xs,
    color: theme.color.text.secondary,
  },
});

export default Input;
