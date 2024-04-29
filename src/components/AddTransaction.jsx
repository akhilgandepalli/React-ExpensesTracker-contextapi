import React, { useContext, useState } from 'react'
import { globalContext } from '../GlobalContextProvider';

const AddTransaction = () => {
  const context = useContext(globalContext);
  const[inputs, setInputs] = useState({id:(context.transactions.length+1),name:'',amount:''});

  const inputsUpdater=(e)=>{
    const{name, value}=e.target;
    setInputs({...inputs,[name]:value});
  }
  const submitHandler=(e)=>{
    e.preventDefault();
    context.addTransaction(inputs);
    setInputs({id:'',name:'',amount:''})
  }
  return (
    <div className='addT-container'>
        <div className='addT-head'>Add New Transaction</div>
        <form action="" className='addT-form' onSubmit={submitHandler}>
            <label htmlFor="text">Text</label>
            <input 
            id='text' 
            type="text" 
            name='name'
            onChange={inputsUpdater}
            value={inputs.name}
            placeholder='Enter Text...'/>
            <label htmlFor="amount">Amount</label>
            <input 
            id='amount' 
            type="text"
            name='amount' 
            onChange={inputsUpdater}
            value={inputs.amount}
            placeholder='Enter Amount...'/>
            <button type='submit'>Add Transaction</button>
        </form>
    </div>
  )
}

export default AddTransaction