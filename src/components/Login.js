import React, { useContext, useState } from 'react'
import { UserContext } from '../providers/UserProvider'
import { auth, firestore } from '../firebase/config'
import { Link, useHistory } from 'react-router-dom'



const Login = () => {

	const { currentUser, setCurrentUser } = useContext(UserContext);
	const history = useHistory();
	var userRole;

	let [email, setEmail] = useState('');
	let [password, setPassword] = useState('');

	const handleSubmit = (e, email, password) => {
		e.preventDefault();

		auth.signInWithEmailAndPassword(email, password)
			.then(userAuth => {
				history.push('/profile')
				// firestore.collection('users')
				// 	.doc(userAuth.user.uid)
				// 	.get()
				// 	.then(user => {
				// 		setCurrentUser({
				// 			...currentUser,
				// 			name: user.data().name,
				// 			userRole: user.data().role,
				// 		})
				// 		userRole = user.data().role
				// 		console.log(userRole)
				// 		if (user.data().role === "admin") {
				// 			history.push("/admin");
				// 			//console.log("Welcome admin")
				// 			//return <Redirect to="/admin" />

				// 		} else if (user.data().role === "hr") {
				// 			history.push("/recruiter");
				// 			console.log("Not authorized")
				// 		} else if (user.data().role === "interviewer") {
				// 			history.push("/interviewer");
				// 			console.log("Not authorized")
				// 		} else if (user.data().role === "candidate") {
				// 			history.push("/candidates");
				// 			console.log("Not authorized")
				// 		} else {
				// 			history.push("/")
				// 		}
				// 	})
			})

	}

	const handleChange = (e) => {
		if (e.target.id === 'email-login') {
			email = e.target.value;
		} else {
			password = e.target.value
		}
	}

	console.log(userRole);
	return (
		<div className="loginsignup-form">
			<h1 className="text-center">Log in</h1>
			<form onSubmit={(e) => handleSubmit(e, email, password)}>
				<div className="form-group">
					<label htmlFor="email-login">Email:</label>
					<input onChange={handleChange} className="form-control" type="email" name="email-login" id="email-login" placeholder="Enter Your Email" />
				</div>
				<div className="form-group">
					<label htmlFor="password-login">Password:</label>
					<input onChange={handleChange} className="form-control" type="password" name="password-login" id="password-login" placeholder="Enter Your Password" />
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
