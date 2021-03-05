import React, { useContext } from 'react'
import { auth } from '../firebase/config';
import { UserContext } from '../providers/UserProvider'


const Profile = () => {

    const currentUser = auth.currentUser
    const userMsg = currentUser ? `${currentUser.email} ,Welcome back` : `No user is logged in`;

    return (
        <div class="jumbotron">
            <h1 class="display-4">Hello, {currentUser.email}</h1>
            <p class="lead">This is a simple ATS developed using React and Firebase.</p>
            <hr class="my-4" />
            <ul>
                <li>HR - Can access all pages.</li>
                <li>Interviewer- Can access only "Interviewer" page.</li>
                <li>Candidates - Can access only "Candidates & Status" page.</li>
            </ul>
        </div>
    )
}

export default Profile;