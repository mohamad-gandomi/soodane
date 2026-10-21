import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines class names with Tailwind merge support.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Convert numbers or strings to Persian localized numbers with thousand separators.
 */
export function toFa(number: number | string | null | undefined): string {
  if (number === null || number === undefined || number === '') return '۰';
  const num = typeof number === 'string' ? parseFloat(number) : number;
  if (isNaN(num)) return '۰';
  return num.toLocaleString('fa-IR');
}

/**
 * Convert Latin digits in any string to Persian digits.
 */
export function toFaDigits(str: string | number | null | undefined): string {
  if (str === null || str === undefined) return '';
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(str).replace(/[0-9]/g, (w) => persianDigits[+w]);
}

/**
 * Format currency in Toman with Persian formatting.
 */
export function formatMoney(amount: number | string | null | undefined): string {
  return `${toFa(amount)} تومان`;
}

/**
 * Calculate discount percentage between original price and discounted price.
 */
export function calculateDiscount(price: number, oldPrice?: number | null): number {
  if (!oldPrice || oldPrice <= price) return 0;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}

// Order numbers can contain letters and UUIDs; preserve their full identity.
export function formatOrderNumber(value: string): string {
  return String(value).replace(/\d/g, digit => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)]);
}
