// ----- Financial month -----
// A financial month begins on `startDay` (1..28) and runs until the next start.

function clampDay(day, year, month) {
  // month is 0-indexed; clamp startDay to the month's length (handles Feb / 30-day months)
  const last = new Date(year, month + 1, 0).getDate()
  return Math.min(day, last)
}

export function getPeriod(date, startDay) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  let year = d.getFullYear()
  let month = d.getMonth()
  const startThisMonth = clampDay(startDay, year, month)

  let start
  if (d.getDate() >= startThisMonth) {
    start = new Date(year, month, startThisMonth)
  } else {
    const pm = month === 0 ? 11 : month - 1
    const py = month === 0 ? year - 1 : year
    start = new Date(py, pm, clampDay(startDay, py, pm))
  }
  const nm = start.getMonth() === 11 ? 0 : start.getMonth() + 1
  const ny = start.getMonth() === 11 ? start.getFullYear() + 1 : start.getFullYear()
  const end = new Date(ny, nm, clampDay(startDay, ny, nm)) // exclusive

  const key = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}-${String(
    start.getDate()
  ).padStart(2, '0')}`
  return { key, start, end }
}

export function currentPeriod(startDay) {
  return getPeriod(new Date(), startDay)
}

export function inPeriod(dateStr, period) {
  const t = new Date(dateStr).getTime()
  return t >= period.start.getTime() && t < period.end.getTime()
}

export function daysLeftInPeriod(period) {
  const now = Date.now()
  return Math.max(0, Math.ceil((period.end.getTime() - now) / 86400000))
}

// Returns the last `count` periods (oldest first), each { key, start, end }
export function recentPeriods(startDay, count = 6) {
  const periods = []
  let cursor = currentPeriod(startDay)
  for (let i = 0; i < count; i++) {
    periods.unshift(cursor)
    const prevDate = new Date(cursor.start)
    prevDate.setDate(prevDate.getDate() - 1)
    cursor = getPeriod(prevDate, startDay)
  }
  return periods
}

// ----- Aggregations -----
export const sum = (arr, sel = (x) => x.amount) => arr.reduce((a, b) => a + (Number(sel(b)) || 0), 0)

export function periodIncome(income, period) {
  return sum(income.filter((i) => i.recurring || inPeriod(i.date, period)))
}

export function periodExpenses(expenses, period) {
  return sum(expenses.filter((e) => inPeriod(e.date, period)))
}

export function fixedTotal(fixed) {
  return sum(fixed)
}

export function spendingByCategory(expenses, period) {
  const map = {}
  expenses.filter((e) => inPeriod(e.date, period)).forEach((e) => {
    map[e.category] = (map[e.category] || 0) + (Number(e.amount) || 0)
  })
  return map
}

export function lifetimeByCategory(expenses) {
  const map = {}
  expenses.forEach((e) => {
    map[e.category] = (map[e.category] || 0) + (Number(e.amount) || 0)
  })
  return map
}

export function budgetStatus(budget, expenses, period) {
  const spent = sum(
    expenses.filter((e) => e.category === budget.category && inPeriod(e.date, period))
  )
  const ratio = budget.limit > 0 ? spent / budget.limit : 0
  let state = 'ok'
  if (ratio >= 1) state = 'over'
  else if (ratio >= 0.85) state = 'near'
  return { spent, ratio, state, remaining: budget.limit - spent }
}

export function goalProgress(goal) {
  const saved = goal.saved ?? sum(goal.contributions || [])
  const pct = goal.target > 0 ? Math.min(1, saved / goal.target) : 0
  return { saved, pct }
}

// ----- Financial health score (0..100) -----
export function healthScore({ income, expenses, fixed, budgets, goals, period, startDay = 1 }) {
  const inc = periodIncome(income, period)
  const exp = periodExpenses(expenses, period) + fixedTotal(fixed)

  // 1. Savings rate (40%): savings / income, capped at 30% -> full marks
  const savingsRate = inc > 0 ? (inc - exp) / inc : 0
  const savingsScore = Math.max(0, Math.min(1, savingsRate / 0.3)) * 40

  // 2. Budget adherence (25%): share of budgets within their limit
  let budgetScore = 25
  if (budgets.length) {
    const within = budgets.filter((b) => budgetStatus(b, expenses, period).ratio <= 1).length
    budgetScore = (within / budgets.length) * 25
  }

  // 3. Expense stability (15%): closer current spend is to recent average, the better
  let stabilityScore = 15
  const totals = recentPeriods(startDay, 4).map(
    (p) => periodExpenses(expenses, p)
  )
  const hist = totals.slice(0, -1).filter((t) => t > 0)
  if (hist.length) {
    const avg = hist.reduce((a, b) => a + b, 0) / hist.length
    const cur = totals[totals.length - 1]
    const deviation = avg > 0 ? Math.abs(cur - avg) / avg : 0
    stabilityScore = Math.max(0, 1 - Math.min(1, deviation)) * 15
  }

  // 4. Goal progress (20%): average progress across goals
  let goalScore = 20
  if (goals.length) {
    const avgPct = goals.reduce((a, g) => a + goalProgress(g).pct, 0) / goals.length
    goalScore = avgPct * 20
  }

  const total = Math.round(savingsScore + budgetScore + stabilityScore + goalScore)
  return { total: Math.max(0, Math.min(100, total)), savingsRate }
}

export function scoreBand(total) {
  if (total >= 80) return 'excellent'
  if (total >= 60) return 'good'
  if (total >= 40) return 'fair'
  return 'poor'
}

// Estimated completion date for a goal given monthly contribution
export function goalEta(goal) {
  const { saved } = goalProgress(goal)
  const remaining = goal.target - saved
  if (remaining <= 0) return { done: true }
  const monthly = Number(goal.monthly) || 0
  if (monthly <= 0) return { done: false, months: null }
  const months = Math.ceil(remaining / monthly)
  const eta = new Date()
  eta.setMonth(eta.getMonth() + months)
  return { done: false, months, date: eta }
}

export const uid = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
