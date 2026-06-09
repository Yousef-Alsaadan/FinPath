import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi'
import { PageHeader } from '../components/PageHeader'
import { Modal, EmptyState } from '../components/ui'
import { SarAmount } from '../components/SarAmount'
import { IncomeForm } from '../features/EntityForms'
import { useData } from '../context/DataContext'
import { periodIncome } from '../lib/finance'

export default function Income() {
  const { t } = useTranslation()
  const { state, period, income } = useData()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const close = () => { setOpen(false); setEditing(null) }
  const total = periodIncome(state.income, period)

  return (
    <div>
      <PageHeader
        title={t('income.title')}
        subtitle={<><SarAmount value={total} /> · {t('expenses.thisMonth')}</>}
        action={
          <button className="btn btn-primary" onClick={() => setOpen(true)}>
            <FiPlus /> <span className="hidden sm:inline">{t('income.add')}</span>
          </button>
        }
      />

      {state.income.length === 0 ? (
        <EmptyState
          title={t('income.empty')}
          action={<button className="btn btn-primary" onClick={() => setOpen(true)}><FiPlus /> {t('income.add')}</button>}
        />
      ) : (
        <ul className="space-y-2">
          {state.income.map((i) => (
            <li key={i.id} className="surface flex items-center gap-3 rounded-xl p-3">
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{i.name}</p>
                <div className="mt-1 flex items-center gap-2 text-xs">
                  <span className="chip">{t(`income.${i.source}`)}</span>
                  <span className="muted">{i.recurring ? t('common.recurring') : t('common.oneTime')}</span>
                </div>
              </div>
              <SarAmount value={i.amount} className="font-bold text-emerald-500" />
              <div className="flex items-center gap-1">
                <button className="btn-ghost grid h-8 w-8 place-items-center rounded-lg" onClick={() => { setEditing(i); setOpen(true) }} aria-label={t('common.edit')}>
                  <FiEdit2 size={14} />
                </button>
                <button className="btn-ghost grid h-8 w-8 place-items-center rounded-lg text-red-500" onClick={() => { if (confirm(t('common.confirmDelete'))) income.remove(i.id) }} aria-label={t('common.delete')}>
                  <FiTrash2 size={14} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal open={open} onClose={close} title={editing ? t('income.edit') : t('income.add')}>
        <IncomeForm
          initial={editing || {}}
          onCancel={close}
          onSubmit={(item) => {
            if (editing) income.update(editing.id, item)
            else income.add(item)
            close()
          }}
        />
      </Modal>
    </div>
  )
}
