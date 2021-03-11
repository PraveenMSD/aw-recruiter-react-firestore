import React, { useEffect, useState } from 'react';
import { auth, firestore } from "../firebase/config";
import { Badge, Button, Card, Form, Navbar, Nav, Container, Row, Col } from "react-bootstrap";
import { FaUserAlt } from "react-icons/fa";


const Profile = () => {
	const [getUser, setgetUser] = useState({});
	const [name, setgetName] = useState([]);
	const [phone, setgetPhone] = useState([]);
	const [designation, setgetDesignation] = useState([]);
	const [organization, setgetOrganization] = useState([]);
	const [loading, setLoading] = useState(true)

	const Loadingscreen = () => {
		return !getUser ? true : false
	}

	useEffect(() => {
		getUserName();
	}, [])

	const getUserName = () => {
		var userD;
		const uid = auth.currentUser?.uid
		auth.onAuthStateChanged(function (user) {
			if (user) {
				firestore.collection("users")
					.doc(user.uid)
					.get()
					.then((document) => {
						userD = document.data()
						setgetUser({...userD})
						setLoading(false)
					})
			} else {
				// No user is signed in.
				console.log('else')
			}
		});

	}

	const handleSubmit = (e, name, phone, designation, organization) => {
		e.preventDefault();
		if (name, phone, designation, organization == "") {
			alert("Field values required")
		} else {
			firestore.collection('users')
				.doc(auth.currentUser?.uid)
				.update({ name, phone, designation, organization })
				.then(() => alert("Profile updated"))
				.catch((err) => { alert(err) })
		}
	}

	const handleChange = (e) => {
		if (e.target.id === 'name-edit') {
			setgetName(e.target.value);
		} else if (e.target.id === 'phone-edit') {
			setgetPhone(e.target.value);
		} else if (e.target.id === 'designation-edit') {
			setgetDesignation(e.target.value);
		} else if (e.target.id === 'orgaization-edit') {
			setgetOrganization(e.target.value);
		}
	}

	return !loading ? (
		<>
			<Container >
				<Row>
					<Col className="col-md-8">
						<Card>
							<Card.Header>Update Profile</Card.Header>
							<Card.Body>
								<form className="form-horizontal" onSubmit={(e) => {
									handleSubmit(e, name, phone, designation, organization)
								}}>
									<div className="form-group d-flex">
										<label htmlFor="name-edit flex-grow-1 col-sm-2">Name: </label>
										<input onChange={handleChange} className="form-control ml-5 col-sm-10" type="text" id="name-edit" name="name-edit" placeholder="Enter your name" defaultValue={getUser.name} />
									</div>
									<div className="form-group d-flex">
										<label htmlFor="email-edit col-sm-2">Email: </label>
										<input className="form-control ml-5 col-sm-10" type="number" id="email-edit" name="email-edit" placeholder="Enter your email" defaultValue={auth.currentUser?.email} />
									</div>
									<div className="form-group d-flex">
										<label htmlFor="phone-edit col-sm-2">Phone: </label>
										<input onChange={handleChange} className="form-control ml-5" type="text" id="phone-edit" name="phone-edit" placeholder="Enter phone number" defaultValue={getUser.phone} />
									</div>
									<div className="form-group d-flex justify-content-around">
										<label htmlFor="designation-edit col-sm-2">Designation: </label>
										<input onChange={handleChange} className="form-control ml-5" type="text" id="designation-edit" name="designation-edit" placeholder="Enter desigation" defaultValue={getUser.designation} />
									</div>
									<div className="form-group d-flex justify-content-around">
										<label htmlFor="organization-edit col-sm-2">Organization: </label>
										<input onChange={handleChange} className="form-control ml-5" type="text" id="orgaization-edit" name="organization-edit" placeholder="Enter organization" defaultValue={getUser.organization} />
									</div>
									<div className="form-group text-center float-right">
										<button className="btn btn-success" type="submit">Update</button>
									</div>
								</form>
							</Card.Body>
						</Card>
					</Col>
					<Col className="col-md-4">
						<Card>
							<Card.Header>Profile</Card.Header>
							<Card.Body>
								<FaUserAlt size="50px" className="col-md-12" />
								<Card.Text className="text-center mt-3"><strong>{getUser.name}</strong></Card.Text>
								<Card.Text className="text-center">{auth.currentUser?.email}</Card.Text>
								<Card.Text className="text-center">{getUser.designation}</Card.Text>
								<Card.Text className="text-center">{getUser.organization}</Card.Text>
							</Card.Body>
						</Card>
					</Col>
				</Row>
			</Container>
		</>
	) : (
		<span>Loading...</span>
	)
}

export default Profile
