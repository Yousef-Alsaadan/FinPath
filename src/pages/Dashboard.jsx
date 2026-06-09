import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import {
  FiTrendingUp,
  FiTrendingDown,
  FiDollarSign,
  FiPercent,
} from 'react-icons/fi'
import { PageHeader } from '../components/PageHeader'
import { StatCard, ProgressBar } from '../components/ui'
import { SarAmount } from '../components/SarAmount'
import { useData } from '../context/DataContext'
import { useLocale } from '../context/LocaleContext'
import {
  periodIncome,
  periodExpenses,
  fixedTotal,
  spendingByCategory,
  healthScore,
  scoreBand,
  budgetStatus,
  goalProgress,
  recentPeriods,
  daysLeftInPeriod,
} from '../lib/finance'
import { formatMonth } from '../lib/format'
import { CATEGORY_COLORS } from '../lib/constants'

function HealthRing({ score, band, label }) {
  const { t } = useTranslation()
  const r = 52
  const c = 2 * Math.PI * r
  const dash = (score / 100) * c
  const color = score >= 80 ? '#10B981' : score >= 60 ? '#34D399' : score >= 40 ? '#F59E0B' : '#EF4444'
  return (
    <div className="surface flex items-center gap-5 rounded-2xl p-5">
      <div className="relative grid place-items-center">
        <svg width="128" height="128" viewBox="0 0 128 128" className="-rotate-90">
          <circle cx="64" cy="64" r={r} fill="none" stroke="var(--surface-2)" strokeWidth="12" />
          <circle
            cx="64"
            cy="64"
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${c}`}
            style={{ transition: 'stroke-dasharray 0.8s ease' }}
          />
        </svg>
        <div className="absolute text-center">
          <div className="text-3xl font-extrabold">{score}</div>
        </div>
      </div>
      <div>
        <p className="muted text-xs font-semibold uppercase tracking-wide">{label}</p>
        <p className="mt-1 text-xl font-extrabold" style={{ color }}>
          {t(`dashboard.score.${band}`)}
        </p>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { t } = useTranslation()
  const { lang } = useLocale()
  const { state, period, settings } = useData()
  const { income, expenses, budgets, goals, fixed } = state

  const inc = periodIncome(income, period)
  const expVar = periodExpenses(expenses, period)
  const fixedSum = fixedTotal(fixed)
  const totalExp = expVar + fixedSum
  const remaining = inc - totalExp
  const savingsRate = inc > 0 ? Math.max(0, (inc - totalExp) / inc) : 0
  const { total: score } = healthScore({
    income,
    expenses,
    fixed,
    budgets,
    goals,
    period,
    startDay: settings.monthStartDay,
  })
  const band = scoreBand(score)
  const daysLeft = daysLeftInPeriod(period)

  const trend = useMemo(() => {
    return recentPeriods(settings.monthStartDay, 6).map((p) => ({
      label: formatMonth(p.start, lang),
      spend: periodExpenses(expenses, p),
    }))
  }, [expenses, settings.monthStartDay, lang])

  const byCat = spendingByCategory(expenses, period)
  const pieData = Object.entries(byCat)
    .map(([id, value]) => ({ id, name: t(`categories.${id}`), value }))
    .sort((a, b) => b.value - a.value)

  const goalAvg = goals.length
    ? goals.reduce((a, g) => a + goalProgress(g).pct, 0) / goals.length
    : 0

  return (
    <div>
      <PageHeader title={t('dashboard.title')} subtitle={t('dashboard.greeting')} />

      <p className="muted mb-4 text-xs">{t('dashboard.daysLeft', { count: daysLeft })}</p>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label={t('dashboard.totalIncome')} icon={<FiTrendingUp />} accent="#10B981" delay={0}>
          <SarAmount value={inc} />
        </StatCard>
        <StatCard label={t('dashboard.totalExpenses')} icon={<FiTrendingDown />} accent="#EF4444" delay={0.05}>
          <SarAmount value={totalExp} />
        </StatCard>
        <StatCard label={t('dashboard.remaining')} icon={<FiDollarSign />} accent="#3B82F6" delay={0.1}>
          <SarAmount value={remaining} className={remaining < 0 ? 'text-red-500' : ''} />
        </StatCard>
        <StatCard label={t('dashboard.savingsRate')} icon={<FiPercent />} accent="#8B5CF6" delay={0.15}>
          {Math.round(savingsRate * 100)}%
        </StatCard>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="surface rounded-2xl p-5">
            <h3 className="text-sm font-bold">{t('dashboard.monthlySpend')}</h3>
            <div className="mt-4 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trend} margin={{ left: 0, right: 0, top: 8 }}>
                  <defs>
                    <linearGradient id="spend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} reversed={lang === 'ar'} />
                  <Tooltip
                    contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}
                    formatter={(v) => [`${v}`, t('dashboard.spentSoFar')]}
                  />
                  <Area type="monotone" dataKey="spend" stroke="#10B981" strokeWidth={2.5} fill="url(#spend)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <HealthRing score={score} band={band} label={t('dashboard.healthScore')} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="surface rounded-2xl p-5">
          <h3 className="text-sm font-bold">{t('dashboard.categoryBreakdown')}</h3>
          {pieData.length ? (
            <div className="mt-3 flex items-center gap-4">
              <div className="h-40 w-40 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" innerRadius={42} outerRadius={66} paddingAngle={2} stroke="none">
                      {pieData.map((d) => (
                        <Cell key={d.id} fill={CATEGORY_COLORS[d.id] || '#64748B'} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="flex-1 space-y-1.5">
                {pieData.slice(0, 5).map((d) => (
                  <li key={d.id} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: CATEGORY_COLORS[d.id] }} />
                      {d.name}
                    </span>
                    <SarAmount value={d.value} className="text-xs font-semibold" />
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="muted mt-3 text-sm">{t('dashboard.noData')}</p>
          )}
        </div>

        <div className="surface rounded-2xl p-5">
          <h3 className="text-sm font-bold">{t('dashboard.budgetUtil')}</h3>
          {budgets.length ? (
            <ul className="mt-3 space-y-3">
              {budgets.slice(0, 4).map((b) => {
                const s = budgetStatus(b, expenses, period)
                const color = s.state === 'over' ? '#EF4444' : s.state === 'near' ? '#F59E0B' : '#10B981'
                return (
                  <li key={b.id}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="font-semibold">{b.name}</span>
                      <span className="muted text-xs">
                        {Math.round(s.ratio * 100)}%
                      </span>
                    </div>
                    <ProgressBar value={s.ratio} color={color} />
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="muted mt-3 text-sm">{t('budgets.empty')}</p>
          )}
        </div>
      </div>

      {goals.length > 0 && (
        <div className="surface mt-4 rounded-2xl p-5">
          <h3 className="text-sm font-bold">{t('dashboard.goalProgress')}</h3>
          <div className="mt-2 mb-3 flex items-center gap-3">
            <ProgressBar value={goalAvg} />
            <span className="text-sm font-bold">{Math.round(goalAvg * 100)}%</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {goals.slice(0, 3).map((g) => {
              const { saved, pct } = goalProgress(g)
              return (
                <div key={g.id} className="rounded-xl p-3" style={{ background: 'var(--surface-2)' }}>
                  <p className="truncate text-sm font-semibold">{g.name}</p>
                  <div className="my-2">
                    <ProgressBar value={pct} />
                  </div>
                  <p className="muted text-xs">
                    <SarAmount value={saved} /> {t('common.of')} <SarAmount value={g.target} />
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
