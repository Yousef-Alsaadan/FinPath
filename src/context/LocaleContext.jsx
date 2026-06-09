import { createContext, useContext, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

const LocaleContext = createContext(null)

export function LocaleProvider({ children }) {
  const { i18n } = useTranslation()
  const lang = i18n.language?.startsWith('ar') ? 'ar' : 'en'
  const dir = lang === 'ar' ? 'rtl' : 'ltr'

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('lang', lang)
    root.setAttribute('dir', dir)
  }, [lang, dir])

  const setLang = useCallback(
    (next) => {
      i18n.changeLanguage(next)
    },
    [i18n]
  )

  const toggle = useCallback(() => setLang(lang === 'ar' ? 'en' : 'ar'), [lang, setLang])

  return (
    <LocaleContext.Provider value={{ lang, dir, setLang, toggle }}>{children}</LocaleContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useLocale = () => useContext(LocaleContext)
