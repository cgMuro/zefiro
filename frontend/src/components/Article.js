import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Container, Table } from 'reactstrap'
import moment from 'moment'
import parse from 'html-react-parser'

export default function Article(props) {

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [img, setImg] = useState('');
    const [text, setText] = useState([]);
    const [author, setAuthor] = useState('');
    const [date, setDate] = useState('')

    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            const res = await axios.get(`/api/articles/${props.match.params.title}`)
            const article = res.data.article

            setTitle(article.title)
            setDescription(article.description)
            setImg(article.header_img)
            setText(article.text)
            setDate(article.created_at)
            setAuthor(article.author.name)

            setIsLoading(false)
        }

        fetchData()
    }, [])

    const saveText = (textArray) => {
        return textArray.map((block, index) => {
            switch (block.type) {
                case 'paragraph':
                    return <p className="my-3" key={block.data.text}>{parse(block.data.text)}</p>
                    break
                case 'header':
                    return <h2 className="my-4" key={block.data.text}>{parse(block.data.text)}</h2>
                    break
                case 'table':
                    return (
                        <Table hover bordered className="my-5" key={block.data.content + index}>
                            <tbody>
                                {block.data.content.map(row => (
                                    <tr key={row}>
                                        {row.map(column => (
                                            <td key={column}>{parse(column)}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )
                    break
                case 'list':
                    if (block.data.style === "ordered") {
                        return (
                            <ol className="my-4" key={index}>
                                {block.data.items.map(item => (
                                    <li className="my-1" key={item}>{parse(item)}</li>
                                ))}
                            </ol>
                        )
                    } else {
                        return (
                            <ul className="my-4" key={index}>
                                {block.data.items.map(item => (
                                    <li className="my-1" key={item}>{parse(item)}</li>
                                ))}
                            </ul>
                        )
                    }
                    break
                case 'code':
                    return (
                        <pre className="code" key={block.data.code}>
                            {block.data.code}
                        </pre>
                    )
                    break
                case 'linkTool':
                    return (
                        <div className="container-fluid my-5" key={block.data.link}>
                            <a href={block.data.link}>{block.data.link}</a>
                        </div>
                    )

                case 'quote':
                    return (
                        <blockquote className="blockquote" key={block.data.text}>
                            {parse(block.data.text)}
                        </blockquote>
                    )
                    break
                case 'checklist':
                    return (
                        <div className="my-4" key={block.data.items[0].text + index}>
                            {block.data.items.map((item, index) => (
                                <div className="my-1 round" key={item}>
                                    <input
                                        type="checkbox"
                                        id={index + '-' + item.text}
                                        className="checkbox mr-1"
                                        checked={item.checked ? true : false} />
                                    <label htmlFor={index + '-' + item.text}>{parse(item.text)}</label>
                                </div>
                            ))}
                        </div>
                    )
                    break
                case 'delimiter':
                    return (
                        <div className="my-5 text-center container-fluid" key={block.type + index}>
                            <strong className="delimiter">* * *</strong>
                        </div>
                    )
                    break
                case 'image':
                    return (
                        <Container style={{
                            width: block.data.stretched ? '140%' : 'null',
                            width: block.data.withBackground ? '60%' : 'null'
                        }} key={block.data.url}>
                            <img
                                src={block.data.url}
                                className={`img-fluid ${block.data.withBorder ? 'img-thumbnail' : null}`}
                                alt={block.data.caption}
                            />
                        </Container>
                    )
                default:
                    console.log('default')
            }
        })
    }

    return (
        <>
            {
                !isLoading
                    ? (
                        <Container className="mb-5" id="article-container">
                            <h1 className="text-center my-5">{title}</h1>
                            <p className="description">{description}</p>
                            <div className="my-2">
                                <p>
                                    <hr />
                                    <span className="mr-1">Written by: </span>
                                    <strong>{author}</strong>
                                    <br />
                                    <span>{moment(date).format('LL')}</span>
                                    <hr />
                                </p>
                            </div>
                            <img src={img} className="img-fluid w-100" />

                            {
                                text.length > 0
                                    ?
                                    saveText(text)
                                    : null
                            }

                            <hr className="my-5" />

                            {/* <div className="my-2">
                                <p>
                                    <hr />
                                    <span className="mr-1">Author of the article:</span>
                                    <br/>
                                    <strong>{author}</strong>
                                    <hr />
                                </p>
                            </div> */}
                        </Container >
                    )
                    : null
            }
        </>
    )
}