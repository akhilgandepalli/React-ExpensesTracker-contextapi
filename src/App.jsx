import React,{ useState } from 'react'
import './App.css'
import { GlobalContextProvider } from './GlobalContextProvider'
import Balance from './components/Balance'
import IncomeandExpense from './components/IncomeandExpense'
import TransactionList from './components/TransactionList'
import AddTransaction from './components/AddTransaction'

function App() {


  return (
    <>
      <GlobalContextProvider>    
        <main>
          <h3>Expense Tracker</h3>
          <Balance/>
          <IncomeandExpense/>
          <TransactionList />
          <AddTransaction />
        </main>
      </GlobalContextProvider>
    </>
  )
}

export default App
