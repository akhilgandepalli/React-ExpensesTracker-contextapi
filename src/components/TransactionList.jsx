import React, { useContext } from 'react'

import { globalContext } from '../GlobalContextProvider'


const TransactionList = () => {
  const context = useContext(globalContext);
  return (
    <div className='Tlist-container'>
        <div className='Tlist-head'>History</div>
        <ul className='Tlists'>
          {context.transactions.map((list)=>(<li key={list.id} className={list.amount>=0?'plus':'minus'}>
                <div>{list.name}</div>
                <div>Rs.{list.amount}</div>
                <button 
                className='delete-btn' 
                onClick={()=>context.deleteTransaction(list.id)}>X</button>
            </li>))}
        </ul>
    </div>
  )
}

export default TransactionList