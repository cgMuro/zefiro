import React, { useEffect, useContext } from 'react'
import { AuthContext } from '../../context/AuthState'
import {
    Modal,
    ModalBody,
    Button
} from 'reactstrap'
import { AlertContext } from '../../context/AlertState'

export default function LoadUser() {

    const { loadUser } = useContext(AuthContext)
    const { alertMsg, setAlertMsg } = useContext(AlertContext)

    useEffect(() => {
        loadUser();
    }, [])

    return (
        <>
            <Modal isOpen={alertMsg === 'Please login to access that page.' ? true : false}>
                <ModalBody>
                    <h5 className="text-center mb-4">{alertMsg}</h5>
                    <Button onClick={() => setAlertMsg('')} block>Close</Button>
                </ModalBody>
            </Modal>
        </>
    )
}