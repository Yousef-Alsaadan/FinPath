import { FiMoon, FiSun } from 'react-icons/fi'
import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import { useLocale } from '../context/LocaleContext'
import { useTranslation } from 'react-i18next'

export function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const { t } = useTranslation()
  return (
    <button
      onClick={toggle}
      className="btn-ghost grid h-9 w-9 place-items-center rounded-lg"
      aria-label={t('theme.toggle')}
      title={t('theme.toggle')}
    >
      <motion.span key={theme} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}>
        {theme === 'dark' ? <FiSun /> : <FiMoon />}
      </motion.span>
    </button>
  )
}

export function LangToggle() {
  const { toggle } = useLocale()
  const { t } = useTranslation()
  return (
    <button
      onClick={toggle}
      className="btn-ghost h-9 rounded-lg px-3 text-sm font-bold"
      aria-label={t('lang.label')}
      title={t('lang.label')}
    >
      {t('lang.switch')}
    </button>
  )
}
