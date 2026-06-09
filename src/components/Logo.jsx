import { useTheme } from '../context/ThemeContext'

export function Logo({ compact = false, className = '' }) {
  const { theme } = useTheme()
  if (compact) {
    return <img src="/logo.svg" alt="FinPath" className={className} width={36} height={36} />
  }
  const src = theme === 'dark' ? '/logo-dark.svg' : '/logo-light.svg'
  return <img src={src} alt="FinPath" className={className} />
}
