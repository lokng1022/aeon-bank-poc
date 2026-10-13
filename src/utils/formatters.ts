const amountFormatter = new Intl.NumberFormat('en-MY', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZone: 'Asia/Kuala_Lumpur',
});

export function formatAmount(amount: number): string {
  const sign = amount < 0 ? '−' : '+';

  return `${sign} RM ${amountFormatter.format(Math.abs(amount))}`;
}

export function formatTransferDate(value: string): string {
  return dateFormatter.format(new Date(value)).replace(',', '');
}