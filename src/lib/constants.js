export const STORAGE_KEY = 'finpath.data'
export const SCHEMA_VERSION = 1

export const CATEGORIES = [
  { id: 'housing', icon: 'FaHome', color: '#6366F1' },
  { id: 'utilities', icon: 'FaBolt', color: '#F59E0B' },
  { id: 'food', icon: 'FaUtensils', color: '#EF4444' },
  { id: 'transport', icon: 'FaCar', color: '#3B82F6' },
  { id: 'entertainment', icon: 'FaFilm', color: '#EC4899' },
  { id: 'education', icon: 'FaGraduationCap', color: '#8B5CF6' },
  { id: 'healthcare', icon: 'FaHeartbeat', color: '#14B8A6' },
  { id: 'shopping', icon: 'FaShoppingBag', color: '#F97316' },
  { id: 'savings', icon: 'FaPiggyBank', color: '#10B981' },
  { id: 'other', icon: 'FaEllipsisH', color: '#64748B' },
]

export const CATEGORY_COLORS = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.color]))

export const INCOME_SOURCES = ['salary', 'business', 'side', 'other']

export const GOAL_PRESETS = [
  { id: 'emergency', icon: 'FaShieldAlt' },
  { id: 'car', icon: 'FaCar' },
  { id: 'travel', icon: 'FaPlane' },
  { id: 'home', icon: 'FaHome' },
  { id: 'debt', icon: 'FaCreditCard' },
  { id: 'custom', icon: 'FaStar' },
]

export const PRIORITIES = ['high', 'medium', 'low']
