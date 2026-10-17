import { toFaDigits } from './utils';

/**
 * Standard Solar Hijri (Jalali) months in Persian
 */
export const SHAMSI_MONTHS = [
  { value: 1, label: 'فروردین', days: 31 },
  { value: 2, label: 'اردیبهشت', days: 31 },
  { value: 3, label: 'خرداد', days: 31 },
  { value: 4, label: 'تیر', days: 31 },
  { value: 5, label: 'مرداد', days: 31 },
  { value: 6, label: 'شهریور', days: 31 },
  { value: 7, label: 'مهر', days: 30 },
  { value: 8, label: 'آبان', days: 30 },
  { value: 9, label: 'آذر', days: 30 },
  { value: 10, label: 'دی', days: 30 },
  { value: 11, label: 'بهمن', days: 30 },
  { value: 12, label: 'اسفند', days: 29 }, // 30 in leap years
];

/**
 * Mathematical algorithm to convert Jalali (Solar Hijri) to Gregorian date.
 */
export function jalaliToGregorian(
  jy: number,
  jm: number,
  jd: number
): { gy: number; gm: number; gd: number } {
  jy += 1595;
  let days =
    -355668 +
    365 * jy +
    Math.floor(jy / 33) * 8 +
    Math.floor(((jy % 33) + 3) / 4) +
    jd +
    (jm < 7 ? (jm - 1) * 31 : (jm - 7) * 30 + 186);
  let gy = 400 * Math.floor(days / 146097);
  days %= 146097;
  if (days > 36524) {
    gy += 100 * Math.floor(--days / 36524);
    days %= 36524;
    if (days >= 365) days++;
  }
  gy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) {
    gy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }
  let gd = days + 1;
  const sal_a = [
    0,
    31,
    (gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0 ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];
  let gm = 0;
  for (gm = 0; gm < 13 && gd > sal_a[gm]; gm++) {
    gd -= sal_a[gm];
  }
  return { gy, gm, gd };
}

/**
 * Mathematical algorithm to convert Gregorian to Jalali (Solar Hijri) date.
 */
export function gregorianToJalali(
  gy: number,
  gm: number,
  gd: number
): { jy: number; jm: number; jd: number } {
  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  let jy = gy <= 1600 ? 0 : 979;
  gy -= gy <= 1600 ? 621 : 1600;
  const gy2 = gm > 2 ? gy + 1 : gy;
  let days =
    365 * gy +
    Math.floor((gy2 + 3) / 4) -
    Math.floor((gy2 + 99) / 100) +
    Math.floor((gy2 + 399) / 400) -
    80 +
    gd +
    g_d_m[gm - 1];
  jy += 33 * Math.floor(days / 12053);
  days %= 12053;
  jy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) {
    jy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }
  const jm =
    days < 186 ? 1 + Math.floor(days / 31) : 7 + Math.floor((days - 186) / 30);
  const jd = 1 + (days < 186 ? days % 31 : (days - 186) % 30);
  return { jy, jm, jd };
}

/**
 * Convert any digits (Persian/Arabic) to English ASCII digits
 */
export function toEnglishDigits(str: string | number | null | undefined): string {
  if (!str) return '';
  return String(str)
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 1776))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 1632));
}

/**
 * Converts a Gregorian Date or ISO string into a Persian formatted date string: YYYY/MM/DD
 * e.g. "1996-09-11T00:00:00.000Z" -> "۱۳۷۵/۰۶/۲۱"
 */
export function gregorianToShamsiString(
  dateInput?: string | Date | null,
  usePersianDigits = true
): string {
  if (!dateInput) return '';
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(d.getTime())) return '';

  const gy = d.getUTCFullYear();
  const gm = d.getUTCMonth() + 1;
  const gd = d.getUTCDate();

  const { jy, jm, jd } = gregorianToJalali(gy, gm, gd);
  const pad = (n: number) => String(n).padStart(2, '0');
  const result = `${jy}/${pad(jm)}/${pad(jd)}`;

  return usePersianDigits ? toFaDigits(result) : result;
}

/**
 * Converts a Shamsi date string (e.g. "۱۳۷۵/۰۶/۲۱" or "1375/6/21")
 * into a Gregorian ISO string (e.g. "1996-09-11T00:00:00.000Z") for database storage.
 */
