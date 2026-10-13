import { useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { DetailField } from '@/components/DetailField';
import { PrimaryButton } from '@/components/PrimaryButton';
import { StateMessage } from '@/components/StateMessage';
import {
    PdfSharingUnavailableError,
    shareReceiptPdf,
} from '@/services/receiptShareService';
import { useTransactionStore } from '@/store/transactionStore';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';
import { fontSize, fontWeight } from '@/theme/typography';
import { buildTransactionReceiptHtml } from '@/utils/buildTransactionReceiptHtml';
import {
    formatAmount,
    formatTransferDate,
} from '@/utils/formatters';

interface TransactionDetailScreenProps {
    refId: string;
}

export function TransactionDetailScreen({
    refId,
}: TransactionDetailScreenProps) {
    const { t } = useTranslation();

    const transaction = useTransactionStore(
        (state) => state.getTransactionByRefId(refId),
    );

    const [isSharing, setIsSharing] = useState(false);
    const [shareError, setShareError] = useState<
        'errors.shareFailed' | 'errors.pdfUnavailable' | null
    >(null);

    async function handleSharePdf(): Promise<void> {
        if (!transaction) return;

        setIsSharing(true);
        setShareError(null);

        try {
            const html = buildTransactionReceiptHtml(transaction, t);

            await shareReceiptPdf(html, t('receipt.sharePdf'));
        } catch (error: unknown) {
            setShareError(
                error instanceof PdfSharingUnavailableError
                    ? 'errors.pdfUnavailable'
                    : 'errors.shareFailed',
            );
        } finally {
            setIsSharing(false);
        }
    }

    if (!transaction) {
        return (
            <SafeAreaView
                edges={['left', 'right', 'bottom']}
                style={styles.screen}
            >
                <StateMessage
                    title={t('receipt.unavailableTitle')}
                    description={t('receipt.unavailableDescription')}
                />
            </SafeAreaView>
        );
    }

    const incoming = transaction.amount >= 0;

    return (
        <SafeAreaView
            edges={['left', 'right', 'bottom']}
            style={styles.screen}
        >
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.card}>
                    <Text style={styles.caption}>
                        {t('receipt.amountCaption')}
                    </Text>

                    <Text
                        style={[
                            styles.amount,
                            {
                                color: incoming
                                    ? colors.incoming
                                    : colors.outgoing,
                            },
                        ]}
                    >
                        {formatAmount(transaction.amount)}
                    </Text>

                    <Text style={styles.direction}>
                        {incoming
                            ? t('transactions.incoming')
                            : t('transactions.outgoing')}
                    </Text>

                    <DetailField
                        label={t('receipt.transferName')}
                        value={transaction.transferName}
                    />

                    <DetailField
                        label={t('receipt.referenceId')}
                        value={transaction.refId}
                    />

                    <DetailField
                        label={t('receipt.recipient')}
                        value={transaction.recipientName}
                    />

                    <DetailField
                        label={t('receipt.date')}
                        value={`${formatTransferDate(transaction.transferDate)} (UTC+08:00)`}
                    />
                </View>

                {shareError && (
                    <Text
                        accessibilityRole="alert"
                        accessibilityLiveRegion="polite"
                        style={styles.error}
                    >
                        {t(shareError)}
                    </Text>
                )}

                <PrimaryButton
                    label={
                        isSharing
                            ? t('receipt.sharing')
                            : t('receipt.sharePdf')
                    }
                    onPress={() => void handleSharePdf()}
                    loading={isSharing}
                    testID="share-receipt-pdf"
                />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        padding: spacing.md,
        gap: spacing.md,
        width: '100%',
        maxWidth: 680,
        alignSelf: 'center',
    },
    card: {
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        padding: spacing.lg,
    },
    caption: {
        color: colors.textSecondary,
        fontSize: fontSize.body,
        marginBottom: spacing.sm,
    },
    amount: {
        fontSize: fontSize.amount,
        fontWeight: fontWeight.bold,
        fontVariant: ['tabular-nums'],
    },
    direction: {
        color: colors.textSecondary,
        fontSize: fontSize.body,
        marginTop: spacing.sm,
        marginBottom: spacing.md,
    },
    error: {
        color: colors.outgoing,
        fontSize: fontSize.body,
        lineHeight: 22,
    },
});