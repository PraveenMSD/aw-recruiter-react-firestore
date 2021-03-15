import React, { useContext, useState } from 'react'
import { Navbar, Nav } from 'react-bootstrap'
import { UserContext } from '../providers/UserProvider'
import LoggedInLinks from './LoggedInLinks'
import SignedOutLinks from './SignedOutLinks'
import { auth } from '../firebase/config'


const Header = () => {

    const currentUser = auth.currentUser


    const links = currentUser ? <LoggedInLinks /> : <SignedOutLinks />
    const userName = currentUser ? currentUser.email : "";
    const title = "Applicant Tracking"

    // if(loading) {
    return (
        <Navbar bg="light" expand="lg" variant="light">
            <Navbar.Brand href="#home">Awesome Recruiter</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto navLinks">
                    <Nav.Link >{links}</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
    // }
}

export default Header