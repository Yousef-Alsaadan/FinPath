import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Field, Segmented } from '../components/ui'
import { CATEGORIES, INCOME_SOURCES, GOAL_PRESETS, PRIORITIES } from '../lib/constants'
import { todayISO } from '../lib/format'

function FormActions({ onCancel }) {
  const { t } = useTranslation()
  return (
    <div className="mt-5 flex gap-2">
      <button type="submit" className="btn btn-primary flex-1">
        {t('common.save')}
      </button>
      <button type="button" className="btn btn-ghost" onClick={onCancel}>
        {t('common.cancel')}
      </button>
    </div>
  )
}

export function ExpenseForm({ initial = {}, onSubmit, onCancel }) {
  const { t } = useTranslation()
  const [f, setF] = useState({
    title: initial.title || '',
    category: initial.category || 'food',
    amount: initial.amount ?? '',
    date: initial.date || todayISO(),
    notes: initial.notes || '',
    recurring: initial.recurring || false,
  })
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const submit = (e) => {
    e.preventDefault()
    if (!f.title.trim() || !(Number(f.amount) > 0)) return
    onSubmit({ ...f, amount: Number(f.amount) })
  }
  return (
    <form onSubmit={submit}>
      <div className="grid gap-3">
        <Field label={t('common.title')}>
          <input className="input" value={f.title} onChange={set('title')} required />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label={t('common.amount')}>
            <input className="input" type="number" min="0" step="0.01" value={f.amount} onChange={set('amount')} required />
          </Field>
          <Field label={t('common.date')}>
            <input className="input" type="date" value={f.date} onChange={set('date')} />
          </Field>
        </div>
        <Field label={t('common.category')}>
          <select className="input" value={f.category} onChange={set('category')}>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {t(`categories.${c.id}`)}
              </option>
            ))}
          </select>
        </Field>
        <Field label={t('common.notes')}>
          <textarea className="input" rows={2} value={f.notes} onChange={set('notes')} />
        </Field>
        <Field label={t('common.recurring')}>
          <Segmented
            value={f.recurring ? 'yes' : 'no'}
            onChange={(v) => setF({ ...f, recurring: v === 'yes' })}
            options={[
              { value: 'no', label: t('common.oneTime') },
              { value: 'yes', label: t('common.recurring') },
            ]}
          />
        </Field>
      </div>
      <FormActions onCancel={onCancel} />
    </form>
  )
}

export function IncomeForm({ initial = {}, onSubmit, onCancel }) {
  const { t } = useTranslation()
  const [f, setF] = useState({
    name: initial.name || '',
    source: initial.source || 'salary',
    amount: initial.amount ?? '',
    date: initial.date || todayISO(),
    recurring: initial.recurring ?? true,
  })
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const submit = (e) => {
    e.preventDefault()
    if (!f.name.trim() || !(Number(f.amount) > 0)) return
    onSubmit({ ...f, amount: Number(f.amount) })
  }
  return (
    <form onSubmit={submit}>
      <div className="grid gap-3">
        <Field label={t('common.name')}>
          <input className="input" value={f.name} onChange={set('name')} required />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label={t('common.amount')}>
            <input className="input" type="number" min="0" step="0.01" value={f.amount} onChange={set('amount')} required />
          </Field>
          <Field label={t('income.source')}>
            <select className="input" value={f.source} onChange={set('source')}>
              {INCOME_SOURCES.map((s) => (
                <option key={s} value={s}>
                  {t(`income.${s}`)}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <Field label={t('common.recurring')}>
          <Segmented
            value={f.recurring ? 'yes' : 'no'}
            onChange={(v) => setF({ ...f, recurring: v === 'yes' })}
            options={[
              { value: 'yes', label: t('common.recurring') },
              { value: 'no', label: t('common.oneTime') },
            ]}
          />
        </Field>
        {!f.recurring && (
          <Field label={t('common.date')}>
            <input className="input" type="date" value={f.date} onChange={set('date')} />
          </Field>
        )}
      </div>
      <FormActions onCancel={onCancel} />
    </form>
  )
}

export function BudgetForm({ initial = {}, onSubmit, onCancel }) {
  const { t } = useTranslation()
  const [f, setF] = useState({
    name: initial.name || '',
    category: initial.category || 'food',
    limit: initial.limit ?? '',
  })
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const submit = (e) => {
    e.preventDefault()
    if (!f.name.trim() || !(Number(f.limit) > 0)) return
    onSubmit({ ...f, limit: Number(f.limit) })
  }
  return (
    <form onSubmit={submit}>
      <div className="grid gap-3">
        <Field label={t('common.name')}>
          <input className="input" value={f.name} onChange={set('name')} placeholder="Monthly Budget" required />
        </Field>
        <Field label={t('budgets.category')}>
          <select className="input" value={f.category} onChange={set('category')}>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {t(`categories.${c.id}`)}
              </option>
            ))}
          </select>
        </Field>
        <Field label={t('budgets.limit')}>
          <input className="input" type="number" min="0" step="0.01" value={f.limit} onChange={set('limit')} required />
        </Field>
      </div>
      <FormActions onCancel={onCancel} />
    </form>
  )
}

