import React, { useState, useContext } from 'react'
import {
    Collapse,
    Navbar,
    NavbarToggler,
    Nav,
    NavItem,
    NavLink,
    Container
} from 'reactstrap'
import { Link } from 'react-router-dom'
import LoginModal from './auth/LoginModal'
import Logout from './auth/Logout'

import { AuthContext } from '../context/AuthState'

export default function AppNavbar() {

    const { auth } = useContext(AuthContext)

    const [isOpen, setIsOpen] = useState(false)

    const toggle = () => {
        setIsOpen(prevState => !prevState)
    }

    return (
        <Navbar color="dark" dark expand="sm">
            <Container>
                <Link to="/" className="linkStyle">
                    <Navbar className="text-light">ZEFIRO</Navbar>
                </Link>
                <NavbarToggler onClick={() => toggle()}></NavbarToggler>
                <Collapse isOpen={isOpen} navbar>
                    <Nav className="ml-auto" navbar>
                        <NavItem className="mr-5">
                            <NavLink className="mr-2">
                                <Link to="/about" className="linkStyle">About</Link>
                            </NavLink>
                        </NavItem>
                        {auth.isAuthenticated
                            ?
                            <>
                                <NavItem>
                                    <Logout />
                                </NavItem>
                                <NavItem>
                                    <NavLink>
                                        <Link to={`/user/${auth.user._id}`} className="linkStyle">User</Link>
                                    </NavLink>
                                </NavItem>
                            </>
                            :
                            <>
                                <NavItem>
                                    <LoginModal />
                                </NavItem>
                                <NavItem>
                                    <NavLink>
                                        <Link to="/register" className="linkStyle ml-lg-2">Register</Link>
                                    </NavLink>
                                </NavItem>
                            </>
                        }
                    </Nav>
                </Collapse>
            </Container>
        </Navbar>
    )
}