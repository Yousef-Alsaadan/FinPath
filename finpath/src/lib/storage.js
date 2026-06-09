import { STORAGE_KEY, SCHEMA_VERSION } from './constants'

export function defaultState() {
  return {
    version: SCHEMA_VERSION,
    onboarded: false,
    settings: {
      monthStartDay: 1,
      currency: 'SAR',
    },
    income: [], // { id, name, source, amount, recurring, date }
    expenses: [], // { id, title, category, amount, date, notes, recurring }
    budgets: [], // { id, name, category, limit }
    goals: [], // { id, name, preset, target, targetDate, priority, monthly, saved, contributions:[{id,amount,date}] }
    fixed: [], // { id, name, category, amount }
    // payment status per fixed expense per financial period: { "fixedId:periodKey": { status, paid } }
    fixedStatus: {},
  }
}

// Migrations keyed by the version they upgrade *from*.
const migrations = {
  // 0: (state) => ({ ...state, version: 1 }),
}

function migrate(state) {
  let s = { ...state }
  let v = s.version ?? 0
  while (v < SCHEMA_VERSION) {
    const fn = migrations[v]
    s = fn ? fn(s) : s
    v += 1
    s.version = v
  }
  return s
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState()
    const parsed = JSON.parse(raw)
    const merged = { ...defaultState(), ...parsed }
    merged.settings = { ...defaultState().settings, ...(parsed.settings || {}) }
    return migrate(merged)
  } catch (err) {
    console.error('FinPath: failed to load state, starting fresh.', err)
    return defaultState()
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (err) {
    console.error('FinPath: failed to save state.', err)
  }
}

export function exportState(state) {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  const stamp = new Date().toISOString().slice(0, 10)
  a.href = url
  a.download = `finpath-backup-${stamp}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function parseImport(text) {
  const parsed = JSON.parse(text)
  if (typeof parsed !== 'object' || parsed === null || !('settings' in parsed)) {
    throw new Error('Not a FinPath backup')
  }
  const merged = { ...defaultState(), ...parsed }
  merged.settings = { ...defaultState().settings, ...(parsed.settings || {}) }
  return migrate(merged)
}
