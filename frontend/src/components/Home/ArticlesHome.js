import React, { useState, useEffect } from 'react'
import {
    Container,
    Row,
    Col
} from 'reactstrap'
import axios from 'axios'
import { Link } from 'react-router-dom'
import moment from 'moment'

export default function ArticlesHome() {

    const [articles, setArticles] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            const articles = await axios.get('/api/articles')
            setArticles(articles.data.data)
        }

        fetchData()
    }, [])

    const articlesPreview = (
        articles.map((article, index) => (
            <div key={article._id}>
                <Link to={`/article/${article.title_url}`} className="linkStyle">
                    <Row className="article-row my-5 mx-auto">
                        <Col sm={5} className="p-0 d-flex justify-content-center">
                            <img src={article.header_img} className="article-img img-fluid mx-auto" alt={`article-${index}`} />
                        </Col>
                        <Col sm={7}>
                            <p className="article-date mb-0 mt-3">{moment(article.created_at).format('LL')}</p>
                            <p className="article-author font-weight-bold mb-1">{article.author.name}</p>
                            <h1 className="mt-0 mb-4">{article.title}</h1>
                            <p className="article-description mt-4">{article.description}</p>
                        </Col>
                    </Row>
                </Link>
                <hr/>
            </div>
        ))
    )


    return (
        <Container className="my-5 pt-3" id="articles">
            {articlesPreview}
        </Container>
    )
}