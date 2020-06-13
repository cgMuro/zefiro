import React, { useEffect, useContext, useRef } from 'react'
import { AuthContext } from '../../context/AuthState'
import { ArticleContext } from '../../context/ArticleState'
import {
    Container,
    Row,
    Alert
} from 'reactstrap'
import { Link, useHistory } from 'react-router-dom'
import { AlertContext } from '../../context/AlertState'

export default function User(props) {

    const { auth: { user }, auth } = useContext(AuthContext)
    const { msg, setMsg } = useContext(ArticleContext)
    const { setAlertMsg } = useContext(AlertContext)
    const authenticatedRef = useRef()
    const history = useHistory()

    useEffect(() => {
        authenticatedRef.current = auth.isAuthenticated
        setAlertMsg('')
        setTimeout(() => {
            setMsg('')
        }, 3000)
    }, [])

    // Don't allow access if is unathorized
    useEffect(() => {
        if (auth.isAuthenticated === false) {
            setAlertMsg('Please login to access that page.')
            history.push('/')
        }
    }, [auth])

    return (
        <>
            {
                msg !== '' && msg !== 'Something went wrong' && msg !== 'Draft Created'
                    ?
                    <Alert color="success">
                        {msg}
                    </Alert>
                    :
                    null
            }
            <Link to={`/user/${props.match.params.id}/settings`} className="linkStyle">
                <span id="user-settings"><i className="fa fa-cog fa-lg"></i></span>
            </Link>
            <Container className="d-flex justify-content-center align-items-center flex-column" style={{ height: '80vh' }} id="user-page-container">
                <h2 className="text-center mb-3">Welcome <span style={{ fontWeight: 'bold' }}>{user ? user.name : null}</span></h2>
                <Link to={`/user/${props.match.params.id}/articles`} className="linkStyle">
                    <Row className="mb-2 user-row text-center">
                        <h5>SEE YOUR ARTICLES</h5>
                    </Row>
                </Link>
                <Link to={`/user/${props.match.params.id}/create-article`} className="linkStyle">
                    <Row className="user-row text-center">
                        <h5>CREATE NEW ARTICLE</h5>
                    </Row>
                </Link>
            </Container>
        </>
    )
}