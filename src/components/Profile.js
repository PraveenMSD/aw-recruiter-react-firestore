import React, { useEffect, useState } from 'react';
import { auth, firestore } from "../firebase/config";
import { Badge, Button, Card, Form, Navbar, Nav, Container, Row, Col } from "react-bootstrap";
import { FaUserAlt } from "react-icons/fa";
import { Ring } from 'react-spinners-css';


const Profile = () => {
	const [getUser, setgetUser] = useState({});
	const [name, setgetName] = useState([]);
	const [phone, setgetPhone] = useState([]);
	const [designation, setgetDesignation] = useState([]);
	const [organization, setgetOrganization] = useState([]);
	const [loading, setLoading] = useState(true)


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
						setgetUser({ ...userD })
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
		<div className="container">
			<div className="d-flex bd-highlight">
				<div class="p-2 flex-grow-1 bd-highlight p-3">
					<Card>
						<Card.Header>Update Profile</Card.Header>
						<Card.Body>
							<form className="form-horizontal" onSubmit={(e) => {
								handleSubmit(e, name, phone, designation, organization)
							}}>
								<div className="mb-3 d-flex">
									<label htmlFor="name-edit" className="col-sm-3 col-form-label">Name: </label>
									<div className="col-sm-9">
										<input onChange={handleChange} className="form-control" type="text" id="name-edit" name="name-edit" placeholder="Enter your name" defaultValue={getUser.name} />
									</div>
								</div>
								<div className="mb-3 d-flex">
									<label htmlFor="email-edit" className="col-sm-3 col-form-label">Email: </label>
									<div className="col-sm-9">
										<input className="form-control" type="email" id="email-edit" name="email-edit" placeholder="Enter your email" defaultValue={auth.currentUser?.email} readOnly />
									</div>
								</div>
								<div className="mb-3 d-flex">
									<label htmlFor="phone-edit" className="col-sm-3 col-form-label">Phone: </label>
									<div className="col-sm-9">
										<input onChange={handleChange} className="form-control" type="text" id="phone-edit" name="phone-edit" placeholder="Enter phone number" defaultValue={getUser.phone} />
									</div>
								</div>
								<div className="mb-3 d-flex">
									<label htmlFor="designation-edit" className="col-sm-3 col-form-label">Designation: </label>
									<div className="col-sm-9">
										<input onChange={handleChange} className="form-control" type="text" id="designation-edit" name="designation-edit" placeholder="Enter desigation" defaultValue={getUser.designation} />
									</div>
								</div>
								<div className="mb-3 d-flex">
									<label htmlFor="organization-edit" className="col-sm-3 col-form-label">Organization: </label>
									<div className="col-sm-9">
										<input onChange={handleChange} className="form-control" type="text" id="orgaization-edit" name="organization-edit" placeholder="Enter organization" defaultValue={getUser.organization} />
									</div>
								</div>
								<div className="form-group text-center float-right">
									<button className="btn btn-success" type="submit">Update</button>
								</div>
							</form>
						</Card.Body>
					</Card>
				</div>

				<div class="p-2 bd-highlight w-25 p-3">
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
				</div>
			</div>
		</div>
	) : (
		<span><Ring color="gray" size={100} /></span>
	)
}

export default Profile
