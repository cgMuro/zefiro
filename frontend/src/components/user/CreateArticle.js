import React, { useContext, useEffect } from 'react'
import Editor from '../editor/Editor'
import { ArticleContext } from '../../context/ArticleState'
import { DraftContext } from '../../context/DraftState'
import { Alert } from 'reactstrap'
import { AlertContext } from '../../context/AlertState'
import { AuthContext } from '../../context/AuthState'
import { useHistory } from 'react-router-dom'

export default function UserCreateArticle({ match: { params } }) {

    const { msg, setMsg } = useContext(ArticleContext)
    const { createDraft } = useContext(DraftContext)
    const { setAlertMsg } = useContext(AlertContext)
    const { auth } = useContext(AuthContext)

    const history = useHistory()

    useEffect(() => {
        setMsg('')
        createDraft()
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
                msg !== '' && msg !== 'Draft Updated' && msg !== 'Draft Created'
                    ?
                    <Alert color="danger">
                        {msg}
                    </Alert>
                    : null
            }
            <Editor id={params.id} />
        </>
    )
}