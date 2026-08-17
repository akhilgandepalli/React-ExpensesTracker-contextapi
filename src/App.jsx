import React, { useContext, useState } from 'react'
import './App.css'
import { globalContext, GlobalContextProvider } from './GlobalContextProvider'
import { ThemeProvider } from './ThemeProvider'
import Balance from './components/Balance'
import IncomeandExpense from './components/IncomeandExpense'
import TransactionList from './components/TransactionList'
import AddTransaction from './components/AddTransaction'
import ResetConfirm from './components/ResetConfirm'
import CategoryCharts from './components/CategoryCharts'
import ThemeToggle from './components/ThemeToggle'

const Tracker = () => {
  const { resetTransactions, transactions } = useContext(globalContext)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [chartsOpen, setChartsOpen] = useState(false)

  const handleReset = () => {
    resetTransactions()
    setConfirmOpen(false)
  }

  return (
    <main>
      <header className="app-header">
        <div>
          <p className="eyebrow">Personal finance</p>
          <h1>Expense Tracker</h1>
        </div>
        <div className="header-actions">
          <ThemeToggle />
          <button
            type="button"
            className="ghost-btn reset-btn"
            onClick={() => setConfirmOpen(true)}
            disabled={transactions.length === 0}
          >
            Reset
          </button>
        </div>
      </header>
      <Balance />
      <IncomeandExpense />
      <button
        type="button"
        className="ghost-btn charts-launch"
        onClick={() => setChartsOpen(true)}
        disabled={transactions.length === 0}
      >
        View category charts
      </button>
      <TransactionList />
      <AddTransaction />
      <ResetConfirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleReset}
      />
      <CategoryCharts
        open={chartsOpen}
        transactions={transactions}
        onClose={() => setChartsOpen(false)}
      />
    </main>
  )
}

function App() {
  return (
    <ThemeProvider>
      <GlobalContextProvider>
        <Tracker />
      </GlobalContextProvider>
    </ThemeProvider>
  )
}

export default App
