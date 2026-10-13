import { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { StateMessage } from '@/components/StateMessage';
import { TransactionRow } from '@/components/TransactionRow';
import { useTransactionStore } from '@/store/transactionStore';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';
import { fontSize, fontWeight } from '@/theme/typography';
import type { Transaction } from '@/types/transaction';

interface TransactionListScreenProps {
  onSelect: (refId: string) => void;
}

export function TransactionListScreen({
  onSelect,
}: TransactionListScreenProps) {
  const { t } = useTranslation();

  const transactions = useTransactionStore((s) => s.transactions);
  const isLoading = useTransactionStore((s) => s.isLoading);
  const error = useTransactionStore((s) => s.error);
  const fetchTransactions = useTransactionStore(
    (s) => s.fetchTransactions,
  );

  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    let active = true;

    void fetchTransactions().finally(() => {
      if (active) {
        setHasFetched(true);
      }
    });

    return () => {
      active = false;
    };
  }, [fetchTransactions]);

  const reload = useCallback(() => {
    void fetchTransactions();
  }, [fetchTransactions]);

  const renderItem = useCallback(
    ({ item }: { item: Transaction }) => (
      <TransactionRow
        transaction={item}
        onSelect={onSelect}
      />
    ),
    [onSelect],
  );

  const showLoading =
    transactions.length === 0 && (!hasFetched || isLoading);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {t('transactions.title')}
          </Text>
        </View>

        <View style={styles.panel}>
          <FlatList
            data={transactions}
            keyExtractor={(item) => item.refId}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            ItemSeparatorComponent={Separator}
            ListHeaderComponent={
              <View>
                <Text style={styles.heading}>
                  {t('transactions.heading')}
                </Text>

                {error && transactions.length > 0 && (
                  <StateMessage
                    title={t('errors.refreshFailed')}
                    onRetry={reload}
                  />
                )}
              </View>
            }
            ListEmptyComponent={
              showLoading ? (
                <StateMessage
                  title={t('transactions.loading')}
                  loading={!hasFetched}
                />
              ) : error ? (
                <StateMessage
                  title={t('errors.FETCH_TRANSACTIONS_FAILED')}
                  onRetry={reload}
                />
              ) : (
                <StateMessage
                  title={t('transactions.emptyTitle')}
                  description={t('transactions.emptyDescription')}
                />
              )
            }
            refreshControl={
              <RefreshControl
                refreshing={
                  isLoading &&
                  (hasFetched || transactions.length > 0)
                }
                onRefresh={reload}
                tintColor={colors.primary}
                colors={[colors.primary]}
              />
            }
            alwaysBounceVertical
            testID="transaction-list"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

function Separator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    width: '100%',
    maxWidth: 680,
    alignSelf: 'center',
  },
  header: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  title: {
    color: colors.textPrimary,
    fontSize: fontSize.title,
    fontWeight: fontWeight.bold,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: fontSize.body,
  },
  panel: {
    flex: 1,
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    overflow: 'hidden',
  },
  listContent: {
    flexGrow: 1,
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  heading: {
    color: colors.textSecondary,
    fontSize: fontSize.bodyLarge,
    marginBottom: spacing.sm,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
});