export function shamsiToGregorianIso(shamsiStr?: string | null): string | null {
  if (!shamsiStr) return null;
  const clean = toEnglishDigits(shamsiStr).trim();
  const match = clean.match(/^(\d{4})[/-](\d{1,2})[/-](\d{1,2})$/);
  if (!match) return null;

  const y = parseInt(match[1], 10);
  const m = parseInt(match[2], 10);
  const d = parseInt(match[3], 10);

  if (y < 1300 || y > 1450 || m < 1 || m > 12 || d < 1 || d > 31) {
    return null;
  }

  const { gy, gm, gd } = jalaliToGregorian(y, m, d);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${gy}-${pad(gm)}-${pad(gd)}T00:00:00.000Z`;
}

/**
 * Auto-masks user input into strictly formatted Shamsi date: YYYY/MM/DD
 * As the user types digits, it automatically inserts the slashes.
 */
export function maskShamsiDateInput(
  rawInput: string,
  prevValue = ''
): { displayValue: string; rawDigits: string; isValid: boolean } {
  const isDeleting = rawInput.length < prevValue.length;
  const eng = toEnglishDigits(rawInput);

  let digits = '';
  // If input already has slashes (e.g. from picker or copy-paste: "1375/6/22" or "1375/06/22")
  if (rawInput.includes('/')) {
    const parts = eng.split('/');
    if (parts.length === 3 && parts[0].replace(/\D/g, '').length === 4) {
      const y = parts[0].replace(/\D/g, '').slice(0, 4);
      const m = parts[1].replace(/\D/g, '').padStart(2, '0').slice(0, 2);
      const d = parts[2].replace(/\D/g, '').padStart(2, '0').slice(0, 2);
      digits = `${y}${m}${d}`;
    } else {
      digits = eng.replace(/\D/g, '').slice(0, 8);
    }
  } else {
    digits = eng.replace(/\D/g, '').slice(0, 8); // Max 8 digits (YYYYMMDD)
  }

  // If user hit backspace on a slash, remove the digit before it
  if (isDeleting && (prevValue.endsWith('/') || prevValue.length === 5 || prevValue.length === 8)) {
    if (eng.length === prevValue.length - 1 && digits.length === toEnglishDigits(prevValue).replace(/\D/g, '').length) {
      digits = digits.slice(0, -1);
    }
  }

  let formatted = '';
  if (digits.length > 0) {
    // Year (up to 4 digits)
    formatted = digits.slice(0, 4);
    if (digits.length >= 4) {
      // Slashes after year
      if (digits.length > 4) {
        // Month (up to 2 digits)
        const monthPart = digits.slice(4, 6);
        formatted += '/' + monthPart;

        if (digits.length > 6) {
          // Day (up to 2 digits)
          const dayPart = digits.slice(6, 8);
          formatted += '/' + dayPart;
        }
      } else if (!isDeleting) {
        formatted += '/';
      }
    }
  }

  const isValid = isValidShamsiDate(formatted);
  const displayValue = toFaDigits(formatted);

  return {
    displayValue,
    rawDigits: digits,
    isValid,
  };
}

/**
 * Validates if the string is a complete and valid Shamsi date (YYYY/MM/DD)
 */
export function isValidShamsiDate(shamsiStr: string): boolean {
  const clean = toEnglishDigits(shamsiStr).trim();
  const match = clean.match(/^(\d{4})\/(\d{2})\/(\d{2})$/);
  if (!match) return false;

  const y = parseInt(match[1], 10);
  const m = parseInt(match[2], 10);
  const d = parseInt(match[3], 10);

  if (y < 1300 || y > 1430) return false;
  if (m < 1 || m > 12) return false;

  // Day limits per month
  let maxDays = 30;
  if (m <= 6) maxDays = 31;
  else if (m <= 11) maxDays = 30;
  else maxDays = isJalaliLeapYear(y) ? 30 : 29;

  return d >= 1 && d <= maxDays;
}

/**
 * Checks if a Jalali year is a leap year (kabiseh)
 */
export function isJalaliLeapYear(jy: number): boolean {
  const r = (jy % 33);
  return [1, 5, 9, 13, 17, 22, 26, 30].includes(r);
}

/**
 * Formats a timestamp into a natural, friendly relative Persian date/time:
 * - "هم‌اکنون"
 * - "۱۵ دقیقه پیش"
 * - "امروز، ساعت ۱۴:۳۰"
 * - "دیروز، ساعت ۱۱:۱۵"
 * - "۳ روز پیش"
 * - "۱۴۰۵/۰۷/۱۵"
 */
export function formatRelativeShamsiTime(dateInput?: string | Date | null): string {
  if (!dateInput) return '';
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(d.getTime())) return '';

  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  const pad = (n: number) => String(n).padStart(2, '0');

  if (diffMinutes < 1) return 'هم‌اکنون';
  if (diffMinutes < 60) return `${toFaDigits(diffMinutes)} دقیقه پیش`;

  const isToday =
    now.getFullYear() === d.getFullYear() &&
    now.getMonth() === d.getMonth() &&
    now.getDate() === d.getDate();

  if (isToday) {
    return `امروز، ${toFaDigits(pad(d.getHours()))}:${toFaDigits(pad(d.getMinutes()))}`;
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    yesterday.getFullYear() === d.getFullYear() &&
    yesterday.getMonth() === d.getMonth() &&
    yesterday.getDate() === d.getDate();

  if (isYesterday) {
    return `دیروز، ${toFaDigits(pad(d.getHours()))}:${toFaDigits(pad(d.getMinutes()))}`;
  }

  if (diffDays > 0 && diffDays < 7) {
    return `${toFaDigits(diffDays)} روز پیش`;
  }

  return gregorianToShamsiString(d);
}

