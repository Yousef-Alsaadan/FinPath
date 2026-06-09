import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FiDownload, FiUpload, FiTrash2, FiSun, FiMoon, FiCheckCircle } from 'react-icons/fi'
import { PageHeader } from '../components/PageHeader'
import { Field, Segmented } from '../components/ui'
import { useData } from '../context/DataContext'
import { useTheme } from '../context/ThemeContext'
import { useLocale } from '../context/LocaleContext'
import { exportState, parseImport } from '../lib/storage'

function Section({ title, children }) {
  return (
    <div className="surface rounded-2xl p-5">
      <h3 className="text-sm font-bold">{title}</h3>
      <div className="mt-4">{children}</div>
    </div>
  )
}

export default function Settings() {
  const { t } = useTranslation()
  const { state, settings, patchSettings, reset, replace } = useData()
  const { theme, setTheme } = useTheme()
  const { lang, setLang } = useLocale()
  const fileRef = useRef(null)
  const [msg, setMsg] = useState(null) // { type: 'ok' | 'error', text }

  const flash = (type, text) => {
    setMsg({ type, text })
    setTimeout(() => setMsg(null), 3500)
  }

  const onImport = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const restored = parseImport(String(reader.result))
        replace(restored)
        flash('ok', t('settings.imported'))
      } catch {
        flash('error', t('settings.importError'))
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  // Days 1..28 keep the financial month valid in every calendar month.
  const days = Array.from({ length: 28 }, (_, i) => i + 1)

  return (
    <div>
      <PageHeader title={t('settings.title')} />

      {msg && (
        <div
          className="mb-4 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold"
          style={{
            background: msg.type === 'ok' ? '#10B98119' : '#EF444419',
            color: msg.type === 'ok' ? '#10B981' : '#EF4444',
          }}
        >
          <FiCheckCircle /> {msg.text}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <Section title={t('settings.monthStart')}>
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
          <p className="muted mt-2 text-xs">{t('settings.monthStartHelp')}</p>
        </Section>

        <Section title={t('settings.currency')}>
          <Field label={t('settings.currency')}>
            <select
              className="input"
              value={settings.currency}
              onChange={(e) => patchSettings({ currency: e.target.value })}
            >
              <option value="SAR">SAR — Saudi Riyal</option>
              <option value="AED">AED — UAE Dirham</option>
              <option value="USD">USD — US Dollar</option>
              <option value="EUR">EUR — Euro</option>
            </select>
          </Field>
        </Section>

        <Section title={t('settings.appearance')}>
          <Segmented
            value={theme}
            onChange={setTheme}
            options={[
              { value: 'light', label: t('theme.light') },
              { value: 'dark', label: t('theme.dark') },
            ]}
          />
          <div className="muted mt-3 flex items-center gap-2 text-xs">
            {theme === 'dark' ? <FiMoon /> : <FiSun />}
            {theme === 'dark' ? t('theme.dark') : t('theme.light')}
          </div>
        </Section>

        <Section title={t('settings.language')}>
          <Segmented
            value={lang}
            onChange={setLang}
            options={[
              { value: 'en', label: 'English' },
              { value: 'ar', label: 'العربية' },
            ]}
          />
        </Section>
      </div>

      <div className="mt-4">
        <Section title={t('settings.data')}>
          <p className="muted text-sm">{t('settings.about')}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              className="btn btn-ghost"
              onClick={() => {
                exportState(state)
                flash('ok', t('settings.exported'))
              }}
            >
              <FiDownload /> {t('settings.export')}
            </button>
            <button className="btn btn-ghost" onClick={() => fileRef.current?.click()}>
              <FiUpload /> {t('settings.import')}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={onImport}
            />
            <button
              className="btn btn-ghost text-red-500"
              onClick={() => {
                if (confirm(t('settings.resetConfirm'))) {
                  reset()
                  flash('ok', t('settings.imported'))
                }
              }}
            >
              <FiTrash2 /> {t('settings.reset')}
            </button>
          </div>
          <p className="muted mt-4 text-xs">
            {t('settings.version')}: v{state.version}
          </p>
        </Section>
      </div>
    </div>
  )
}
