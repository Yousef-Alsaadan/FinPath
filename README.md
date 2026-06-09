# FinPath — Personal Finance Manager

A production-ready, bilingual (Arabic / English) personal finance PWA for tracking
expenses, income, budgets, fixed bills and savings goals — built around your own
**financial month** rather than the calendar month.

Built with **React + Vite + Tailwind CSS + React Router + i18next + Recharts +
Framer Motion**, with all data stored locally in the browser (no account, no server).

---

## Quick start

```bash
npm install
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # production build into dist/
npm run preview  # preview the production build
npm run lint     # run ESLint
```

Requires Node 18+ (developed on Node 22).

---

## Features

- **First-run onboarding** — 5-step wizard: financial month start day → income →
  expense categories → first goal → PWA install guide (with device detection).
- **Dashboard** — income / expenses / remaining / savings-rate KPIs, financial health
  ring, monthly spend area chart, category pie breakdown, budget utilization, goal cards.
- **Expenses** — add / edit / duplicate / delete, search and category filter, scoped to
  the current financial month.
- **Income** — recurring or one-time sources with categorization.
- **Budgets** — per-category limits with on-track / approaching / over-limit alerts.
- **Goals** — target, monthly contribution, progress %, estimated completion date,
  and a contribution tracker.
- **Fixed expenses** — recurring bills automatically carried forward each financial
  month, each markable Paid / Partial / Unpaid per period.
- **Analytics** — income-vs-expense bars, savings trend line, per-month savings rate,
  and lifetime spending by category.
- **Settings** — financial month start day, currency, theme, language, and full
  JSON backup export / import / reset.

## Financial month logic

Instead of the calendar month, FinPath resets on a user-chosen day (1–28). Monthly
records (expenses, budget tracking) reflect the current period, while historical
analytics, goal progress and income history are retained for long-term trends.
See `src/lib/finance.js`.

## Theming & localization

- Dark theme by default; light theme; preference persisted to `localStorage`.
- Arabic (RTL, **Tajawal** font) and English (LTR, **Manrope** font) with automatic
  direction and font switching; language persisted.
- All amounts render with the custom SAR currency glyph.

## Data, PWA & SEO

- LocalStorage persistence with schema **versioning + migration scaffold** and
  import/export (`src/lib/storage.js`).
- Installable PWA with offline service worker and app manifest (`vite-plugin-pwa`).
- SEO: semantic HTML, canonical URL, Open Graph / Twitter cards, `robots.txt`,
  `sitemap.xml`, and JSON-LD (`WebApplication`, `Organization`, `FAQPage`) for
  search and generative-engine discoverability.

## Project structure

```
src/
  components/   Layout, UI primitives, Logo, toggles, error boundary
  context/      Theme, Locale, Data (useReducer + localStorage) providers
  features/     Entity forms + onboarding wizard
  hooks/        useMediaQuery
  i18n/         i18next setup + en/ar translation trees
  lib/          constants, finance math, storage, formatting, icon registry
  pages/        Dashboard, Expenses, Income, Budgets, Goals, FixedExpenses, Analytics, Settings
```

## Notes

- Routes are lazy-loaded and vendor bundles are split (react / charts / motion / i18n)
  for fast first paint.
- Icons use named imports via a small registry (`src/lib/icons.js`) so the bundle
  stays small.
- Everything runs client-side; clearing browser storage clears all data — use
  **Settings → Export backup** to keep a copy.
