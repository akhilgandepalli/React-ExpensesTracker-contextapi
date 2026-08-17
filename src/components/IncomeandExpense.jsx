import React, { useContext } from 'react'
import { globalContext } from '../GlobalContextProvider'
import { formatCurrency } from '../utils'

const IncomeandExpense = () => {
  const { transactions } = useContext(globalContext)
  const income = transactions.reduce(
    (sum, item) => (Number(item.amount) > 0 ? sum + Number(item.amount) : sum),
    0
  )
  const expense = transactions.reduce(
    (sum, item) => (Number(item.amount) < 0 ? sum + Number(item.amount) : sum),
    0
  )
  const spentRatio = income > 0 ? Math.min(100, (Math.abs(expense) / income) * 100) : 0

  return (
    <section className="summary-grid">
      <article className="summary-card income">
        <p className="eyebrow">Income</p>
        <p className="amount">{formatCurrency(income)}</p>
      </article>
      <article className="summary-card expense">
        <p className="eyebrow">Expense</p>
        <p className="amount">{formatCurrency(Math.abs(expense))}</p>
      </article>
      <div className="spend-meter" aria-hidden={income === 0}>
        <div className="spend-meter-labels">
          <span>Spent vs income</span>
          <span>{income === 0 ? '—' : `${Math.round(spentRatio)}%`}</span>
        </div>
        <div className="spend-track">
          <div className="spend-fill" style={{ width: `${spentRatio}%` }} />
        </div>
      </div>
    </section>
  )
}

export default IncomeandExpense
