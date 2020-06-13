import React, { useState, useEffect, useContext, useRef } from 'react'
import EditorJs from 'react-editor-js'
import { EDITOR_JS_TOOLS } from "./editor/tools";
import { Container, Button, Alert } from 'reactstrap'
import axios from 'axios'
import { DraftContext } from './../context/DraftState'
import { AuthContext } from '../context/AuthState';
import { ArticleContext } from '../context/ArticleState';

export default function EditDraft(props) {

    const { updateDraft } = useContext(DraftContext)
    const { msg, setMsg, createArticle } = useContext(ArticleContext)
    const { tokenConfig } = useContext(AuthContext)
    const [instanceEditor, setInstanceEditor] = useState('')
    const [blocksState, setBlocksState] = useState([])

    const refEditor = useRef('')

    useEffect(() => {
        const fetchDraft = async () => {
            const res = await axios.get(`/api/drafts/${props.match.params.id}`, tokenConfig())
            const draft = res.data.draft
            const text = draft.text[0] !== '' ? draft.text : []
            text.unshift(
                {
                    type: "header",
                    data: {
                        level: 1,
                        text: draft.title
                    }
                },
                {
                    type: "paragraph",
                    data: {
                        text: draft.description
                    }
                },
                {
                    type: "image",
                    data: {
                        url: draft.header_img
                    }
                }
            )
            setBlocksState(text)
        }
        fetchDraft()
        setMsg('')
    }, [])


    useEffect(() => {
        if (msg !== '' && msg !== 'Draft Updated') {
            window.scrollTo(0, 0)
        }
    }, [msg])


    const handleSubmit = async () => {
        const { blocks } = await instanceEditor.save()
        createArticle(blocks)
    }

    const save = () => {
        setTimeout(async () => {
            if(refEditor.current.length > 0) {
                const { blocks } = await refEditor.current.save()
                updateDraft(blocks, props.match.params.id)
            }
        }, 5000)
    }


    return (
        <>
            {
                msg !== '' && msg !== 'Draft Updated'
                    ?
                    <Alert color="danger">
                        {msg}
                    </Alert>
                    : null
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
                                Publish
                            </Button>
                        </div>
                    </Container>
                    :
                    null
            }
        </>
    )
}

// const goBackLink = {
//     cursor: 'pointer',
//     textDecoration: 'underline',
//     color: 'blu',
//     focus: true
// }