import React, { useContext, useMemo, useState } from 'react'
import { globalContext } from '../GlobalContextProvider'
import { formatCurrency, formatDate } from '../utils'

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'income', label: 'Income' },
  { id: 'expense', label: 'Expense' },
]

const TransactionList = () => {
  const { transactions, deleteTransaction } = useContext(globalContext)
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase()
    return transactions.filter((item) => {
      const amount = Number(item.amount)
      const type = item.type || (amount >= 0 ? 'income' : 'expense')
      const matchesFilter = filter === 'all' || type === filter
      const matchesQuery =
        !term ||
        item.name.toLowerCase().includes(term) ||
        (item.category || '').toLowerCase().includes(term)
      return matchesFilter && matchesQuery
    })
  }, [transactions, filter, query])

  return (
    <section className="history-card">
      <div className="section-head">
        <div>
          <h3>History</h3>
          <p className="muted">{visible.length} shown</p>
        </div>
      </div>

      <div className="history-tools">
        <div className="filter-pills" role="tablist" aria-label="Filter transactions">
          {FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={filter === item.id}
              className={filter === item.id ? 'pill active' : 'pill'}
              onClick={() => setFilter(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <input
          className="search-input"
          type="search"
          placeholder="Search name or category"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search transactions"
        />
      </div>

      {visible.length === 0 ? (
        <div className="empty-state">
          <p>{transactions.length === 0 ? 'No transactions yet' : 'No matches'}</p>
          <span>
            {transactions.length === 0
              ? 'Use the form below to add income or an expense.'
              : 'Try a different filter or search term.'}
          </span>
        </div>
      ) : (
        <ul className="Tlists">
          {visible.map((list) => {
            const amount = Number(list.amount)
            const isIncome = amount >= 0
            return (
              <li key={list.id} className={isIncome ? 'plus' : 'minus'}>
                <div className="tx-main">
                  <strong>{list.name}</strong>
                  <span className="tx-meta">
                    {list.category || (isIncome ? 'Income' : 'Expense')}
                    {list.date ? ` · ${formatDate(list.date)}` : ''}
                  </span>
                </div>
                <div className={`tx-amount ${isIncome ? 'plus' : 'minus'}`}>
                  {isIncome ? '+' : '−'}
                  {formatCurrency(Math.abs(amount))}
                </div>
                <button
                  className="delete-btn"
                  type="button"
                  aria-label={`Delete ${list.name}`}
                  onClick={() => deleteTransaction(list.id)}
                >
                  ×
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}

export default TransactionList
