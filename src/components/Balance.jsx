import React, { useContext } from 'react'
import { globalContext } from '../GlobalContextProvider'

const Balance = () => {
  const context=useContext(globalContext);
  const amounts=context.transactions.map((item)=>(item.amount));
  const total = amounts.reduce((acc,item)=>(acc+=parseInt(item)),0);
  return (
    <div className='balance-container'>
        <p>Your Balance</p>
        <div className='balance' id={total>=0?'profit':'loss'}>
          Rs.<span>
          {total}
          </span></div>
    </div>
  )
}

export default Balance