import React, { useState, useEffect, useContext } from 'react'
import {
    Button,
    Modal,
    ModalBody,
    Form,
    FormGroup,
    Label,
    Input,
    NavLink,
    Alert
} from 'reactstrap'
import { useHistory } from 'react-router-dom'
import { AuthContext } from '../../context/AuthState'
import { ErrorContext } from '../../context/ErrorState'

export default function LoginModal() {

    const { auth, login } = useContext(AuthContext)
    const { error, clearErrors } = useContext(ErrorContext)

    const [modal, setModal] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [msg, setMsg] = useState('')
    const history = useHistory()

    useEffect(() => {

        if (error.id === 'LOGIN_FAIL') {
            setMsg(error.msg.msg)
        } else {
            setMsg('')
        }

        if (modal) {
            if (auth.isAuthenticated) {
                clearErrors()
                toggle()
                history.push(`/user/${auth.user.id}`)
            }
        }

    }, [error, auth])


    const toggle = () => {
        setEmail('')
        setPassword('')
        setModal(prevState => !prevState)
    }

    const handleChange = (f, e) => {
        f(e.target.value)
    }

    const handleSubmit = (e) => {
        const user = {
            email,
            password
        }

        login(user)

        e.preventDefault()
    }


    return (
        <>

            <NavLink
                onClick={() => {
                    history.push('/')
                    toggle()
                }}
                style={{ cursor: 'pointer' }}
            >
                Login
            </NavLink>


            <Modal
                isOpen={modal}
                toggle={toggle}
                centered
            >
                <ModalBody>
                    <h3 className="text-center">Login</h3>
                    {msg ? <Alert color='danger' className="my-2">{msg}</Alert> : null}
                    <Form onSubmit={(e) => handleSubmit(e)}>
                        <FormGroup>
                            <Label for="email" className="text-center">Email</Label>
                            <Input
                                type="email"
                                name="email"
                                value={email}
                                placeholder="Email"
                                onChange={(e) => handleChange(setEmail, e)}
                            />
                            <Label for="password" className="mt-4">Password</Label>
                            <Input
                                type="password"
                                name="password"
                                value={password}
                                placeholder="Password"
                                onChange={(e) => handleChange(setPassword, e)}
                                className="mb-5"
                            />
                        </FormGroup>
                        <Button
                            color="primary"
                            block
                        >
                            Login
                        </Button>
                        <Button
                            color="danger"
                            outline
                            block
                            onClick={() => toggle()}
                        >
                            Close
                        </Button>
                    </Form>
                </ModalBody>
            </Modal>
        </>
    )
}
