import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { theme } from '@/theme';

export type InputVariant = 'outlined' | 'filled';
export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  /** Control rendered at the far end of the label row, e.g. a "Forgot?" link. */
  labelAccessory?: React.ReactNode;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  /**
   * Masks the input and renders a show/hide eye. The reveal state is owned
   * here so a screen with several password fields doesn't need one piece of
   * state per field.
   */
  secureToggle?: boolean;
  variant?: InputVariant;
  size?: InputSize;
  containerStyle?: StyleProp<ViewStyle>;
  fieldStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
}

const HEIGHTS: Record<InputSize, number> = { sm: 40, md: 44, lg: 52 };

export function Input({
  label,
  labelAccessory,
  error,
  helperText,
  leftIcon,
  rightIcon,
  secureToggle = false,
  variant = 'outlined',
  size = 'md',
  containerStyle,
  fieldStyle,
  inputStyle,
  secureTextEntry,
  ...textInputProps
}: InputProps) {
  const [revealed, setRevealed] = React.useState(false);
  const masked = (secureToggle || secureTextEntry) && !revealed;

  return (
    <View style={containerStyle}>
      {label ? (
        <View style={styles.labelRow}>
          <Text style={styles.label}>{label}</Text>
          {labelAccessory}
        </View>
      ) : null}

      <View
        testID={textInputProps.testID ? `${textInputProps.testID}-field` : 'input-field'}
        style={[
          styles.field,
          variant === 'filled' ? styles.fieldFilled : styles.fieldOutlined,
          { minHeight: HEIGHTS[size] },
          error ? styles.fieldError : null,
          fieldStyle,
        ]}
      >
        {leftIcon ? <View style={styles.iconLeft}>{leftIcon}</View> : null}

        <TextInput
          {...textInputProps}
          style={[styles.input, inputStyle]}
          placeholderTextColor={theme.color.text.disabled}
          secureTextEntry={masked}
        />

        {secureToggle ? (
          <TouchableOpacity
            style={styles.iconRight}
            onPress={() => setRevealed((visible) => !visible)}
            disabled={textInputProps.editable === false}
            accessibilityRole="button"
            accessibilityLabel={revealed ? 'Hide password' : 'Show password'}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name={revealed ? 'eye' : 'eye-off-outline'}
              size={18}
              color={theme.color.text.secondary}
            />
          </TouchableOpacity>
        ) : rightIcon ? (
          <View style={styles.iconRight}>{rightIcon}</View>
        ) : null}
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
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.space[1],
  },
  label: {
    fontSize: theme.font.size.sm,
    fontFamily: theme.font.family.semibold,
    fontWeight: theme.font.weight.semibold,
    color: theme.color.text.secondary,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.space[3],
  },
  fieldOutlined: {
    borderWidth: 1,
    borderColor: theme.color.border.DEFAULT,
    backgroundColor: theme.color.background.DEFAULT,
  },
  fieldFilled: {
    borderWidth: 0,
    backgroundColor: theme.color.neutral[100],
  },
  fieldError: { borderWidth: 1, borderColor: theme.color.danger.DEFAULT },
  input: {
    flex: 1,
    paddingVertical: theme.space[3],
    fontSize: theme.font.size.base,
    // Explicit: without a family the input silently falls back to the OS font,
    // and without letterSpacing some Android fonts space the placeholder out.
    fontFamily: theme.font.family.regular,
    letterSpacing: 0,
    includeFontPadding: false,
    color: theme.color.text.primary,
  },
  iconLeft: { marginRight: theme.space[2] },
  iconRight: { marginLeft: theme.space[2] },
  errorText: {
    marginTop: theme.space[1],
    fontSize: theme.font.size.xs,
    fontFamily: theme.font.family.regular,
    color: theme.color.danger.DEFAULT,
  },
  helperText: {
    marginTop: theme.space[1],
    fontSize: theme.font.size.xs,
    fontFamily: theme.font.family.regular,
    color: theme.color.text.secondary,
  },
});

export default Input;
