import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi'
import { PageHeader } from '../components/PageHeader'
import { Modal, EmptyState, ProgressBar, Field } from '../components/ui'
import { SarAmount } from '../components/SarAmount'
import { GoalForm } from '../features/EntityForms'
import { useData } from '../context/DataContext'
import { useLocale } from '../context/LocaleContext'
import { goalProgress, goalEta, uid } from '../lib/finance'
import { formatDate, todayISO } from '../lib/format'

function ContributeModal({ goal, onClose, onAdd }) {
  const { t } = useTranslation()
  const [amount, setAmount] = useState('')
  if (!goal) return null
  return (
    <Modal open={!!goal} onClose={onClose} title={t('goals.contribute')}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (!(Number(amount) > 0)) return
          onAdd(Number(amount))
          onClose()
        }}
      >
        <p className="muted mb-3 text-sm">{goal.name}</p>
        <Field label={t('common.amount')}>
          <input className="input" type="number" min="0" step="0.01" autoFocus value={amount} onChange={(e) => setAmount(e.target.value)} />
        </Field>
        <div className="mt-5 flex gap-2">
          <button type="submit" className="btn btn-primary flex-1">{t('common.save')}</button>
          <button type="button" className="btn btn-ghost" onClick={onClose}>{t('common.cancel')}</button>
        </div>
      </form>
    </Modal>
  )
}

export default function Goals() {
  const { t } = useTranslation()
  const { lang } = useLocale()
  const { state, goals } = useData()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [contributing, setContributing] = useState(null)
  const close = () => { setOpen(false); setEditing(null) }

  const addContribution = (goal, amount) => {
    const contributions = [...(goal.contributions || []), { id: uid(), amount, date: todayISO() }]
    goals.update(goal.id, { contributions, saved: (goal.saved || 0) + amount })
  }

  return (
    <div>
      <PageHeader
        title={t('goals.title')}
        action={
          <button className="btn btn-primary" onClick={() => setOpen(true)}>
            <FiPlus /> <span className="hidden sm:inline">{t('goals.add')}</span>
          </button>
        }
      />

      {state.goals.length === 0 ? (
        <EmptyState
          title={t('goals.empty')}
          action={<button className="btn btn-primary" onClick={() => setOpen(true)}><FiPlus /> {t('goals.add')}</button>}
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {state.goals.map((g) => {
            const { saved, pct } = goalProgress(g)
            const eta = goalEta(g)
            return (
              <div key={g.id} className="surface rounded-2xl p-4">
                <div className="flex items-start justify-between">
                  <div className="min-w-0">
                    <p className="truncate font-bold">{g.name}</p>
                    <span className="chip mt-1 text-[10px]">{t(`common.${g.priority || 'medium'}`)}</span>
                  </div>
                  <div className="flex gap-1">
                    <button className="btn-ghost grid h-8 w-8 place-items-center rounded-lg" onClick={() => { setEditing(g); setOpen(true) }} aria-label={t('common.edit')}>
                      <FiEdit2 size={14} />
                    </button>
                    <button className="btn-ghost grid h-8 w-8 place-items-center rounded-lg text-red-500" onClick={() => { if (confirm(t('common.confirmDelete'))) goals.remove(g.id) }} aria-label={t('common.delete')}>
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="my-3 flex items-center gap-3">
                  <ProgressBar value={pct} />
                  <span className="text-sm font-bold">{Math.round(pct * 100)}%</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="muted">
                    <SarAmount value={saved} className="font-semibold" /> {t('common.of')} <SarAmount value={g.target} />
                  </span>
                </div>

                <div className="muted mt-1 text-xs">
                  {eta.done
                    ? t('goals.etaReached')
                    : eta.date
                      ? `${t('goals.eta')}: ${formatDate(eta.date, lang, { month: 'short', year: 'numeric' })}`
                      : ''}
                </div>

                <button className="btn btn-ghost mt-3 w-full" onClick={() => setContributing(g)}>
                  <FiPlus size={14} /> {t('goals.contribute')}
                </button>
              </div>
            )
          })}
        </div>
      )}

      <Modal open={open} onClose={close} title={editing ? t('goals.edit') : t('goals.add')}>
        <GoalForm
          initial={editing || {}}
          onCancel={close}
          onSubmit={(item) => {
            if (editing) goals.update(editing.id, item)
            else goals.add(item)
            close()
          }}
        />
      </Modal>

      <ContributeModal
        goal={contributing}
        onClose={() => setContributing(null)}
        onAdd={(amount) => addContribution(contributing, amount)}
      />
    </div>
  )
}
