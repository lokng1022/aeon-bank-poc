import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';

import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';
import { fontSize, fontWeight } from '@/theme/typography';
import { PrimaryButton } from './PrimaryButton';

interface StateMessageProps {
  title: string;
  description?: string;
  loading?: boolean;
  onRetry?: () => void;
}

export function StateMessage({
  title,
  description,
  loading,
  onRetry,
}: StateMessageProps) {
  const { t } = useTranslation();

  return (
    <View
      style={styles.container}
      accessibilityLiveRegion="polite"
    >
      {loading && (
        <ActivityIndicator
          color={colors.primary}
          size="large"
        />
      )}

      <Text style={styles.title}>{title}</Text>

      {description && (
        <Text style={styles.description}>{description}</Text>
      )}

      {onRetry && (
        <PrimaryButton
          label={t('common.retry')}
          onPress={onRetry}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  title: {
    color: colors.textPrimary,
    fontSize: fontSize.bodyLarge,
    fontWeight: fontWeight.semibold,
    textAlign: 'center',
  },
  description: {
    color: colors.textSecondary,
    fontSize: fontSize.body,
    lineHeight: 22,
    textAlign: 'center',
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    minHeight: 48,
    padding: spacing.md,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.onPrimary,
    fontSize: fontSize.bodyLarge,
    fontWeight: fontWeight.semibold,
  },
});