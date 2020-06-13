import React, { createContext, useContext, useState } from 'react'
import axios from 'axios'
import { AuthContext } from './AuthState'
// import { ErrorContext } from './ErrorState'
import { ValidateContext } from './ValidateState'

export const DraftContext = createContext()


export function DraftProvider(props) {

    const { auth: { user }, tokenConfig } = useContext(AuthContext)
    // const { getErrors } = useContext(ErrorContext)
    const { validate, msg, setMsg } = useContext(ValidateContext)


    const [id, setId] = useState('')

    const getDrafts = async() => {
        const drafts = await axios.get(`/api/drafts/user/${user._id}`, tokenConfig())
        return drafts.data.data.length
    }

    const getDraft = async (id) => {
        const res = await axios.get(`/api/drafts/${id}`, tokenConfig())
        const data = res.data.data
        const blocks = data.blocks[0] !== '' ? data.blocks : []
        blocks.unshift(
            {
                type: "header",
                data: {
                    level: 1,
                    text: data.title
                }
            },
            {
                type: "paragraph",
                data: {
                    text: data.description
                }
            },
            {
                type: "image",
                data: {
                    url: data.header_img
                }
            }
        )
        console.log(blocks)
        return blocks
    }

    const createDraft = async () => {
        setId('')

        const numberOfDrafts = await getDrafts()

        const newDraft = {
            title: `Draft ${numberOfDrafts + 1}`,
            text: '',
            description: '',
            header_img: 'https://images.pexels.com/photos/1906667/pexels-photo-1906667.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260.jpg'
        }

        try {
            const res = await axios.post('/api/drafts', newDraft, tokenConfig())
            console.log('Draft Created')
            setMsg('Draft Created')
            setId(res.data.created_draft._id)
        } catch (error) {
            console.log(`Error: ${error}`)
        }
    }

    const createDraftFromArticle = async (article) => {
        const newDraft = article

        try {
            await axios.post('/api/drafts', newDraft, tokenConfig())
            console.log('Draft Created')
            setMsg('Draft Created')
        } catch (error) {
            console.log(`Error: ${error}`)
        }
    }


    const updateDraft = async (blocks, id) => {

        setMsg('')

        const { title, description, header_img, arrayOfBlocks } = validate(blocks)

        const updDraft = {
            title,
            text: arrayOfBlocks,
            description,
            header_img: header_img === '' ? 'https://images.pexels.com/photos/1906667/pexels-photo-1906667.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260.jpg' : header_img
        }

        try {
            await axios.put(`/api/drafts/${id}`, updDraft, tokenConfig())
            console.log('Draft Updated')
            setMsg('Draft Updated')
        } catch (error) {
            console.log(`Error: ${error}`)
        }
    }

    const deleteDraft = async (id) => {
        try {
            await axios.delete(`/api/drafts/${id}`, tokenConfig())
            if(msg !== 'Article created' || msg === '') {
                setMsg('Draft deleted successfully!')
            }
        } catch (error) {
            console.log(error)
            setMsg('Something went wrong.')
        }
    }

    return (
        <DraftContext.Provider value={{ id, getDraft, createDraft, createDraftFromArticle, updateDraft, deleteDraft }}>
            {props.children}
        </DraftContext.Provider>
    )
}