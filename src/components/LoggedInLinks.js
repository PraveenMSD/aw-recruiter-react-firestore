import React, { useContext, } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { UserContext } from '../providers/UserProvider'
import { auth } from '../firebase/config'
import SignedOutLinks from './SignedOutLinks'



const LoggedInLinks = () => {



    const { setCurrentUser } = useContext(UserContext);
    console.log(setCurrentUser.role)

    const history = useHistory()

    const handleClick = async () => {
        await auth.signOut();
        setCurrentUser(null);
        history.push("/");
        window.location.reload();
    }

    return (
        <div>
            <ul>
                <li><Link to="/profile">Profile</Link></li>
                <li><Link to="/recruiter">Recruiter</Link></li>
                <li><Link to="/assigncandidates">Assign</Link></li>
                <li><Link to="/candidates">Candidates</Link></li>
                <li><Link to="/interviewer">Interviewer</Link></li>
                <li><Link to="/candidatestatus">Status</Link></li>
                <li><Link to="/" onClick={handleClick}>Logout</Link></li>
            </ul>
        </div>
    )
}

export default LoggedInLinks
