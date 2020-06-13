import React, { createContext, useState } from 'react'

export const ValidateContext = createContext()

export function ValidateProvider(props) {

    const [msg, setMsg] = useState('')

    const validate = (blocks) => {

        let index;

        let title = blocks.find((b, i) => {
            index = i;
            return b.data.level === 1
        })
        if(title) { title = title.data.text }
        blocks.splice(index, 1)

        let header_img = blocks.find((b, i) => {
            index = i;
            return b.type === 'image'
        })
        if(header_img) {  header_img = header_img.data.url }
        blocks.splice(index, 1)

        let description = blocks.find((b, i) => {
            index = i;
            return b.type === 'paragraph'
        })
        if(description) { description = description.data.text }
        blocks.splice(index, 1)

        let arrayOfBlocks = [];

        blocks.forEach(block => {
            arrayOfBlocks.push(block)
        });

        return { 
            title: title !== '' ? title : '', 
            description: description !== '' ? description: '', 
            header_img: header_img !== '' ? header_img : '', 
            arrayOfBlocks 
        }
    }

    return (
        <ValidateContext.Provider value={{ validate, msg, setMsg }}>
            {props.children}
        </ValidateContext.Provider>
    )
}