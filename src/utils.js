export const CATEGORIES = {
  income: [
    'Salary',
    'Freelance',
    'Business',
    'Bonus',
    'Gift',
    'Investment',
    'Interest',
    'Rental',
    'Refund',
    'Cashback',
    'Other',
  ],
  expense: [
    'Food',
    'Groceries',
    'Dining Out',
    'Transport',
    'Fuel',
    'Shopping',
    'Bills',
    'Rent',
    'Utilities',
    'Internet',
    'Entertainment',
    'Health',
    'Education',
    'Travel',
    'Insurance',
    'Subscriptions',
    'Personal Care',
    'Household',
    'Loan / EMI',
    'Charity',
    'Other',
  ],
}

export const CHART_COLORS = [
  '#5b8cff',
  '#34d399',
  '#f87171',
  '#fbbf24',
  '#c084fc',
  '#22d3ee',
  '#fb923c',
  '#f472b6',
  '#4ade80',
  '#60a5fa',
  '#a3e635',
  '#818cf8',
  '#2dd4bf',
  '#e879f9',
  '#facc15',
]

export const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(Number(value) || 0)

export const formatDate = (value) => {
  if (!value) return ''
  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export const todayISO = () => new Date().toISOString().slice(0, 10)

export const getTransactionType = (item) =>
  item.type || (Number(item.amount) >= 0 ? 'income' : 'expense')

export const isDateInRange = (date, from, to) => {
  if (!from && !to) return true
  if (!date) return true
  if (from && date < from) return false
  if (to && date > to) return false
  return true
}

export const dateBounds = (transactions) => {
  const dates = transactions.map((item) => item.date).filter(Boolean).sort()
  return {
    from: dates[0] || '',
    to: dates[dates.length - 1] || todayISO(),
  }
}

export const totalsByCategory = (transactions, type, from, to) => {
  const map = new Map()
  transactions.forEach((item) => {
    if (getTransactionType(item) !== type) return
    if (!isDateInRange(item.date, from, to)) return
    const category = item.category || 'Other'
    const amount = Math.abs(Number(item.amount) || 0)
    map.set(category, (map.get(category) || 0) + amount)
  })

  const total = [...map.values()].reduce((sum, value) => sum + value, 0)
  return [...map.entries()]
    .map(([name, value]) => ({
      name,
      value,
      percent: total ? (value / total) * 100 : 0,
    }))
    .sort((a, b) => b.value - a.value)
    .map((item, index) => ({
      ...item,
      color: CHART_COLORS[index % CHART_COLORS.length],
    }))
}
