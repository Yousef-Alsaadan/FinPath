import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FiPlus, FiEdit2, FiTrash2, FiCheck, FiClock } from 'react-icons/fi'
import { PageHeader } from '../components/PageHeader'
import { Modal, EmptyState, CategoryBadge, Field, Segmented } from '../components/ui'
import { SarAmount } from '../components/SarAmount'
import { FixedForm } from '../features/EntityForms'
import { useData } from '../context/DataContext'
import { fixedTotal } from '../lib/finance'
import { formatMonth } from '../lib/format'
import { useLocale } from '../context/LocaleContext'

const STATUSES = ['unpaid', 'partial', 'paid']
const STATUS_COLOR = { paid: '#10B981', partial: '#F59E0B', unpaid: '#64748B' }

function StatusModal({ item, statusObj, onClose, onSave }) {
  const { t } = useTranslation()
  const [status, setStatus] = useState(statusObj?.status || 'unpaid')
  const [paid, setPaid] = useState(statusObj?.paid ?? '')
  if (!item) return null

  const save = () => {
    const value = { status }
    if (status === 'partial') value.paid = Number(paid) || 0
    else if (status === 'paid') value.paid = item.amount
    else value.paid = 0
    onSave(value)
    onClose()
  }

  return (
    <Modal open={!!item} onClose={onClose} title={item.name}>
      <Field label={t('fixed.status')}>
        <Segmented
          value={status}
          onChange={setStatus}
          options={STATUSES.map((s) => ({ value: s, label: t(`fixed.${s}`) }))}
        />
      </Field>
      {status === 'partial' && (
        <div className="mt-3">
          <Field label={t('fixed.paidAmount')}>
            <input
              className="input"
              type="number"
              min="0"
              step="0.01"
              max={item.amount}
              value={paid}
              onChange={(e) => setPaid(e.target.value)}
              autoFocus
            />
          </Field>
        </div>
      )}
      <div className="mt-5 flex gap-2">
        <button className="btn btn-primary flex-1" onClick={save}>
          {t('common.save')}
        </button>
        <button className="btn btn-ghost" onClick={onClose}>
          {t('common.cancel')}
        </button>
      </div>
    </Modal>
  )
}

export default function FixedExpenses() {
  const { t } = useTranslation()
  const { lang } = useLocale()
  const { state, period, fixed, setFixedStatus } = useData()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [statusFor, setStatusFor] = useState(null)
  const close = () => {
    setOpen(false)
    setEditing(null)
  }

  const total = fixedTotal(state.fixed)
  const paidTotal = state.fixed.reduce((acc, item) => {
    const s = state.fixedStatus[`${item.id}:${period.key}`]
    return acc + (s?.paid || 0)
  }, 0)

  return (
    <div>
      <PageHeader
        title={t('fixed.title')}
        subtitle={formatMonth(period.start, lang)}
        action={
          <button className="btn btn-primary" onClick={() => setOpen(true)}>
            <FiPlus /> <span className="hidden sm:inline">{t('fixed.add')}</span>
          </button>
        }
      />

      {state.fixed.length === 0 ? (
        <EmptyState
          title={t('fixed.empty')}
          hint={t('fixed.carryNote')}
          action={
            <button className="btn btn-primary" onClick={() => setOpen(true)}>
              <FiPlus /> {t('fixed.add')}
            </button>
          }
        />
      ) : (
        <>
          <div className="surface mb-4 flex items-center justify-between rounded-2xl p-4">
            <div>
              <p className="muted text-xs font-semibold uppercase tracking-wide">
                {t('fixed.monthTotal')}
              </p>
              <div className="mt-1 text-2xl font-extrabold">
                <SarAmount value={total} />
              </div>
            </div>
            <div className="text-end">
              <p className="muted text-xs font-semibold uppercase tracking-wide">
                {t('fixed.paid')}
              </p>
              <div className="mt-1 text-lg font-bold" style={{ color: '#10B981' }}>
                <SarAmount value={paidTotal} />
              </div>
            </div>
          </div>

          <ul className="space-y-2">
            {state.fixed.map((item) => {
              const key = `${item.id}:${period.key}`
              const s = state.fixedStatus[key] || { status: 'unpaid', paid: 0 }
              const color = STATUS_COLOR[s.status]
              return (
                <li key={item.id} className="surface flex items-center gap-3 rounded-xl p-3">
                  <button
                    onClick={() => setStatusFor(item)}
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-lg"
                    style={{ background: `${color}1f`, color }}
                    aria-label={t('fixed.status')}
                  >
                    {s.status === 'paid' ? <FiCheck /> : <FiClock />}
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{item.name}</p>
                    <div className="mt-1 flex items-center gap-2 text-xs">
                      <CategoryBadge category={item.category} t={t} />
                      <span className="font-semibold" style={{ color }}>
                        {t(`fixed.${s.status}`)}
                        {s.status === 'partial' && (
                          <>
                            {' · '}
                            <SarAmount value={s.paid} className="text-[11px]" />
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                  <SarAmount value={item.amount} className="font-bold" />
                  <div className="flex items-center gap-1">
                    <button
                      className="btn-ghost grid h-8 w-8 place-items-center rounded-lg"
                      onClick={() => {
                        setEditing(item)
                        setOpen(true)
                      }}
                      aria-label={t('common.edit')}
                    >
                      <FiEdit2 size={14} />
                    </button>
                    <button
                      className="btn-ghost grid h-8 w-8 place-items-center rounded-lg text-red-500"
                      onClick={() => {
                        if (confirm(t('common.confirmDelete'))) fixed.remove(item.id)
                      }}
                      aria-label={t('common.delete')}
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        </>
      )}

      <Modal open={open} onClose={close} title={editing ? t('fixed.edit') : t('fixed.add')}>
        <FixedForm
          initial={editing || {}}
          onCancel={close}
          onSubmit={(item) => {
            if (editing) fixed.update(editing.id, item)
            else fixed.add(item)
            close()
          }}
        />
      </Modal>

      <StatusModal
        item={statusFor}
        statusObj={statusFor ? state.fixedStatus[`${statusFor.id}:${period.key}`] : null}
        onClose={() => setStatusFor(null)}
        onSave={(value) => setFixedStatus(`${statusFor.id}:${period.key}`, value)}
      />
    </div>
  )
}