export function GoalForm({ initial = {}, onSubmit, onCancel }) {
  const { t } = useTranslation()
  const [f, setF] = useState({
    name: initial.name || '',
    preset: initial.preset || 'emergency',
    target: initial.target ?? '',
    targetDate: initial.targetDate || '',
    priority: initial.priority || 'medium',
    monthly: initial.monthly ?? '',
  })
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const choosePreset = (preset) => {
    const label = t(`goals.presets.${preset}`)
    setF((s) => ({ ...s, preset, name: s.name && s.preset !== preset ? s.name : preset === 'custom' ? '' : label }))
  }
  const submit = (e) => {
    e.preventDefault()
    if (!f.name.trim() || !(Number(f.target) > 0)) return
    onSubmit({
      ...f,
      target: Number(f.target),
      monthly: Number(f.monthly) || 0,
      saved: initial.saved ?? 0,
      contributions: initial.contributions || [],
    })
  }
  return (
    <form onSubmit={submit}>
      <div className="grid gap-3">
        <div className="grid grid-cols-3 gap-2">
          {GOAL_PRESETS.map((p) => (
            <button
              type="button"
              key={p.id}
              onClick={() => choosePreset(p.id)}
              className={`rounded-xl px-2 py-3 text-xs font-semibold transition ${
                f.preset === p.id ? 'btn-primary' : 'btn-ghost'
              }`}
            >
              {t(`goals.presets.${p.id}`)}
            </button>
          ))}
        </div>
        <Field label={t('common.name')}>
          <input className="input" value={f.name} onChange={set('name')} required />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label={t('goals.target')}>
            <input className="input" type="number" min="0" step="0.01" value={f.target} onChange={set('target')} required />
          </Field>
          <Field label={t('goals.monthly')}>
            <input className="input" type="number" min="0" step="0.01" value={f.monthly} onChange={set('monthly')} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label={t('goals.targetDate')}>
            <input className="input" type="date" value={f.targetDate} onChange={set('targetDate')} />
          </Field>
          <Field label={t('common.priority')}>
            <select className="input" value={f.priority} onChange={set('priority')}>
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {t(`common.${p}`)}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </div>
      <FormActions onCancel={onCancel} />
    </form>
  )
}

export function FixedForm({ initial = {}, onSubmit, onCancel }) {
  const { t } = useTranslation()
  const [f, setF] = useState({
    name: initial.name || '',
    category: initial.category || 'utilities',
    amount: initial.amount ?? '',
  })
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const submit = (e) => {
    e.preventDefault()
    if (!f.name.trim() || !(Number(f.amount) > 0)) return
    onSubmit({ ...f, amount: Number(f.amount) })
  }
  return (
    <form onSubmit={submit}>
      <div className="grid gap-3">
        <Field label={t('common.name')}>
          <input className="input" value={f.name} onChange={set('name')} placeholder="Rent" required />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label={t('common.amount')}>
            <input className="input" type="number" min="0" step="0.01" value={f.amount} onChange={set('amount')} required />
          </Field>
          <Field label={t('common.category')}>
            <select className="input" value={f.category} onChange={set('category')}>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {t(`categories.${c.id}`)}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <p className="muted text-xs">{t('fixed.carryNote')}</p>
      </div>
      <FormActions onCancel={onCancel} />
    </form>
  )
}
