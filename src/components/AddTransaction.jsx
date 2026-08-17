import React, { useContext, useMemo, useState } from 'react'
import { globalContext } from '../GlobalContextProvider'
import { CATEGORIES, todayISO } from '../utils'

const emptyForm = {
  name: '',
  amount: '',
  type: 'expense',
  category: 'Food',
  date: todayISO(),
}

const AddTransaction = () => {
  const { addTransaction } = useContext(globalContext)
  const [inputs, setInputs] = useState(emptyForm)
  const [error, setError] = useState('')

  const categories = useMemo(() => CATEGORIES[inputs.type], [inputs.type])

  const inputsUpdater = (e) => {
    const { name, value } = e.target
    setError('')
    setInputs((prev) => {
      if (name === 'type') {
        return {
          ...prev,
          type: value,
          category: CATEGORIES[value][0],
        }
      }
      return { ...prev, [name]: value }
    })
  }

  const submitHandler = (e) => {
    e.preventDefault()
    const name = inputs.name.trim()
    const amount = Number(inputs.amount)

    if (!name) {
      setError('Please enter a description.')
      return
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      setError('Enter an amount greater than 0.')
      return
    }

    addTransaction({
      id: crypto.randomUUID(),
      name,
      amount: inputs.type === 'expense' ? -Math.abs(amount) : Math.abs(amount),
      type: inputs.type,
      category: inputs.category,
      date: inputs.date || todayISO(),
    })

    setInputs({
      ...emptyForm,
      type: inputs.type,
      category: CATEGORIES[inputs.type][0],
      date: todayISO(),
    })
    setError('')
  }

  return (
    <section className="addT-container">
      <div className="section-head">
        <h3>Add transaction</h3>
      </div>
      <form className="addT-form" onSubmit={submitHandler} noValidate>
        <div className="type-toggle" role="group" aria-label="Transaction type">
          <label className={inputs.type === 'income' ? 'active income' : ''}>
            <input
              type="radio"
              name="type"
              value="income"
              checked={inputs.type === 'income'}
              onChange={inputsUpdater}
            />
            Income
          </label>
          <label className={inputs.type === 'expense' ? 'active expense' : ''}>
            <input
              type="radio"
              name="type"
              value="expense"
              checked={inputs.type === 'expense'}
              onChange={inputsUpdater}
            />
            Expense
          </label>
        </div>

        <label htmlFor="text">Description</label>
        <input
          id="text"
          type="text"
          name="name"
          onChange={inputsUpdater}
          value={inputs.name}
          placeholder="e.g. Groceries, Salary"
          autoComplete="off"
        />

        <div className="form-row">
          <div>
            <label htmlFor="amount">Amount</label>
            <input
              id="amount"
              type="number"
              name="amount"
              min="0"
              step="0.01"
              onChange={inputsUpdater}
              value={inputs.amount}
              placeholder="0.00"
            />
          </div>
          <div>
            <label htmlFor="date">Date</label>
            <input
              id="date"
              type="date"
              name="date"
              onChange={inputsUpdater}
              value={inputs.date}
            />
          </div>
        </div>

        <label htmlFor="category">Category</label>
        <select
          id="category"
          name="category"
          value={inputs.category}
          onChange={inputsUpdater}
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        {error ? <p className="form-error">{error}</p> : null}

        <button type="submit" className="primary-btn">
          Add {inputs.type}
        </button>
      </form>
    </section>
  )
}

export default AddTransaction
