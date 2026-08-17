import React, { createContext, useEffect, useReducer } from 'react'

export const STORAGE_KEY = 'expense-tracker-data'

const emptyState = {
  transactions: [],
}

const loadState = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return emptyState
    const parsed = JSON.parse(saved)
    if (Array.isArray(parsed)) {
      return { transactions: parsed }
    }
    if (parsed && Array.isArray(parsed.transactions)) {
      return { transactions: parsed.transactions }
    }
  } catch {
    // Ignore malformed storage and start fresh
  }
  return emptyState
}

export const appReducer = (state, action) => {
  switch (action.type) {
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter((item) => item.id !== action.payload),
      }
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
      }
    case 'RESET':
      return emptyState
    default:
      return state
  }
}

export const globalContext = createContext(emptyState)

export const GlobalContextProvider = ({ children }) => {
  const [globalState, dispatch] = useReducer(appReducer, undefined, loadState)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(globalState.transactions))
  }, [globalState.transactions])

  const deleteTransaction = (id) => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: id })
  }

  const addTransaction = (transaction) => {
    dispatch({ type: 'ADD_TRANSACTION', payload: transaction })
  }

  const resetTransactions = () => {
    dispatch({ type: 'RESET' })
  }

  return (
    <globalContext.Provider
      value={{
        transactions: globalState.transactions,
        deleteTransaction,
        addTransaction,
        resetTransactions,
      }}
    >
      {children}
    </globalContext.Provider>
  )
}
