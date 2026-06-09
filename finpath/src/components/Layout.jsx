import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiGrid,
  FiTrendingDown,
  FiTrendingUp,
  FiPieChart,
  FiTarget,
  FiRepeat,
  FiBarChart2,
  FiSettings,
  FiPlus,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi'
import { Logo } from './Logo'
import { ThemeToggle, LangToggle } from './Toggles'
import { Modal } from './ui'
import { ExpenseForm } from '../features/EntityForms'
import { useData } from '../context/DataContext'
import { useLocale } from '../context/LocaleContext'
import { useIsDesktop } from '../hooks/useMediaQuery'

const NAV = [
  { to: '/', icon: FiGrid, key: 'dashboard', end: true },
  { to: '/expenses', icon: FiTrendingDown, key: 'expenses' },
  { to: '/income', icon: FiTrendingUp, key: 'income' },
  { to: '/budgets', icon: FiPieChart, key: 'budgets' },
  { to: '/goals', icon: FiTarget, key: 'goals' },
  { to: '/fixed', icon: FiRepeat, key: 'fixed' },
  { to: '/analytics', icon: FiBarChart2, key: 'analytics' },
  { to: '/settings', icon: FiSettings, key: 'settings' },
]

// Items shown in the mobile bottom bar (quick-add sits in the middle)
const MOBILE_NAV = [NAV[0], NAV[1], NAV[3], NAV[4]]

function NavItem({ item, collapsed }) {
  const { t } = useTranslation()
  const Icon = item.icon
  return (
    <NavLink
      to={item.to}
      end={item.end}
      className={({ isActive }) =>
        `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
          isActive ? '' : 'opacity-70 hover:opacity-100'
        }`
      }
      style={({ isActive }) =>
        isActive
          ? { background: 'var(--surface-2)', color: 'var(--accent)' }
          : { color: 'var(--text)' }
      }
      title={t(`nav.${item.key}`)}
    >
      <Icon size={18} className="shrink-0" />
      {!collapsed && <span className="truncate">{t(`nav.${item.key}`)}</span>}
    </NavLink>
  )
}

export function Layout() {
  const { t } = useTranslation()
  const { dir } = useLocale()
  const data = useData()
  const location = useLocation()
  const isDesktop = useIsDesktop()
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem('finpath.sidebar') === 'collapsed'
  )
  const [quickAdd, setQuickAdd] = useState(false)

  const toggleCollapse = () => {
    setCollapsed((c) => {
      localStorage.setItem('finpath.sidebar', !c ? 'collapsed' : 'open')
      return !c
    })
  }

  const Chevron = dir === 'rtl' ? FiChevronRight : FiChevronLeft

  return (
    <div className="min-h-screen">
      {/* Desktop sidebar */}
      <aside
        className="fixed inset-y-0 z-30 hidden flex-col border-e p-3 transition-[width] duration-300 lg:flex"
        style={{
          width: collapsed ? 76 : 248,
          background: 'var(--surface)',
          insetInlineStart: 0,
        }}
      >
        <div className="flex items-center justify-between px-1 py-2">
          {collapsed ? <Logo compact /> : <Logo className="h-7 w-auto" />}
        </div>
        <nav className="mt-4 flex flex-1 flex-col gap-1">
          {NAV.map((item) => (
            <NavItem key={item.to} item={item} collapsed={collapsed} />
          ))}
        </nav>
        <div className={`flex items-center gap-2 ${collapsed ? 'flex-col' : ''}`}>
          <ThemeToggle />
          <LangToggle />
          <button
            onClick={toggleCollapse}
            className="btn-ghost ms-auto grid h-9 w-9 place-items-center rounded-lg"
            aria-label="Collapse sidebar"
          >
            <Chevron />
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header
        className="sticky top-0 z-20 flex items-center justify-between border-b px-4 py-3 lg:hidden"
        style={{ background: 'var(--surface)' }}
      >
        <Logo className="h-7 w-auto" />
        <div className="flex items-center gap-2">
          <LangToggle />
          <ThemeToggle />
        </div>
      </header>

      {/* Main */}
      <main className="px-4 pb-28 pt-4 lg:pb-10 lg:pt-8">
        <div
          className="lg:px-6"
          style={{ marginInlineStart: isDesktop ? (collapsed ? 76 : 248) : 0 }}
        >
          <div className="mx-auto max-w-5xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav
        className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-around border-t px-2 pb-[env(safe-area-inset-bottom)] pt-1.5 lg:hidden"
        style={{ background: 'var(--surface)' }}
      >
        {MOBILE_NAV.slice(0, 2).map((item) => (
          <BottomItem key={item.to} item={item} />
        ))}
        <button
          onClick={() => setQuickAdd(true)}
          className="btn-primary -mt-6 grid h-14 w-14 place-items-center rounded-2xl shadow-glow"
          aria-label={t('expenses.add')}
        >
          <FiPlus size={24} />
        </button>
        {MOBILE_NAV.slice(2).map((item) => (
          <BottomItem key={item.to} item={item} />
        ))}
      </nav>

      <Modal open={quickAdd} onClose={() => setQuickAdd(false)} title={t('expenses.add')}>
        <ExpenseForm
          onCancel={() => setQuickAdd(false)}
          onSubmit={(item) => {
            data.expenses.add(item)
            setQuickAdd(false)
          }}
        />
      </Modal>
    </div>
  )
}

function BottomItem({ item }) {
  const { t } = useTranslation()
  const Icon = item.icon
  return (
    <NavLink
      to={item.to}
      end={item.end}
      className="flex flex-1 flex-col items-center gap-0.5 rounded-lg py-1.5 text-[10px] font-semibold"
      style={({ isActive }) => ({ color: isActive ? 'var(--accent)' : 'var(--text-muted)' })}
    >
      <Icon size={20} />
      <span>{t(`nav.${item.key}`)}</span>
    </NavLink>
  )
}
