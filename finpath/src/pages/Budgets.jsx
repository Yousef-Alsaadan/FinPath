import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FiPlus, FiEdit2, FiTrash2, FiAlertTriangle } from 'react-icons/fi'
import { PageHeader } from '../components/PageHeader'
import { Modal, EmptyState, ProgressBar, CategoryBadge } from '../components/ui'
import { SarAmount } from '../components/SarAmount'
import { BudgetForm } from '../features/EntityForms'
import { useData } from '../context/DataContext'
import { budgetStatus } from '../lib/finance'

export default function Budgets() {
  const { t } = useTranslation()
  const { state, period, budgets } = useData()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const close = () => { setOpen(false); setEditing(null) }

  return (
    <div>
      <PageHeader
        title={t('budgets.title')}
        action={
          <button className="btn btn-primary" onClick={() => setOpen(true)}>
            <FiPlus /> <span className="hidden sm:inline">{t('budgets.add')}</span>
          </button>
        }
      />

      {state.budgets.length === 0 ? (
        <EmptyState
          title={t('budgets.empty')}
          action={<button className="btn btn-primary" onClick={() => setOpen(true)}><FiPlus /> {t('budgets.add')}</button>}
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {state.budgets.map((b) => {
            const s = budgetStatus(b, state.expenses, period)
            const color = s.state === 'over' ? '#EF4444' : s.state === 'near' ? '#F59E0B' : '#10B981'
            return (
              <div key={b.id} className="surface rounded-2xl p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bold">{b.name}</p>
                    <div className="mt-1"><CategoryBadge category={b.category} t={t} /></div>
                  </div>
                  <div className="flex gap-1">
                    <button className="btn-ghost grid h-8 w-8 place-items-center rounded-lg" onClick={() => { setEditing(b); setOpen(true) }} aria-label={t('common.edit')}>
                      <FiEdit2 size={14} />
                    </button>
                    <button className="btn-ghost grid h-8 w-8 place-items-center rounded-lg text-red-500" onClick={() => { if (confirm(t('common.confirmDelete'))) budgets.remove(b.id) }} aria-label={t('common.delete')}>
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="my-3"><ProgressBar value={s.ratio} color={color} height={10} /></div>

                <div className="flex items-center justify-between text-sm">
                  <span className="muted">
                    <SarAmount value={s.spent} className="font-semibold" /> {t('common.of')} <SarAmount value={b.limit} />
                  </span>
                  {s.state === 'over' ? (
                    <span className="flex items-center gap-1 font-semibold" style={{ color }}>
                      <FiAlertTriangle size={14} /> {t('budgets.over')}
                    </span>
                  ) : s.state === 'near' ? (
                    <span className="flex items-center gap-1 font-semibold" style={{ color }}>
                      <FiAlertTriangle size={14} /> {t('budgets.near')}
                    </span>
                  ) : (
                    <span className="font-semibold" style={{ color }}>{t('budgets.ok')}</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Modal open={open} onClose={close} title={editing ? t('budgets.edit') : t('budgets.add')}>
        <BudgetForm
          initial={editing || {}}
          onCancel={close}
          onSubmit={(item) => {
            if (editing) budgets.update(editing.id, item)
            else budgets.add(item)
            close()
          }}
        />
      </Modal>
    </div>
  )
}
