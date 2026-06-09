<div align="center">
  <img src="public/logo.svg" alt="FinPath" width="84" height="84" />
  <h1>FinPath</h1>
  <p><strong>Smart personal finance manager for tracking income, expenses, budgets, fixed bills, and financial goals — built around your own financial month.</strong></p>
  <p>
    🔗 <strong>Live demo:</strong> <a href="https://finpath-app.netlify.app">https://finpath-app.netlify.app</a>
  </p>
</div>

FinPath is an offline-first **Progressive Web App (PWA)** that helps individuals manage their finances with complete privacy. Track income, expenses, budgets, recurring bills, and savings goals while monitoring your financial health through interactive dashboards and analytics.

Unlike traditional finance apps that rely on calendar months, FinPath is built around your own **financial month start date**, allowing you to align budgeting with your salary cycle and personal financial planning.

Everything runs locally in your browser — no account, no server, and no subscription required.

---

# ✨ Features

* 💰 **Income Management** — add recurring or one-time income sources and track total earnings.
* 📊 **Financial Dashboard** — monitor income, expenses, remaining budget, savings rate, goal progress, and financial health score.
* 📅 **Custom Financial Month** — choose your own financial month start day instead of relying on calendar months.
* 🎯 **Financial Goals** — create savings goals, track contributions, monitor progress, and estimate completion dates.
* 💳 **Expense Tracking** — add, edit, duplicate, delete, search, and categorize expenses.
* 📈 **Budget Planning** — create category budgets and receive alerts when approaching or exceeding limits.
* 🔄 **Fixed Expenses** — manage recurring bills such as rent, utilities, subscriptions, and internet services.
* 📉 **Analytics & Insights** — spending trends, category breakdowns, savings analysis, and long-term financial reports.
* 🌍 **Arabic & English** with full RTL/LTR support and instant language switching.
* 🌗 **Dark & Light Themes** with Dark Mode enabled by default.
* 📱 **Installable PWA** with guided Add-to-Home-Screen instructions for iOS, Android, and Desktop.
* 💾 **Local-First Storage** — all data is stored securely in your browser using localStorage.
* 📦 **Import & Export Backups** — backup your data as JSON and restore it anytime.

# 🛠 Tech Stack

|              |                                                          |
| ------------ | -------------------------------------------------------- |
| Framework    | React 19 + React Router                                  |
| Build Tool   | Vite                                                     |
| Styling      | Tailwind CSS                                             |
| Language     | JavaScript / JSX                                         |
| Localization | i18next (Arabic & English)                               |
| Charts       | Recharts                                                 |
| Animation    | Framer Motion                                            |
| Storage      | Browser localStorage with versioning & migration support |
| PWA          | vite-plugin-pwa                                          |

---

# 🚀 Getting Started

## Prerequisites

* **Node.js 18+**
* npm (included with Node.js)

## 1. Clone the Repository

```bash
git clone https://github.com/Yousef-Alsaadan/FinPath.git
cd FinPath
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Start Development Server

```bash
npm run dev
```

Vite will display a local development URL (typically **http://localhost:5173**) in the terminal.

The application supports Hot Module Replacement (HMR) for instant updates during development.

---

# 📦 Available Scripts

| Command   | Description                      |
| --------- | -------------------------------- |
| `dev`     | Start development server         |
| `build`   | Create production build          |
| `preview` | Preview production build locally |
| `lint`    | Run ESLint                       |

Run any script using:

```bash
npm run <script>
```

Example:

```bash
npm run build
```

## Production Build & Preview

```bash
npm run build
npm run preview
```

---

# 🗂 Project Structure

```text
public/                 # Static assets, logos, manifest, SEO files

src/
├─ components/          # Shared UI components and layouts
├─ context/             # Theme, Locale and Data providers
├─ features/            # Onboarding, forms and business features
├─ hooks/               # Custom React hooks
├─ i18n/                # Arabic & English translations
├─ lib/                 # Storage, finance calculations and utilities
├─ pages/               # Application pages
└─ assets/              # Images, icons and visual resources
```

# 💾 Data & Privacy

All user data is stored locally in the browser using `localStorage`.

Stored data includes:

* Income records
* Expense records
* Budgets
* Fixed expenses
* Financial goals
* User preferences
* Theme settings
* Language settings

No information is transmitted to external servers.

If browser storage is cleared, the data will be removed unless a backup has been exported.

---

# 📅 Financial Month System

FinPath uses a custom financial month instead of the traditional calendar month.

Users can choose any start day between 1 and 28.

For example:

* Salary received on the 25th
* Financial month starts on the 25th
* Budget and spending calculations align automatically

When a new financial month begins:

* Monthly expense records are reset
* Budget tracking starts fresh
* Fixed expenses are carried forward
* Historical analytics remain available

This approach provides more accurate budgeting for real-world salary cycles.

---

# 🌐 Localization

FinPath supports:

* English (LTR + Manrope Font)
* Arabic (RTL + Tajawal Font)

Language switching updates:

* UI text
* Navigation
* Forms
* Date formatting
* Layout direction
* Typography

No page refresh required.
