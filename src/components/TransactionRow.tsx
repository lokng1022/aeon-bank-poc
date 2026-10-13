import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';
import { fontSize, fontWeight } from '@/theme/typography';
import type { Transaction } from '@/types/transaction';
import {
  formatAmount,
  formatTransferDate,
} from '@/utils/formatters';

interface TransactionRowProps {
  transaction: Transaction;
  onSelect: (refId: string) => void;
}

export function TransactionRow({
  transaction,
  onSelect,
}: TransactionRowProps) {
  const { t } = useTranslation();

  const incoming = transaction.amount >= 0;
  const direction = incoming
    ? t('transactions.incoming')
    : t('transactions.outgoing');

  const amount = formatAmount(transaction.amount);
  const date = formatTransferDate(transaction.transferDate);
  const amountColor = incoming ? colors.incoming : colors.outgoing;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${transaction.transferName}, ${transaction.recipientName}, ${direction}, ${amount}, ${date}`}
      accessibilityHint={t('transactions.openDetails')}
      onPress={() => onSelect(transaction.refId)}
      style={({ pressed }) => [
        styles.row,
        pressed && { opacity: 0.7 },
      ]}
      testID={`transaction-${transaction.refId}`}
    >
      <View
        style={styles.icon}
        accessible={false}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <Text style={[styles.arrow, { color: amountColor }]}>
          {incoming ? '↓' : '↑'}
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.topLine}>
          <Text style={styles.name}>
            {transaction.transferName}
          </Text>

          <Text style={[styles.amount, { color: amountColor }]}>
            {amount}
          </Text>
        </View>

        <Text style={styles.recipient}>
          {transaction.recipientName}
        </Text>

        <Text style={styles.meta}>
          {direction} · {date}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceRaised,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    fontSize: fontSize.bodyLarge,
    fontWeight: fontWeight.bold,
  },
  content: {
    flex: 1,
    gap: spacing.xs,
  },
  topLine: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  name: {
    color: colors.textPrimary,
    fontSize: fontSize.bodyLarge,
    fontWeight: fontWeight.semibold,
    flexGrow: 1,
    flexBasis: 120,
  },
  amount: {
    fontSize: fontSize.bodyLarge,
    fontWeight: fontWeight.semibold,
    fontVariant: ['tabular-nums'],
    flexShrink: 1,
  },
  recipient: {
    color: colors.textSecondary,
    fontSize: fontSize.body,
  },
  meta: {
    color: colors.textSecondary,
    fontSize: fontSize.caption,
    lineHeight: 18,
  },
});