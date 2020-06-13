import React, { createContext, useReducer } from 'react'
import ErrorReducer from './reducers/ErrorReducer'

export const ErrorContext = createContext()

export function ErrorProvider(props) {

    const [error, dispatch] = useReducer(ErrorReducer, {
        msg: null,
        status: null,
        id: null
    })

    const getErrors = (msg, status, id) => {
        dispatch({ type: 'GET_ERRORS', payload: { msg, status, id } })
    }

    const clearErrors = () => {
        dispatch({ type: 'CLEAR_ERRORS' })
    }

    return (
        <ErrorContext.Provider value={{ error, getErrors, clearErrors }}>
            {props.children}
        </ErrorContext.Provider>
    )
}