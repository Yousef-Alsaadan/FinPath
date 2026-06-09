// Currency is rendered with the SAR icon component in the UI; this returns the
// numeric part formatted for the active locale. We avoid the built-in currency
// symbol so the custom SAR glyph can be placed beside the number.

export function formatNumber(value, lang) {
  const locale = lang === 'ar' ? 'ar-SA' : 'en-US'
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(value) || 0)
}

export function formatCurrency(value, lang, currency = 'SAR') {
  const locale = lang === 'ar' ? 'ar-SA' : 'en-US'
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(Number(value) || 0)
}

export function formatDate(dateStr, lang, opts = { day: 'numeric', month: 'short', year: 'numeric' }) {
  const locale = lang === 'ar' ? 'ar-SA' : 'en-US'
  return new Intl.DateTimeFormat(locale, opts).format(new Date(dateStr))
}

export function formatMonth(date, lang) {
  const locale = lang === 'ar' ? 'ar-SA' : 'en-US'
  return new Intl.DateTimeFormat(locale, { month: 'short', year: '2-digit' }).format(new Date(date))
}

export const todayISO = () => new Date().toISOString().slice(0, 10)
