import React, { createContext, useReducer } from 'react'

export const initialState = {
    transactions:[
        {id:1,name:'Salary',amount:10000},
        {id:2,name:'Biryani',amount:-1000},
        {id:3,name:'Groceries',amount:-5000},
        {id:4,name:'Clothes',amount:-3000},
        {id:5,name:'Gift',amount:3000}
    ]
}
export const appReducer = (state,action)=>{
    switch(action.type){
        case 'DELETE_TRANSACTION':
            return {
                ...state,
                transactions: state.transactions.filter((item)=>(item.id !== action.payload))
            }
        case 'ADD_TRANSACTION':
            return {
                ...state,
                transactions: [...state.transactions,action.payload]
            }
        default:
            state;
    }
}
export const globalContext = createContext(initialState);

export const GlobalContextProvider = ({children}) => {
    const[globalState,dispatch] = useReducer(appReducer,initialState);
    const deleteTransaction = (id) =>{
        dispatch({type:'DELETE_TRANSACTION', payload:id})
    }
    const addTransaction = (transaction) =>{
        dispatch({type:'ADD_TRANSACTION', payload:transaction})
    }
  return (
    <>
    <globalContext.Provider value={{
        transactions:globalState.transactions,deleteTransaction,addTransaction
        }}>
        {children}
    </globalContext.Provider>
    </>
  )
}
