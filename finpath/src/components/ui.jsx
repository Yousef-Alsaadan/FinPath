import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FiX } from 'react-icons/fi'
import { getIcon, ICONS } from '../lib/icons'
import { CATEGORY_COLORS } from '../lib/constants'

export function CategoryIcon({ name, color, size = 16 }) {
  const Icon = getIcon(name)
  return <Icon size={size} style={{ color }} />
}

export function CategoryBadge({ category, t }) {
  const color = CATEGORY_COLORS[category] || '#64748B'
  return (
    <span className="chip" style={{ background: `${color}1a`, color }}>
      <span className="h-2 w-2 rounded-full" style={{ background: color }} />
      {t(`categories.${category}`)}
    </span>
  )
}

export function StatCard({ label, children, icon, accent, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="surface rounded-2xl p-4"
    >
      <div className="flex items-center justify-between">
        <p className="muted text-xs font-semibold uppercase tracking-wide">{label}</p>
        {icon && (
          <span
            className="grid h-8 w-8 place-items-center rounded-lg"
            style={{ background: accent ? `${accent}1f` : 'var(--surface-2)', color: accent }}
          >
            {icon}
          </span>
        )}
      </div>
      <div className="mt-2 text-2xl font-extrabold">{children}</div>
    </motion.div>
  )
}

export function ProgressBar({ value = 0, color = '#10B981', track = 'var(--surface-2)', height = 8 }) {
  const pct = Math.max(0, Math.min(100, value * 100))
  return (
    <div className="w-full overflow-hidden rounded-full" style={{ background: track, height }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{ background: color, height: '100%' }}
      />
    </div>
  )
}

export function EmptyState({ icon, title, hint, action }) {
  const Inbox = ICONS.FaInbox
  const node = icon || <Inbox />
  return (
    <div className="surface flex flex-col items-center rounded-2xl px-6 py-12 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-2xl text-2xl" style={{ background: 'var(--surface-2)', color: 'var(--accent)' }}>
        {node}
      </div>
      <h3 className="mt-4 text-base font-bold">{title}</h3>
      {hint && <p className="muted mt-1 max-w-sm text-sm">{hint}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export function Modal({ open, onClose, title, children, footer }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            className="surface relative z-10 max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl sm:rounded-2xl"
          >
            <div className="sticky top-0 flex items-center justify-between gap-4 border-b px-5 py-4" style={{ background: 'var(--surface)' }}>
              <h2 className="text-base font-bold">{title}</h2>
              <button onClick={onClose} className="btn-ghost grid h-9 w-9 place-items-center rounded-lg" aria-label="Close">
                <FiX />
              </button>
            </div>
            <div className="px-5 py-4">{children}</div>
            {footer && <div className="sticky bottom-0 border-t px-5 py-4" style={{ background: 'var(--surface)' }}>{footer}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function Field({ label, children }) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      {children}
    </label>
  )
}

export function Segmented({ options, value, onChange }) {
  return (
    <div className="flex gap-1 rounded-xl p-1" style={{ background: 'var(--surface-2)' }}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition ${
            value === o.value ? 'shadow-card' : 'opacity-70'
          }`}
          style={value === o.value ? { background: 'var(--surface)', color: 'var(--accent)' } : {}}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function ConfirmButton({ onConfirm, label, message, className = 'btn-ghost' }) {
  const [armed, setArmed] = useState(false)
  useEffect(() => {
    if (!armed) return
    const id = setTimeout(() => setArmed(false), 3000)
    return () => clearTimeout(id)
  }, [armed])
  return (
    <button
      type="button"
      className={`btn ${armed ? 'btn-primary' : className}`}
      onClick={() => (armed ? onConfirm() : setArmed(true))}
      title={message}
    >
      {armed ? message || 'Confirm' : label}
    </button>
  )
}
