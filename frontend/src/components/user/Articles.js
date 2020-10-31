import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import { Link, useHistory } from 'react-router-dom'
import {
    Container,
    Row,
    Col,
    Button,
    Alert,
    Modal,
    ModalHeader,
    ModalBody
} from 'reactstrap'
import { ArticleContext } from '../../context/ArticleState'
import { AuthContext } from '../../context/AuthState'
import { DraftContext } from '../../context/DraftState'
import { AlertContext } from '../../context/AlertState'
import moment from 'moment'

export default function UserArticles(props) {

    const [articles, setArticles] = useState([])
    const [drafts, setDrafts] = useState([])
    const [id, setId] = useState('')
    const [type, setType] = useState('')

    const { tokenConfig, auth } = useContext(AuthContext)
    const { msg, setMsg, deleteArticle } = useContext(ArticleContext)
    const { deleteDraft } = useContext(DraftContext)
    const { setAlertMsg } = useContext(AlertContext)

    const history = useHistory()

    const fetchData = async () => {
        const res = await axios.get(`/api/articles/user/${props.match.params.id}`)
        setArticles(res.data.data)

        const res2 = await axios.get(`/api/drafts/user/${props.match.params.id}`, tokenConfig())
        setDrafts(res2.data.data)
    }

    useEffect(() => {
        setId('')
        setType('')
        setMsg('')
        fetchData()
    }, [])

    // Don't allow access if is unathorized
    useEffect(() => {
        if (auth.isAuthenticated === false) {
            setAlertMsg('Please login to access that page.')
            history.push('/')
        }
    }, [auth])

    const handleDeleteArticle = () => {
        deleteArticle(id)

        setArticles(prevstate => prevstate.filter(article => article._id !== id))

        setId('')
        setType('')

        setTimeout(() => {
            setMsg('')
            fetchData()
        }, 3000)
    }

    const handleDeleteDraft = () => {
        deleteDraft(id)

        setDrafts(prevstate => prevstate.filter(draft => draft._id !== id))

        setId('')
        setType('')

        setTimeout(() => {
            setMsg('')
            fetchData()
        }, 3000)
    }

    return (
        <>

            <Modal
                isOpen={id !== '' ? true : false}
                style={{ color: 'red' }}
            >
                <ModalHeader className="text-center font-weight-bold">
                    Are you sure you want to delete this {type}? The action is irreversible.
                </ModalHeader>
                <ModalBody>
                    <Button
                        color="danger"
                        outline
                        onClick={() => {
                            type === 'article' ? handleDeleteArticle() : handleDeleteDraft()
                            setTimeout(() => {
                                window.scrollTo(0, 0)
                            }, 500)
                        }}
                        block
                    >
                        Delete
                    </Button>
                    <Button
                        color="primary"
                        onClick={() => {
                            setId('')
                            setType('')
                        }}
                        block
                    >
                        Close
                    </Button>
                </ModalBody>
            </Modal>



            {
                msg !== ''
                    ?
                    <Alert
                        color={msg === "Something went wrong." ? 'danger' : 'success'}
                        style={{ width: '100%' }}
                        className="text-center"
                    >
                        {msg}
                    </Alert>
                    : null
            }
            <Container className="d-flex justify-content-center align-items-center flex-column" id="user-article-container">

                <h2 className="text-center mt-3 mb-5">Your Articles</h2>
                {
                    articles.map(article => (
                        <>
                            <Link to={`/article/${article.title_url}`} className="linkStyle">
                                <Row className="my-3">
                                    <Col sm={5} className="p-0">
                                        <img src={article.header_img} className="img-fluid" alt="" />
                                    </Col>
                                    <Col className="pb-2" sm={7}>
                                        <h1 className="text-center mt-2">{article.title}</h1>
                                        <p>{article.description}</p>
                                        <small className="mt-4 text-secondary">{moment(article.created_at).format('LL')}</small>
                                    </Col>
                                </Row>
                            </Link>
                            <Button color="info" block className="mt-2 mb-1">
                                <Link to={`/user/articles/edit/${article._id}`} className="linkStyle">
                                    <i className="fa fa-edit"></i> EDIT ARTICLE
                                    </Link>
                            </Button>
                            <Button
                                color="danger" block
                                className="mt-0 mb-5"
                                onClick={(e) => {
                                    setId(e.target.id)
                                    setType('article')
                                }}
                                id={article._id}
                            >
                                <i className="fa fa-trash"></i> DELETE ARTICLE
                            </Button>
                        </>
                    ))
                }
            </Container>

            {drafts.length > 0
                ?
                <Container className="d-flex justify-content-center align-items-center flex-column" id="user-draft-container">

                    <h2 className="text-center mt-3 mb-5">Your Drafts</h2>
                    {drafts.map(draft => (
                        <>
                            <Link to={`/user/drafts/${draft._id}`} className="linkStyle">
                                <Row className="my-3">
                                    <Col sm={5} className="p-0">
                                        <img src={draft.header_img} className="img-fluid" alt="" />
                                    </Col>
                                    <Col className="pb-2" sm={7}>
                                        <h1 className="text-center mt-2">{draft.title}</h1>
                                        <p>{draft.description}</p>
                                        <small className="mt-4 text-secondary">{moment(draft.created_at).format('LL')}</small>
                                    </Col>
                                </Row>
                            </Link>
                            <Button color="info" block className="mt-2 mb-1">
                                <Link to={`/user/drafts/edit/${draft._id}`} className="linkStyle">
                                    <i className="fa fa-edit"></i> EDIT DRAFT
                                    </Link>
                            </Button>
                            <Button
                                color="danger" block
                                className="mt-0 mb-5"
                                onClick={(e) => {
                                    setId(e.target.id)
                                    setType('draft')
                                }}
                                id={draft._id}
                            >
                                <i className="fa fa-trash"></i> DELETE DRAFT
                            </Button>
                        </>
                    ))
                    }
                </Container>
                : null}
        </>
    )
}