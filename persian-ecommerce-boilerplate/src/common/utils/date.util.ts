/**
 * Mathematical algorithm to convert Jalali (Solar Hijri) to Gregorian date.
 */
export function jalaliToGregorian(
  jy: number,
  jm: number,
  jd: number,
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
  gd: number,
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
 * Parses birthDate input from client:
 * Accepts:
 *  - Shamsi string: "1375/06/21", "۱۳۷۵/۰۶/۲۱", "1375-06-21"
 *  - Gregorian string / ISO: "1996-09-11", "1996-09-11T00:00:00.000Z"
 *  - Date object
 * Always converts and returns a valid Gregorian Date object for PostgreSQL storage.
 */
export function parseBirthDateInput(input?: string | Date | null): Date | null {
  if (!input) return null;
  if (input instanceof Date) return isNaN(input.getTime()) ? null : input;

  // Convert Persian and Arabic digits to English
  const normalized = String(input)
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 1776))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 1632))
    .trim();

  if (!normalized) return null;

  // Match YYYY/MM/DD or YYYY-MM-DD
  const match = normalized.match(/^(\d{4})[/-](\d{1,2})[/-](\d{1,2})/);
  if (match) {
    const y = parseInt(match[1], 10);
    const m = parseInt(match[2], 10);
    const d = parseInt(match[3], 10);

    // If year is Shamsi (e.g. 1300 <= y <= 1450)
    if (y >= 1300 && y <= 1450) {
      if (m >= 1 && m <= 12 && d >= 1 && d <= 31) {
        const { gy, gm, gd } = jalaliToGregorian(y, m, d);
        return new Date(Date.UTC(gy, gm - 1, gd, 12, 0, 0));
      }
    } else if (y >= 1900 && y <= 2100) {
      // Already Gregorian
      return new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
    }
  }

  // Fallback
  const parsed = new Date(normalized);
  return isNaN(parsed.getTime()) ? null : parsed;
}
