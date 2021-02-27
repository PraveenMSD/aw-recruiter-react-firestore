import React, { useContext, useState } from 'react'
import { UserContext } from '../providers/UserProvider'
import { auth, firestore } from '../firebase/config'
import { Link, Redirect } from 'react-router-dom'


const Login = () => {

    const { setCurrentUser } = useContext(UserContext);

    let [email, setEmail] = useState('');
    let [password, setPassword] = useState('');

    const handleSubmit = (e, email, password) => {
        e.preventDefault();
        auth.signInWithEmailAndPassword(email, password).then(userAuth => {
            firestore.collection('users').doc(userAuth.user.uid).get().then(user => {
                setCurrentUser({
                    name: user.data().name,
                    email: userAuth.user.email,
                })
								if (user.data().role === "admin"){
									<Link to="/login" />
									console.log("Welcome admin")
									return <Redirect to="/admin" />

								} else {
									console.log("Not authorized")
								}
            })
        })

    }

    const handleChange = (e) => {
        if (e.target.id === 'email-login'){
            email = e.target.value;
        } else {
            password = e.target.value
        }
    }


    return (
        <div className="loginsignup-form">
            <h1 className="text-center">Log in</h1>
            <form onSubmit={(e) => handleSubmit(e, email, password)}>
							<div className="form-group">
                <label htmlFor="email-login">Email:</label>
                <input onChange={handleChange} className="form-control" type="email" name="email-login" id="email-login" placeholder="Enter Your Email"/>
              </div>
							<div className="form-group">
								<label htmlFor="password-login">Password:</label>
                <input onChange={handleChange} className="form-control" type="password" name="password-login" id="password-login" placeholder="Enter Your Password"/>
              </div>
							<div className="form-group">
								<button className="btn btn-primary">Login</button>
							</div>
							<div className="form-group">
								<h6>No account?
									<Link to="/signup"> Create one</Link>
								</h6>
        			</div>
            </form>
        </div>
    )
}

export default Login
