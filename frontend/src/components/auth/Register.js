import React, { useState, useEffect, useContext } from 'react'
import './css/Register.css'
import {
    Container,
    Form,
    FormGroup,
    Label,
    Input,
    Alert,
    Button,
    FormText
} from 'reactstrap'
import { AuthContext } from '../../context/AuthState'
import { ErrorContext } from '../../context/ErrorState'

export default function Register() {

    const { auth, register } = useContext(AuthContext)
    const { error } = useContext(ErrorContext)

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [penName, setPenName] = useState('')
    const [msg, setMsg] = useState('')

    useEffect(() => {
        if (error.id === 'REGISTER_FAIL') {
            setMsg(error.msg.msg)
        } else {
            setMsg('')
        }
    }, [error, auth])

    const handleChange = (f, e) => {
        f(e.target.value)
    }

    const handleSumbit = (e) => {
        const newUser = {
            name,
            email,
            password,
            pen_name: penName ? penName : null
        }

        register(newUser)

        e.preventDefault()
    }

    return (
        <div id="body-container">
            <Container className="d-flex align-items-center justify-content-center" id="container">
                <div className="container-fluid my-3">
                    {msg ? <Alert color="danger">{msg}</Alert> : null}
                    <h4 className="text-center">Sign up</h4>
                    <Form onSubmit={(e) => handleSumbit(e)}>
                        <FormGroup>
                            <Label for="name" className="" inline>Name</Label>
                            <Input
                                type="text"
                                name="name"
                                value={name}
                                placeholder="Name"
                                onChange={(e) => handleChange(setName, e)}
                                required
                            />
                            <Label for="email" className="mt-5">Email</Label>
                            <Input
                                type="email"
                                name="email"
                                value={email}
                                placeholder="name@example.com"
                                onChange={(e) => handleChange(setEmail, e)}
                                required
                            />
                            <Label for="password" className="mt-5">Password</Label>
                            <Input
                                type="password"
                                name="password"
                                value={password}
                                placeholder="Password"
                                onChange={(e) => handleChange(setPassword, e)}
                                required
                            />
                            <Label for="penName" className="mt-5">Pen name</Label>
                            <Input
                                type="text"
                                name="penName"
                                value={penName}
                                placeholder="Pen name"
                                onChange={(e) => handleChange(setPenName, e)}
                            />
                            <FormText>You can enter one if you don't want your real name to be display. But it's not required.</FormText>
                        </FormGroup>
                        <Button
                            type="submit"
                            color="info"
                            block
                            className="mt-5"
                        >
                            Register
            </Button>
                    </Form>
                </div>
            </Container>
        </div>

    )
}
