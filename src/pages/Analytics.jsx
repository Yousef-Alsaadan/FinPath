import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts'
import { PageHeader } from '../components/PageHeader'
import { EmptyState, ProgressBar } from '../components/ui'
import { SarAmount } from '../components/SarAmount'
import { useData } from '../context/DataContext'
import { useLocale } from '../context/LocaleContext'
import {
  recentPeriods,
  periodExpenses,
  periodIncome,
  lifetimeByCategory,
  fixedTotal,
} from '../lib/finance'
import { formatMonth } from '../lib/format'
import { CATEGORY_COLORS } from '../lib/constants'

function Card({ title, children, className = '' }) {
  return (
    <div className={`surface rounded-2xl p-5 ${className}`}>
      <h3 className="text-sm font-bold">{title}</h3>
      {children}
    </div>
  )
}

const tooltipStyle = {
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: 12,
}

export default function Analytics() {
  const { t } = useTranslation()
  const { lang } = useLocale()
  const { state, settings } = useData()
  const { expenses, income, fixed } = state

  const rtl = lang === 'ar'
  const fixedSum = fixedTotal(fixed)

  const series = useMemo(() => {
    return recentPeriods(settings.monthStartDay, 6).map((p) => {
      const spend = periodExpenses(expenses, p) + fixedSum
      const earned = periodIncome(income, p)
      return {
        label: formatMonth(p.start, lang),
        spend,
        income: earned,
        savings: Math.max(0, earned - spend),
        rate: earned > 0 ? Math.round(((earned - spend) / earned) * 100) : 0,
      }
    })
  }, [expenses, income, fixedSum, settings.monthStartDay, lang])

  const lifetime = useMemo(() => {
    const map = lifetimeByCategory(expenses)
    return Object.entries(map)
      .map(([id, value]) => ({ id, name: t(`categories.${id}`), value }))
      .sort((a, b) => b.value - a.value)
  }, [expenses, t])

  const lifetimeMax = lifetime.length ? lifetime[0].value : 0
  const hasData = expenses.length > 0 || income.length > 0

  if (!hasData) {
    return (
      <div>
        <PageHeader title={t('analytics.title')} />
        <EmptyState title={t('analytics.noHistory')} />
      </div>
    )
  }

  return (
    <div>
      <PageHeader title={t('analytics.title')} />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title={t('analytics.incomeVsExpense')}>
          <div className="mt-4 h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={series} margin={{ left: -16, right: 0, top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
                  axisLine={false}
                  tickLine={false}
                  reversed={rtl}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
                  axisLine={false}
                  tickLine={false}
                  orientation={rtl ? 'right' : 'left'}
                />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'var(--surface-2)' }} />
                <Bar dataKey="income" fill="#10B981" radius={[4, 4, 0, 0]} name={t('dashboard.totalIncome')} />
                <Bar dataKey="spend" fill="#EF4444" radius={[4, 4, 0, 0]} name={t('dashboard.totalExpenses')} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title={t('analytics.savingsTrend')}>
          <div className="mt-4 h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={series} margin={{ left: -16, right: 0, top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
                  axisLine={false}
                  tickLine={false}
                  reversed={rtl}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
                  axisLine={false}
                  tickLine={false}
                  orientation={rtl ? 'right' : 'left'}
                />
                <Tooltip contentStyle={tooltipStyle} />
                <Line
                  type="monotone"
                  dataKey="savings"
                  stroke="#10B981"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                  name={t('analytics.savingsTrend')}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card title={t('analytics.savings')}>
          <div className="mt-3 space-y-3">
            {series.map((s) => (
              <div key={s.label}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-semibold">{s.label}</span>
                  <span className="muted text-xs">{s.rate}%</span>
                </div>
                <ProgressBar value={Math.max(0, Math.min(1, s.rate / 100))} />
              </div>
            ))}
          </div>
        </Card>

        <Card title={t('analytics.categoryTotals')}>
          {lifetime.length ? (
            <div className="mt-3 space-y-3">
              {lifetime.slice(0, 8).map((c) => (
                <div key={c.id}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 font-semibold">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ background: CATEGORY_COLORS[c.id] || '#64748B' }}
                      />
                      {c.name}
                    </span>
                    <SarAmount value={c.value} className="text-xs font-semibold" />
                  </div>
                  <ProgressBar
                    value={lifetimeMax > 0 ? c.value / lifetimeMax : 0}
                    color={CATEGORY_COLORS[c.id] || '#64748B'}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="muted mt-3 text-sm">{t('analytics.noHistory')}</p>
          )}
        </Card>
      </div>

      <Card title={t('analytics.topCategories')} className="mt-4">
        {lifetime.length ? (
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={lifetime.slice(0, 6)}
                layout="vertical"
                margin={{ left: 8, right: 16, top: 0 }}
              >
                <XAxis type="number" hide reversed={rtl} />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 12, fill: 'var(--text-muted)' }}
                  axisLine={false}
                  tickLine={false}
                  width={90}
                  orientation={rtl ? 'right' : 'left'}
                />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'var(--surface-2)' }} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} name={t('common.amount')}>
                  {lifetime.slice(0, 6).map((c) => (
                    <Cell key={c.id} fill={CATEGORY_COLORS[c.id] || '#64748B'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="muted mt-3 text-sm">{t('analytics.noHistory')}</p>
        )}
      </Card>
    </div>
  )
}
