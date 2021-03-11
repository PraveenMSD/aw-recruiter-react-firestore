import React, { useContext, useState } from 'react'
import { Navbar, Nav } from 'react-bootstrap'
import { UserContext } from '../providers/UserProvider'
import LoggedInLinks from './LoggedInLinks'
import SignedOutLinks from './SignedOutLinks'
import {auth} from '../firebase/config'


const Header = () => {

    // const [loading, setLoading] = useState(true)

    const currentUser = auth.currentUser
    


    // if(currentUser) {
    //     setLoading(false)
    // }   className="mr-auto navLinks"

    const links = currentUser ? <LoggedInLinks/> : <SignedOutLinks/>
    const userName = currentUser ? currentUser.email : "";
    const title = "Applicant Tracking"

    // if(loading) {
        return (
            <Navbar bg="light" variant="light">
            <Navbar.Brand href="#home">Awesome Recruiter</Navbar.Brand>
            <Nav className="mr-auto navLinks">
                {userName}
                {links}
            </Nav>
        </Navbar>
        )
    // }
}

export default Header