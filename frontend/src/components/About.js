import React from 'react'
import {
    Container
} from 'reactstrap'

export default function About() {
    return (
        <Container className="my-5" id="about-container">
            <div className="mt-3 d-flex flex-column justify-content-center align-items-center">
                <p className="mx-5">
                    Hello we are Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolorem voluptas ducimus ea eaque commodi, voluptatum eum assumenda tempora magni recusandae libero incidunt autem blanditiis, est praesentium corporis tempore odit odio?
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam itaque doloribus nemo dolorum ad recusandae animi odit aspernatur quos, iure omnis tempora voluptatum. Corrupti non id natus earum iste praesentium.
                </p>
                <img src="https://images.pexels.com/photos/3808904/pexels-photo-3808904.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=1260" alt="about-us" className="img-fluid p-3 my-3 w-50"/>
                <p className="mx-5">
                    Our redaction:
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Omnis libero at sed? Odit id, facilis ex excepturi alias cumque voluptates molestiae iste illum vitae quidem, cum error tempora dolorum commodi!
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Omnis libero at sed? Odit id, facilis ex excepturi alias cumque voluptates molestiae iste illum vitae quidem, cum error tempora dolorum commodi!
                </p>
            </div>
        </Container>
    )
}