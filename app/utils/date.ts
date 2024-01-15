import { defaultLocale, enGbLocale } from './locale.constants';

export const invalidDateStr = 'Invalid Date';

/**
 * Convert date to formatted string.
 * @param date
 * @param options
 * @returns
 */
export function dateToString(
  date: Date,
  options?: {
    locale?: string;
    showTime?: boolean;
    style?: Intl.DateTimeFormatOptions['dateStyle'];
  },
) {
  const { locale, showTime, style } = {
    showTime: false,
    locale: defaultLocale,
    style: 'short' as const,
    ...options,
  };

  try {
    const dateStr = new Intl.DateTimeFormat(locale, {
      dateStyle: style,
      timeStyle: showTime ? style : undefined,
    }).format(date);

    // remove en-GB date/time comma separator e.g. "01/01/1970, 00:00"
    return locale === enGbLocale ? dateStr.replace(/,/g, '') : dateStr;
  } catch {
    return invalidDateStr;
  }
}

/**
 * Get the relative time based on the difference between now and the date parameter.
 * e.g. "15 minutes ago"
 * @param date
 */
export function getRelativeTime(date: Date) {
  const formatter = new Intl.RelativeTimeFormat(defaultLocale, {
    numeric: 'auto',
  });

  const units = [
    { amount: 60, name: 'seconds' },
    { amount: 60, name: 'minutes' },
    { amount: 24, name: 'hours' },
    { amount: 7, name: 'days' },
    { amount: 4.34524, name: 'weeks' },
    { amount: 12, name: 'months' },
    { amount: Infinity, name: 'years' },
  ] as const;

  // initial duration in seconds
  let duration = (date.getTime() - new Date().getTime()) / 1000;

  // iterative over the units until we find the appropriate amount
  for (const unit of units) {
    if (Math.abs(duration) < unit.amount) {
      return formatter.format(Math.round(duration), unit.name);
    }

    // convert the duration to the next unit
    duration /= unit.amount;
  }

  return undefined;
}
