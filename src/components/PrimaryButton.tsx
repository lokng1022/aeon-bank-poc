import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
} from 'react-native';

import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';
import { fontSize, fontWeight } from '@/theme/typography';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  testID?: string;
}

export function PrimaryButton({
  label,
  onPress,
  loading = false,
  testID,
}: PrimaryButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{
        disabled: loading,
        busy: loading,
      }}
      disabled={loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        (pressed || loading) && { opacity: 0.7 },
      ]}
      testID={testID}
    >
      {loading && (
        <ActivityIndicator color={colors.onPrimary} />
      )}

      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    padding: spacing.md,
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: colors.onPrimary,
    fontSize: fontSize.bodyLarge,
    fontWeight: fontWeight.semibold,
    flexShrink: 1,
  },
});