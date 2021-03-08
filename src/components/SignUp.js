import React, { useContext, useState } from 'react'
import { UserContext } from '../providers/UserProvider'
import { auth, firestore } from '../firebase/config'
import { Link } from 'react-router-dom'

const SignUp = () => {

    const { setCurrentUser } = useContext(UserContext);

    let [name, setName] = useState('');
    let [email, setEmail] = useState('');
    let [password, setPassword] = useState('');


    const handleSubmit = (e, name, email, password) => {
        e.preventDefault();
        auth.createUserWithEmailAndPassword(email, password).then(userAuth => {
            firestore.collection('users').doc(userAuth.user.uid).set({name})
                .then(() => {
                    setCurrentUser({name, email})
                })
        })
    }

    const handleChange = (e) => {
        if(e.target.id === 'name-sign-up'){
            name = e.target.value;
        } else if (e.target.id === 'email-sign-up'){
            email = e.target.value;
        } else {
            password = e.target.value
        }
    }

    return (
			<div className="component">
				<div className="loginsignup-form">
				<h1 className="text-center">Sign up</h1>
						<form onSubmit={(e) => handleSubmit(e, name, email, password)}>
							<div className="form-group">
											<label htmlFor="name-sign-up">Name</label>
											<input onChange={handleChange} className="form-control" type="text" id="name-sign-up" name="name-sign-up" placeholder="Enter Your Name"/>
							</div>
							<div className="form-group">     
											<label htmlFor="email-sign-up">Email</label>
											<input onChange={handleChange} className="form-control" type="email" id="email-sign-up" name="email-sign-up" placeholder="Enter Your Email"/>
							</div>   
							<div className="form-group">     
											<label htmlFor="password-sign-up">Password</label>
											<input onChange={handleChange} className="form-control" type="password" id="password-sign-up" name="password-sign-up" placeholder="Enter Your Password"/>
							</div>
							<div className="form-group">     
											<button className="btn btn-success">Sign up</button>
							</div>
							<div className="form-group">
								<h6>Already have account?
									<Link to="/"> Sign in</Link>
								</h6>
							</div>
						</form>
				</div>
			</div>
    )
}

export default SignUp
