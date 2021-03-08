import React, { useContext, useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { UserContext } from '../providers/UserProvider'
import { auth } from '../firebase/config'
import SignedOutLinks from './SignedOutLinks'
import { firestore } from '../firebase/config';




const LoggedInLinks = () => {

    const currentUser = auth.currentUser

    const { setCurrentUser } = useContext(UserContext);
    const [userRole, setUserRole] = useState("");
    console.log(currentUser.uid)

    const history = useHistory()

    useEffect(() => {
        getUserRole();
    })

    const handleClick = async () => {
        await auth.signOut();
        setCurrentUser(null);
        history.push("/");
        window.location.reload();
    }

    const getUserRole = () => {
        firestore.collection('users').doc(currentUser.uid).get()
            .then(response => {
                setUserRole(response.data().role)
            })
    }

    console.log(userRole);


    return (
        <div>
            <ul>
                {/* <li><Link to="/profile">Profile</Link></li>
                <li><Link to="/recruiter">Recruiter</Link></li>
                <li><Link to="/assigncandidates">Assign</Link></li>
                <li><Link to="/candidates">Candidates</Link></li>
                <li><Link to="/interviewer">Interviewer</Link></li>
                <li><Link to="/candidatestatus">Status</Link></li>
                <li><Link to="/" onClick={handleClick}>Logout</Link></li> */}
                <li><Link to="/profile">Profile</Link></li>
                {userRole === "hr" ?
                    <li><Link to="/recruiter">Recruiter</Link></li>
                    : ""}
                {userRole === "hr" ?
                    <li><Link to="/assigncandidates">Assign</Link></li>
                    : ""}
                {userRole === "interviewer" ?
                    <li><Link to="/interviewer">Interviewer</Link></li>
                    : ""}
                {userRole === "candidate" ?
                    <li><Link to="/candidates">Candidates</Link></li>
                    : ""}
                <li><Link to="/candidatestatus">Status</Link></li>
                <li><Link to="/" onClick={handleClick}>Logout</Link></li>
            </ul>
        </div>
    )
}

export default LoggedInLinks
