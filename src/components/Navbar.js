import React, { useContext } from 'react'
import { Navbar, Nav } from 'react-bootstrap'
import { UserContext } from '../providers/UserProvider'
import LoggedInLinks from './LoggedInLinks'
import SignedOutLinks from './SignedOutLinks'


const Header = () => {

    const {currentUser} = useContext(UserContext);
    const links = currentUser? <LoggedInLinks/>: <SignedOutLinks/>;
    const userName = currentUser? currentUser.name : "";
    const title = "Applicant Tracking"

    return (
        <Navbar bg="light" variant="light">
        <Navbar.Brand href="#home">Awesome Recruiter</Navbar.Brand>
        <Nav className="mr-auto navLinks">
            {userName}
            {links}
        </Nav>
      </Navbar>
    )
}

export default Header