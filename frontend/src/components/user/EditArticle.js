import React, { useState, useEffect, useContext, useRef } from 'react'
import EditorJs from 'react-editor-js'
import { EDITOR_JS_TOOLS } from "../editor/tools";
import { Container, Button, Alert } from 'reactstrap'
import axios from 'axios'
import { ArticleContext } from '../../context/ArticleState'
import { useHistory } from 'react-router-dom';
import { DraftContext } from '../../context/DraftState';
import { AlertContext } from '../../context/AlertState';
import { AuthContext } from '../../context/AuthState';

export default function EditArticle(props) {

    const { msg, setMsg, updateArticle } = useContext(ArticleContext)
    const { createDraftFromArticle, updateDraft } = useContext(DraftContext)
    const [instanceEditor, setInstanceEditor] = useState('')
    const [blocksState, setBlocksState] = useState([])
    const { alertMsg, setAlertMsg } = useContext(AlertContext)
    const { auth, tokenConfig } = useContext(AuthContext)


    const refEditor = useRef('')

    const history = useHistory()

    useEffect(() => {
        setMsg('')

        const fetchArticle = async () => {
            const res = await axios.get(`/api/articles/edit/${props.match.params.id}`, tokenConfig())
            const article = res.data.data
            const text = article.text
            text.unshift(
                {
                    type: "header",
                    data: {
                        level: 1,
                        text: article.title
                    }
                },
                {
                    type: "paragraph",
                    data: {
                        text: article.description
                    }
                },
                {
                    type: "image",
                    data: {
                        url: article.header_img
                    }
                }
            )
            setBlocksState(text)
            createDraftFromArticle(article)
        }
        fetchArticle()
    }, [])

     // Don't allow access if is unathorized
     useEffect(() => {
        if (auth.isAuthenticated === false) {
            setAlertMsg('Please login to access that page.')
            console.log(alertMsg)
            history.push('/')
        }
    }, [auth])

    useEffect(() => {
        if (msg !== '' && msg !== 'Draft Updated') {
            window.scrollTo(0, 0)
        }
    }, [msg])

    const handleSubmit = async () => {
        const { blocks } = await instanceEditor.save()
        updateArticle(blocks, props.match.params.id)
    }

    const save = () => {
        setTimeout(async () => {
            if(refEditor.current.length > 0) {
                const { blocks } = await refEditor.current.save()
                updateDraft(blocks, props.match.params.id)
            }
        }, 3000)
    }


    return (
        <>
            {
                msg !== '' && msg !== 'Draft Updated'
                    ?
                    <Alert color="primary">
                       {msg}
                    </Alert>
                    :
                    null
            }
            {
                blocksState.length > 0
                    ?
                    <Container>
                        <EditorJs
                            instanceRef={instance => {
                                refEditor.current = instance
                                setInstanceEditor(instance)
                            }}
                            tools={EDITOR_JS_TOOLS}
                            data={{
                                time: 1556098174501,
                                blocks: blocksState,
                                version: "2.12.4"
                            }}
                            onChange={() => save()}
                        />
                        <hr />
                        <div className="text-center mt-5 mb-5">
                            <p>{msg !== '' ? 'Drafted Saved' : 'Saving...'}</p>
                            <Button
                                onClick={() => handleSubmit()}
                                block
                                className="w-75 mx-auto"
                                color="outline-primary"
                            >
                                Publish Updated Article
                            </Button>
                        </div>
                    </Container>
                    :
                    null
            }
        </>
    )
}