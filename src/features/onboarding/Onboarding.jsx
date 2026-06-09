import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion } from 'framer-motion'
import { FiArrowRight, FiArrowLeft, FiCheck, FiPlus, FiTrash2, FiSmartphone } from 'react-icons/fi'
import { Logo } from '../../components/Logo'
import { ThemeToggle, LangToggle } from '../../components/Toggles'
import { Field, CategoryIcon } from '../../components/ui'
import { SarAmount } from '../../components/SarAmount'
import { IncomeForm, GoalForm } from '../EntityForms'
import { useData } from '../../context/DataContext'
import { useLocale } from '../../context/LocaleContext'
import { CATEGORIES } from '../../lib/constants'

const TOTAL = 5

function detectPlatform() {
  if (typeof navigator === 'undefined') return 'desktop'
  const ua = navigator.userAgent || ''
  if (/android/i.test(ua)) return 'android'
  if (/iphone|ipad|ipod/i.test(ua)) return 'ios'
  return 'desktop'
}

function StepShell({ title, help, children }) {
  return (
    <div>
      <h2 className="text-xl font-extrabold">{title}</h2>
      {help && <p className="muted mt-1 text-sm">{help}</p>}
      <div className="mt-5">{children}</div>
    </div>
  )
}

export default function Onboarding() {
  const { t } = useTranslation()
  const { dir } = useLocale()
  const { settings, patchSettings, income, goals, setOnboarded, state } = useData()
  const [step, setStep] = useState(1)

  // step 2 local UI state
  const [incForm, setIncForm] = useState(false)
  // step 3 selected categories (soft preference, default common ones)
  const [cats, setCats] = useState(() => ['housing', 'food', 'transport', 'utilities'])
  // step 4
  const [goalForm, setGoalForm] = useState(false)

  const platform = useMemo(detectPlatform, [])
  const Next = dir === 'rtl' ? FiArrowLeft : FiArrowRight
  const Back = dir === 'rtl' ? FiArrowRight : FiArrowLeft

  const days = Array.from({ length: 28 }, (_, i) => i + 1)
  const toggleCat = (id) =>
    setCats((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]))

  const go = (n) => setStep(Math.max(1, Math.min(TOTAL, n)))
  const finish = () => setOnboarded()

  return (
    <div className="min-h-screen" dir={dir}>
      <header className="flex items-center justify-between px-5 py-4">
        <Logo className="h-7 w-auto" />
        <div className="flex items-center gap-2">
          <LangToggle />
          <ThemeToggle />
        </div>
      </header>

      <div className="mx-auto max-w-xl px-5 pb-16 pt-2">
        {/* progress */}
        <div className="mb-6 flex items-center gap-1.5">
          {Array.from({ length: TOTAL }, (_, i) => (
            <div
              key={i}
              className="h-1.5 flex-1 rounded-full transition-colors"
              style={{ background: i < step ? 'var(--accent)' : 'var(--surface-2)' }}
            />
          ))}
        </div>
        <p className="muted mb-4 text-xs font-semibold uppercase tracking-wide">
          {t('onboarding.step', { n: step, total: TOTAL })}
        </p>

        <div className="surface rounded-2xl p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25 }}
            >
              {step === 1 && (
                <StepShell title={t('onboarding.s1Title')} help={t('onboarding.s1Help')}>
                  <Field label={t('onboarding.day')}>
                    <select
                      className="input"
                      value={settings.monthStartDay}
                      onChange={(e) => patchSettings({ monthStartDay: Number(e.target.value) })}
                    >
                      {days.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <div className="mt-3 flex gap-2">
                    {[1, 25, 28].map((d) => (
                      <button
                        key={d}
                        className={`chip ${settings.monthStartDay === d ? 'btn-primary' : ''}`}
                        onClick={() => patchSettings({ monthStartDay: d })}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </StepShell>
              )}

              {step === 2 && (
                <StepShell title={t('onboarding.s2Title')} help={t('onboarding.s2Help')}>
                  {state.income.length > 0 && (
                    <ul className="mb-3 space-y-2">
                      {state.income.map((i) => (
                        <li
                          key={i.id}
                          className="flex items-center gap-3 rounded-xl p-3"
                          style={{ background: 'var(--surface-2)' }}
                        >
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold">{i.name}</p>
                            <p className="muted text-xs">{t(`income.${i.source}`)}</p>
                          </div>
                          <SarAmount value={i.amount} className="text-sm font-bold" />
                          <button
                            className="btn-ghost grid h-8 w-8 place-items-center rounded-lg text-red-500"
                            onClick={() => income.remove(i.id)}
                            aria-label={t('common.delete')}
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                  {incForm ? (
                    <IncomeForm
                      onCancel={() => setIncForm(false)}
                      onSubmit={(item) => {
                        income.add(item)
                        setIncForm(false)
                      }}
                    />
                  ) : (
                    <button className="btn btn-ghost w-full" onClick={() => setIncForm(true)}>
                      <FiPlus /> {state.income.length ? t('onboarding.addAnother') : t('income.add')}
                    </button>
                  )}
                </StepShell>
              )}

              {step === 3 && (
                <StepShell title={t('onboarding.s3Title')} help={t('onboarding.s3Help')}>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {CATEGORIES.map((c) => {
                      const active = cats.includes(c.id)
                      return (
                        <button
                          key={c.id}
                          onClick={() => toggleCat(c.id)}
                          className="flex items-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold transition"
                          style={{
                            background: active ? `${c.color}1f` : 'var(--surface-2)',
                            color: active ? c.color : 'var(--text)',
                            outline: active ? `1.5px solid ${c.color}` : '1.5px solid transparent',
                          }}
                        >
                          <CategoryIcon name={c.icon} color={active ? c.color : 'var(--text-muted)'} />
                          <span className="truncate">{t(`categories.${c.id}`)}</span>
                        </button>
                      )
                    })}
                  </div>
                </StepShell>
              )}

              {step === 4 && (
                <StepShell title={t('onboarding.s4Title')} help={t('onboarding.s4Help')}>
                  {state.goals.length > 0 && (
                    <ul className="mb-3 space-y-2">
                      {state.goals.map((g) => (
                        <li
                          key={g.id}
                          className="flex items-center gap-3 rounded-xl p-3"
                          style={{ background: 'var(--surface-2)' }}
                        >
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold">{g.name}</p>
                          </div>
                          <SarAmount value={g.target} className="text-sm font-bold" />
                          <button
                            className="btn-ghost grid h-8 w-8 place-items-center rounded-lg text-red-500"
                            onClick={() => goals.remove(g.id)}
                            aria-label={t('common.delete')}
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                  {goalForm ? (
                    <GoalForm
                      onCancel={() => setGoalForm(false)}
                      onSubmit={(item) => {
                        goals.add(item)
                        setGoalForm(false)
                      }}
                    />
                  ) : (
                    <button className="btn btn-ghost w-full" onClick={() => setGoalForm(true)}>
                      <FiPlus /> {state.goals.length ? t('onboarding.addAnother') : t('goals.add')}
                    </button>
                  )}
                </StepShell>
              )}

              {step === 5 && (
                <StepShell title={t('onboarding.s5Title')} help={t('onboarding.s5Help')}>
                  <div
                    className="flex items-start gap-4 rounded-xl p-4"
                    style={{ background: 'var(--surface-2)' }}
                  >
                    <span
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-xl"
                      style={{ background: '#10B98124', color: '#10B981' }}
                    >
                      <FiSmartphone />
                    </span>
                    <div>
                      <p className="text-sm font-bold capitalize">{platform}</p>
                      <p className="muted mt-1 text-sm">{t(`onboarding.install.${platform}`)}</p>
                    </div>
                  </div>
                </StepShell>
              )}
            </motion.div>
          </AnimatePresence>

          {/* controls */}
          <div className="mt-6 flex items-center justify-between gap-3">
            {step > 1 ? (
              <button className="btn btn-ghost" onClick={() => go(step - 1)}>
                <Back /> {t('common.back')}
              </button>
            ) : (
              <span />
            )}

            <div className="flex items-center gap-2">
              {(step === 2 || step === 4) && (
                <button className="btn btn-ghost" onClick={() => go(step + 1)}>
                  {t('onboarding.skipForNow')}
                </button>
              )}
              {step < TOTAL ? (
                <button className="btn btn-primary" onClick={() => go(step + 1)}>
                  {t('common.next')} <Next />
                </button>
              ) : (
                <button className="btn btn-primary" onClick={finish}>
                  <FiCheck /> {t('onboarding.getStarted')}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
