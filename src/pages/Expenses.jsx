import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FiPlus, FiSearch, FiEdit2, FiCopy, FiTrash2 } from 'react-icons/fi'
import { PageHeader } from '../components/PageHeader'
import { Modal, EmptyState, CategoryBadge } from '../components/ui'
import { SarAmount } from '../components/SarAmount'
import { ExpenseForm } from '../features/EntityForms'
import { useData } from '../context/DataContext'
import { useLocale } from '../context/LocaleContext'
import { inPeriod } from '../lib/finance'
import { formatDate } from '../lib/format'
import { CATEGORIES } from '../lib/constants'

export default function Expenses() {
  const { t } = useTranslation()
  const { lang } = useLocale()
  const { state, period, expenses } = useData()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('all')

  const list = useMemo(() => {
    return state.expenses
      .filter((e) => inPeriod(e.date, period))
      .filter((e) => cat === 'all' || e.category === cat)
      .filter(
        (e) =>
          !q ||
          e.title.toLowerCase().includes(q.toLowerCase()) ||
          (e.notes || '').toLowerCase().includes(q.toLowerCase())
      )
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [state.expenses, period, q, cat])

  const close = () => {
    setOpen(false)
    setEditing(null)
  }

  return (
    <div>
      <PageHeader
        title={t('expenses.title')}
        subtitle={t(list.length === 1 ? 'expenses.count_one' : 'expenses.count_other', { count: list.length })}
        action={
          <button className="btn btn-primary" onClick={() => setOpen(true)}>
            <FiPlus /> <span className="hidden sm:inline">{t('expenses.add')}</span>
          </button>
        }
      />

      <div className="mb-4 flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <FiSearch className="pointer-events-none absolute inset-y-0 my-auto ms-3 opacity-50" />
          <input
            className="input ps-9"
            placeholder={t('expenses.searchPlaceholder')}
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <select className="input sm:w-48" value={cat} onChange={(e) => setCat(e.target.value)}>
          <option value="all">{t('common.all')}</option>
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {t(`categories.${c.id}`)}
            </option>
          ))}
        </select>
      </div>

      {list.length === 0 ? (
        <EmptyState
          title={t('expenses.empty')}
          hint={t('dashboard.noData')}
          action={
            <button className="btn btn-primary" onClick={() => setOpen(true)}>
              <FiPlus /> {t('expenses.add')}
            </button>
          }
        />
      ) : (
        <ul className="space-y-2">
          {list.map((e) => (
            <li key={e.id} className="surface flex items-center gap-3 rounded-xl p-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate font-semibold">{e.title}</p>
                  {e.recurring && <span className="chip text-[10px]">{t('common.recurring')}</span>}
                </div>
                <div className="mt-1 flex items-center gap-2 text-xs">
                  <CategoryBadge category={e.category} t={t} />
                  <span className="muted">{formatDate(e.date, lang)}</span>
                </div>
              </div>
              <SarAmount value={e.amount} className="font-bold" />
              <div className="flex items-center gap-1">
                <button className="btn-ghost grid h-8 w-8 place-items-center rounded-lg" onClick={() => { setEditing(e); setOpen(true) }} aria-label={t('common.edit')}>
                  <FiEdit2 size={14} />
                </button>
                <button className="btn-ghost grid h-8 w-8 place-items-center rounded-lg" onClick={() => expenses.duplicate(e.id)} aria-label={t('common.duplicate')}>
                  <FiCopy size={14} />
                </button>
                <button className="btn-ghost grid h-8 w-8 place-items-center rounded-lg text-red-500" onClick={() => { if (confirm(t('common.confirmDelete'))) expenses.remove(e.id) }} aria-label={t('common.delete')}>
                  <FiTrash2 size={14} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal open={open} onClose={close} title={editing ? t('expenses.edit') : t('expenses.add')}>
        <ExpenseForm
          initial={editing || {}}
          onCancel={close}
          onSubmit={(item) => {
            if (editing) expenses.update(editing.id, item)
            else expenses.add(item)
            close()
          }}
        />
      </Modal>
    </div>
  )
}
