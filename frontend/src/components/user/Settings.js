import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthState'
import { Container, Row, Col, Button, Modal, ModalBody, Label, Input, FormGroup, Form } from 'reactstrap'
import { AlertContext } from '../../context/AlertState';
import { useHistory } from 'react-router-dom';
import axios from 'axios'

export default function Settings(props) {

    const { auth: { user, isAuthenticated }, tokenConfig } = useContext(AuthContext);
    const { setAlertMsg } = useContext(AlertContext);

    const [isOpen, setIsOpen] = useState(false)
    const [input, setInput] = useState('')
    const [toUpdate, setToUpdate] = useState('')

    const history = useHistory()

    // Don't allow access if is unathorized
    useEffect(() => {
        if (isAuthenticated === false) {
            setAlertMsg('Please login to access that page.')
            history.push('/')
        }
    }, [isAuthenticated])

    const toggle = () => {
        setIsOpen(prevState => !prevState)
    }

    const handleChange = (e) => {
        setInput(e.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        let updateData;
        if (toUpdate === 'name') {
            updateData = {
                name: input
            }
        } else {
            updateData = {
                pen_name: input
            }
        }

        try {
            await axios.put(`/api/users/${props.match.params.id}`, updateData, tokenConfig())

            const articles = (await axios.get(`/api/articles/user/${props.match.params.id}`)).data.data
            articles.forEach(async (article) => {
                let data = {
                    author: {
                        id: article.author.id,
                        name: input === '' ? user.name : input
                    }
                }
                await axios.put(`/api/articles/edit/${article._id}`, data, tokenConfig())
            })
            history.go(0)
        } catch (error) {
            console.log(error)
        }
        setInput('')
        setToUpdate('')
    }

    return (
        <>

            <Modal
                isOpen={isOpen}
                toggle={toggle}
                centered
            >
                <ModalBody>
                    <Form onSubmit={(e) => handleSubmit(e)}>
                        <FormGroup>
                            <Label htmlFor={toUpdate}>New {toUpdate === 'pen_name' ? 'pen name' : toUpdate}</Label>
                            <Input
                                name={toUpdate}
                                value={input}
                                onChange={(e) => handleChange(e)}
                                placeholder={toUpdate === 'pen_name' ? 'pen name' : toUpdate}
                                required={true}
                            />
                        </FormGroup>
                    </Form>
                    <Button
                        color="outline-info"
                        className="mt-3"
                        block
                        onClick={(e) => {
                            if(input !== ''){
                                toggle()
                                handleSubmit(e)
                            }
                        }}
                    >
                        Submit
                    </Button>
                    <Button
                        color="outline-danger"
                        className="mt-3"
                        block
                        onClick={() => toggle()}
                    >
                        Close
                    </Button>
                </ModalBody>
            </Modal>

            <Container className="d-flex justify-content-center align-items-center flex-column" id="container-settings">
                {
                    user
                        ?
                        <Container className="p-5">
                            <Row className="mb-4">
                                <Col sm={10}>
                                    <p>Name: <b>{user.name}</b></p>
                                </Col>
                                <Col sm={2}>
                                    <Button
                                        color="outline-primary"
                                        size="sm"
                                        onClick={() => {
                                            toggle()
                                            setToUpdate('name')
                                        }}
                                    >
                                        Change
                                </Button>
                                </Col>
                            </Row>
                            <Row className="mt-5 mb-5">
                                <Col sm={10}>
                                    <p>Email: <b>{user.email}</b></p>
                                </Col>
                            </Row>
                            <Row className="mt-5 mb-5">
                                <Col sm={9}>
                                    <p>Pen name: <b>{user.pen_name ? user.pen_name : 'No pen name'}</b></p>
                                </Col>
                                <Col sm={1}>
                                    <Button
                                        color="outline-primary"
                                        className="mr-2"
                                        size="sm"
                                        onClick={() => {
                                            toggle()
                                            setToUpdate('pen_name')
                                        }}
                                    >
                                        Change
                                    </Button>
                                </Col>
                                <Col sm={1}>
                                    <Button
                                        className="ml-5"
                                        color="outline-danger"
                                        size="sm"
                                        onClick={(e) => {
                                            setInput('')
                                            setToUpdate('pen_name')
                                            handleSubmit(e)
                                        }}
                                    >
                                        Delete
                                    </Button>
                                </Col>
                            </Row>
                            <Row className="mt-4">
                                <Col sm={10}>
                                    <p>Password: *********</p>
                                </Col>
                            </Row>
                        </Container>

                        : null
                }
            </Container>
        </>
    )
}
