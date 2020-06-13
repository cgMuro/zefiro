import React, { createContext, useContext } from 'react'
import axios from 'axios'
import { useHistory } from 'react-router-dom'
import { AuthContext } from './AuthState'
// import { ErrorContext } from './ErrorState'
import { ValidateContext } from './ValidateState'
import { DraftContext } from './DraftState'

export const ArticleContext = createContext()


export function ArticleProvider(props) {

    const { auth: { user }, tokenConfig } = useContext(AuthContext)
    // const { getErrors } = useContext(ErrorContext)
    const { validate, msg, setMsg } = useContext(ValidateContext)
    const { id, deleteDraft } = useContext(DraftContext)

    const history = useHistory()

    const createArticle = async (blocks) => {

        const { title, description, header_img, arrayOfBlocks } = validate(blocks)

        if (!title) {
            // Return error if header is missing
            console.log('Error no header')
            return setMsg('Plese add a header')

        }
        if (!header_img) {
            // return error if no cover image
            console.log('Error no cover image')
            return setMsg('Plese add a cover image')

        }
        if (!description) {
            // return error if no description
            console.log('Error no description')
            return setMsg('Plese add a description')
        }


        const newArticle = {
            title: title,
            text: arrayOfBlocks,
            description: description,
            header_img: header_img
        }
        try {
            await axios.post('http://localhost:5000/api/articles/add', newArticle, tokenConfig())
            setMsg('Article created')
            console.log('Created')
            deleteDraft(id)
            history.push(`/user/${user._id}`)
        } catch (error) {
            if(error.response.data === 'Duplicate key for title_url') {
                setMsg('An Article with this title already exists. Please change it.')
                console.log(error)
            } else {
                console.log(error)
            }
        }
    }

    const updateArticle = async (blocks, id) => {

        const { title, description, header_img, arrayOfBlocks } = validate(blocks)


        if (!title) {
            // Return error if header is missing
            console.log('Error no header')
            return setMsg('Plese add a header')

        }
        if (!header_img) {
            // return error if no cover image
            console.log('Error no cover image')
            return setMsg('Plese add a cover image')

        }
        if (!description) {
            // return error if no description
            console.log('Error no description')
            return setMsg('Plese add a description')
        }

        const updArticle = {
            title,
            text: arrayOfBlocks,
            description,
            header_img
        }

        try {
            setMsg('Article updated')
            await axios.put(`/api/articles/edit/${id}`, updArticle, tokenConfig())
            deleteDraft(id)
            history.push(`/user/${user._id}`)
        } catch (error) {
            console.log(`Error: ${error}`)
            setMsg('Something went wrong')
        }
    }

    const deleteArticle = async (id) => {
        try {
            setMsg('Article deleted successfully!')
            await axios.delete(`/api/articles/delete/${id}`, tokenConfig())
        } catch (error) {
            setMsg('Something went wrong.')
            console.log(error)
        }
    }

    return (
        <ArticleContext.Provider value={{ msg, setMsg, createArticle, updateArticle, deleteArticle }}>
            {props.children}
        </ArticleContext.Provider>
    )
}
