import React from 'react'
import { Button } from 'reactstrap'

export default function Banner() {
    return (
        <>
            <div className="d-flex mx-auto justify-content-center align-items-center" id="banner">
                <Button
                    href="#articles"
                    className="mt-5"
                    outline
                    color='dark'
                >View Articles</Button>
            </div>
        </>
    )
}