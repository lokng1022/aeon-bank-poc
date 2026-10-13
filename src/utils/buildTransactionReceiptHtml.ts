import type { TFunction } from 'i18next';

import type { Transaction } from '@/types/transaction';
import { formatAmount, formatTransferDate } from '@/utils/formatters';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function buildTransactionReceiptHtml(
  transaction: Transaction,
  t: TFunction,
): string {
  const incoming = transaction.amount >= 0;

  const fields: ReadonlyArray<readonly [string, string]> = [
    [t('receipt.referenceId'), transaction.refId],
    [t('receipt.transferName'), transaction.transferName],
    [t('receipt.recipient'), transaction.recipientName],
    [
      t('receipt.date'),
      `${formatTransferDate(transaction.transferDate)} (UTC+08:00)`,
    ],
    [
      t('receipt.direction'),
      t(incoming ? 'transactions.incoming' : 'transactions.outgoing'),
    ],
  ];

  const rows = fields
    .map(
      ([label, value]) => `
        <tr>
          <th scope="row">${escapeHtml(label)}</th>
          <td>${escapeHtml(value)}</td>
        </tr>
      `,
    )
    .join('');

  return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>${escapeHtml(t('receipt.heading'))}</title>

        <style>
          @page { size: A4; margin: 24px; }
          * { box-sizing: border-box; }

          body {
            margin: 0;
            background: #fff;
            color: #171717;
            font-family: Arial, sans-serif;
          }

          .receipt {
            padding: 28px;
            border: 1px solid #ddd;
            border-top: 6px solid #D6A07A;
          }

          .brand { margin: 0 0 8px; font-size: 12px; color: #555; }
          h1 { margin: 0 0 28px; font-size: 24px; }
          .caption { margin: 0 0 8px; font-size: 13px; color: #555; }
          .amount { margin: 0 0 28px; font-size: 32px; font-weight: 700; }
          .incoming { color: #087544; }
          .outgoing { color: #B42318; }

          table {
            width: 100%;
            table-layout: fixed;
            border-collapse: collapse;
            font-size: 14px;
          }

          tr { break-inside: avoid; }

          th, td {
            padding: 14px 0;
            border-bottom: 1px solid #eee;
            text-align: left;
            vertical-align: top;
            overflow-wrap: anywhere;
          }

          th {
            width: 40%;
            padding-right: 16px;
            color: #555;
            font-weight: 400;
          }

          .footer {
            margin: 24px 0 0;
            color: #555;
            font-size: 11px;
            line-height: 1.5;
          }
        </style>
      </head>

      <body>
        <main class="receipt">
          <p class="brand">${escapeHtml(t('receipt.brand'))}</p>
          <h1>${escapeHtml(t('receipt.heading'))}</h1>

          <p class="caption">${escapeHtml(t('receipt.amountCaption'))}</p>
          <p class="amount ${incoming ? 'incoming' : 'outgoing'}">
            ${escapeHtml(formatAmount(transaction.amount))}
          </p>

          <table><tbody>${rows}</tbody></table>

          <p class="footer">${escapeHtml(t('receipt.demoNote'))}</p>
        </main>
      </body>
    </html>`;
}