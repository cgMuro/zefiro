import React from 'react'
import { Button } from 'reactstrap'

export default function Banner() {
    return (
        <>
            <div className="d-flex mx-auto justify-content-center align-items-center" id="banner">
                <Button
                    href="#articles"
                    className="btn-outline-dark mt-5"
                >View Articles</Button>
            </div>
        </>
    )
}