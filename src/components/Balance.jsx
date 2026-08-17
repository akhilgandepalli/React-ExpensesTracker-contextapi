import React, { useContext } from 'react'
import { globalContext } from '../GlobalContextProvider'
import { formatCurrency } from '../utils'

const Balance = () => {
  const { transactions } = useContext(globalContext)
  const total = transactions.reduce((sum, item) => sum + Number(item.amount), 0)
  const tone = total >= 0 ? 'profit' : 'loss'

  return (
    <section className="balance-card">
      <p className="eyebrow">Available balance</p>
      <h2 className={`balance ${tone}`}>{formatCurrency(total)}</h2>
      <p className="balance-hint">
        {transactions.length === 0
          ? 'Add your first transaction to start tracking.'
          : `${transactions.length} transaction${transactions.length === 1 ? '' : 's'} saved on this device`}
      </p>
    </section>
  )
}

export default Balance
