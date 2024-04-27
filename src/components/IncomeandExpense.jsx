import React, { useContext } from 'react'
import { globalContext } from '../GlobalContextProvider'

const IncomeandExpense = () => {
  const context = useContext(globalContext);
  const amounts = context.transactions.map((item)=>(item.amount));
  const income = amounts.reduce((acc,item)=>(item>=0?acc+=parseInt(item):acc),0)
  const expense = amounts.reduce((acc,item)=>(item<0?acc+=parseInt(item):acc),0)
  return (
    <div className='IncomeandExpence-container'>
        <div className='income'>
          <p>Income</p>
          <div className='amount'>Rs.{income}</div>
        </div>
        <div className="expense">
          <p>Expense</p>
          <div className='amount'>Rs.{Math.abs(expense)}</div>
        </div>
    </div>
  )
}

export default IncomeandExpense