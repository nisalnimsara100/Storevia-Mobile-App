import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '@/theme';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon,
  title,
  subtitle,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      {icon && <View style={styles.icon}>{icon}</View>}
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {actionLabel && onAction && (
        <Button
          label={actionLabel}
          onPress={onAction}
          variant="primary"
          style={styles.action}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.space[12],
    paddingHorizontal: theme.space[6],
  },
  icon: {
    marginBottom: theme.space[4],
  },
  title: {
    fontSize: theme.font.size.lg,
    fontFamily: theme.font.family.semibold,
    fontWeight: theme.font.weight.semibold,
    color: theme.color.text.primary,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: theme.space[1],
    fontSize: theme.font.size.base,
    color: theme.color.text.secondary,
    textAlign: 'center',
  },
  action: {
    marginTop: theme.space[6],
  },
});

export default EmptyState;
