import React, { useState, useContext, useEffect, useRef } from 'react'
import EditorJs from 'react-editor-js'
import { Container, Button } from 'reactstrap'
import { EDITOR_JS_TOOLS } from "./tools";
import { ArticleContext } from '../../context/ArticleState'
import { DraftContext } from '../../context/DraftState'
import { useHistory } from 'react-router-dom';


export default function Editor(props) {

    const [instanceEditor, setInstanceEditor] = useState('')
    const refEditor = useRef('')

    const { msg, createArticle } = useContext(ArticleContext)

    const { id, updateDraft } = useContext(DraftContext)
    const refId = useRef('')

    
    const history = useHistory()
    
    useEffect(() => {
        refId.current = id
    }, [id])
    

    const handleSubmit = async () => {
        const { blocks } = await instanceEditor.save()
        createArticle(blocks)
    }

    const saveDraft = async () => {
        const { blocks } = await instanceEditor.save()
        updateDraft(blocks, id)
    }

    const save = () => {
        setTimeout(async () => {
            if(refEditor.current.length > 0) {
                console.log(refEditor.current)
                const { blocks } = await refEditor.current.save()
                updateDraft(blocks, refId.current)
            }
        }, 3000)
    }

    return (
        <Container>
            <EditorJs
                instanceRef={instance => {
                    refEditor.current = instance
                    setInstanceEditor(instance)
                }}
                tools={EDITOR_JS_TOOLS}
                data={{
                    time: 1556098174501,
                    blocks: [
                        {
                            type: "header",
                            data: {
                                level: 1,
                            }
                        },
                        {
                            type: "paragraph",
                            data: {
                                text: ''
                            }
                        },
                        {
                            type: "paragraph",
                            data: {
                                text: 'Remember that:'
                            }
                        },
                        {
                            type: "list",
                            data: {
                                style: 'unordered',
                                items: [
                                    'a title is mandatory and you may add it above',
                                    'the first paragraph you write is going to be also set as a description tpo the article, will be showed in the preview page, and moved between the title and the cover image',
                                    'at least one image is required, because the first image you will load is going to be set as the cover imagof the article. (It\'s also important that you put ".jpg" at the end of the URL you paste in for the image)',
                                    'after publishing your article will be structured like this: Title, Brief description/introduction, Cover image, Article.'
                                ]
                            }
                        }
                    ],
                    version: "2.12.4"
                }}
                onChange={() => save()}
            />
            <hr />
            <div className="text-center mt-5 mb-2">
                <p>{msg !== '' ? 'Drafted Saved' : 'Saving...'}</p>
                <Button
                    onClick={() => {
                        saveDraft()
                        history.push(`/user/${props.id}`)
                    }}
                    block
                    className="w-75 mx-auto"
                    color="outline-info"
                >
                    Save Draft
                </Button>
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
    )
}
