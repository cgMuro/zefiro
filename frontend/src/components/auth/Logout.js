import React, { useContext } from 'react'
import { NavLink } from 'reactstrap'
import { AuthContext } from '../../context/AuthState'

export default function Logout() {

    const { logout } = useContext(AuthContext)

    return (
        <NavLink onClick={() => logout()} style={{ cursor: 'pointer' }}>
            Logout
        </NavLink>
    )
}