import { APP_CURRENCY, APP_LOCALE } from './config';

const currencyFormatter = new Intl.NumberFormat(APP_LOCALE, { style: 'currency', currency: APP_CURRENCY });
const percentFormatter = new Intl.NumberFormat(APP_LOCALE, { maximumFractionDigits: 2 });
const fullDateFormatter = new Intl.DateTimeFormat(APP_LOCALE, { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
const weekdayFormatter = new Intl.DateTimeFormat(APP_LOCALE, { weekday: 'short', timeZone: 'UTC' });
const monthFormatter = new Intl.DateTimeFormat(APP_LOCALE, { month: 'short', timeZone: 'UTC' });

export function formatCurrency(amount: number): string {
  return currencyFormatter.format(amount);
}

export function formatPercent(value: number): string {
  return `${percentFormatter.format(value)}%`;
}

export function formatDate(date: Date): string {
  return fullDateFormatter.format(date);
}

export function formatWeekday(date: Date): string {
  return weekdayFormatter.format(date).replace('.', '');
}

export function formatMonth(date: Date): string {
  return monthFormatter.format(date).replace('.', '');
}
