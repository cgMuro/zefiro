import React, { createContext, useReducer, useContext } from 'react'
import axios from 'axios'
import { ErrorContext } from './ErrorState'
import AuthReducer from './reducers/AuthReducer'
import { useHistory } from 'react-router-dom'

export const AuthContext = createContext()

export function AuthProvider(props) {

    const { getErrors } = useContext(ErrorContext)

    
    const history = useHistory()
    
    const [ auth, dispatch ] = useReducer(AuthReducer, {
        token: localStorage.getItem('token'),
        isAuthenticated: null,
        isLoading: false,
        user: null
    })

    // CONFIG TOKEN
    const tokenConfig = () => {
        const token = localStorage.getItem('token')

        const config = {
            headers: {
                'Content-type': 'application/json'
            }
        }

        if(token) {
            config.headers['x-auth-token'] = token
        }

        return config
    }

    // LOAD USER
    const loadUser = async() => {
        dispatch({ type: 'LOAD_USER' })

        try {
            const res = await axios.get('/api/auth/user', tokenConfig())
            dispatch({ type: 'USER_LOADED', payload: res.data})
            // history.push(`/user/${res.data._id}`)
        } catch (error) {
            getErrors(error.response.data, error.response.status)
            dispatch({ type: 'AUTH_ERROR' })
        }
    }

    // REGISTER USER
    const register = async({ name, email, password, pen_name }) => {

        const config = {
            'headers': {
                'Content-type': 'application/json'
            }
        }

        const body = JSON.stringify({ name, email, password, pen_name })
        
        try {
            const res = await axios.post('/api/users', body, config)
            dispatch({ type: 'REGISTER_SUCCESS', payload: res.data })
            history.push(`/user/${res.data.user.id}`)
        } catch (error) {
            getErrors(error.response.data, error.response.status, 'REGISTER_FAIL')
            dispatch({ type: 'REGISTER_FAIL'})
        }
    }

    // LOGIN
    const login = async({ email, password }) => {
        const config = {
            'headers': {
                'Content-type': 'application/json'
            }
        }

        const body = JSON.stringify({ email, password })

        try {
            const res = await axios.post('/api/auth', body, config)
            dispatch({ type: 'LOGIN_SUCCESS', payload: res.data })
            history.push(`/user/${res.data.user.id}`)
        } catch (error) {
            getErrors(error.response.data, error.response.status, 'LOGIN_FAIL')
            dispatch({ type: 'LOGIN_FAIL' })
        }
    }


    //LOGOUT
    const logout = () => {
        dispatch({ type: 'LOGOUT_SUCCESS' })
        history.push('/')
    }

    return (
        <AuthContext.Provider value={{ auth, tokenConfig, loadUser, register, login, logout }}>
            {props.children}
        </AuthContext.Provider>
    )
}
