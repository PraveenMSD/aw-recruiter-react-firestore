import React, { useContext, useState, useEffect } from 'react'
import { auth, firestore } from '../firebase/config';
import ReactTable from "react-table-6";
import 'react-table-6/react-table.css';
import { UserContext } from '../providers/UserProvider'
import { Bar } from 'react-chartjs-2';
import { getUserRole } from "../firebase/functions";
import { Redirect } from 'react-router';
import { ToastContainer, toast } from 'react-toastify';
import { Card, Row, Col } from "react-bootstrap";
import { FcBullish, BsFillHeartFill } from "react-icons/all";

const Candidates = () => {
	const [JobTitle, setJobTitle] = useState('');
	const [jobs, setJobs] = useState([]);
	const [jobAssignTitle, setAssignJobTitle] = useState('');
	const [role, getRole] = useState('');
	const currentLoggedUser = auth.currentUser;
	const { currentUser } = useContext(UserContext);
	var userEmail = currentLoggedUser?.email || '';
	const applynotify = () => toast.success("Applied successfully");
	const [totalJobs, setTotalJob] = useState(0);

	useEffect(() => {
		getUserRole()
		getJobsForCandidates()
	}, []);

	const getJobsForCandidates = () => {
		firestore.collection('jobs').get()
			.then(response => {
				const fetchedJobs = [];
				response.docs.forEach(document => {
					const fetchedJob = {
						id: document.id,
						jobAssignTitle: document.data().jobtitle,
						openings: document.data().totalopenings,
						status: document.data().jobstatus,
						level: document.data().entrylevel,
						appliedemails: document.data().appliedemails,
						apply: (
							// (emBool === true && jbBool === true) ?
							(document.data().appliedemails === currentLoggedUser?.email) ? "Applied" : <button className="btn btn-success" id={document.data().jobtitle} onClick={(e) => handleSubmit(e, userEmail, document.data().jobtitle, document.id, document.data().totalopenings, document.data().appliedemails)}>Apply</button>
						),
					};
					setTotalJob(prevState => prevState + parseInt(document.data().totalopenings))
					fetchedJobs.push(fetchedJob);
				});
				setJobs(fetchedJobs.filter(open => open.openings > 0));
			})
	}
	console.log(totalJobs)

	const getUserRole = () => {
		auth.onAuthStateChanged(function (user) {
			if (user) {
				firestore.collection("users")
					.doc(user.uid)
					.get()
					.then((document) => {
						getRole(document.data().role)
					})
			}
		})
	}


	const decrementJobOpeningOnApply = (jobId, openingss, userEmail) => {
		firestore.collection('jobs')
			.doc(jobId)
			.update({ totalopenings: parseInt(openingss - 1), appliedemails: userEmail })
	}

	const handleSubmit = (e, userEmail, jobAssignTitle, jobId, openingss) => {
		e.preventDefault();
		document.getElementById(jobAssignTitle).disabled = true;

		decrementJobOpeningOnApply(jobId, openingss, userEmail);

		firestore.collection('candidates')
			.doc()
			.set({ userEmail, jobAssignTitle })
			.catch((err) => { console.log(err) })
		applynotify();
	}

	const handleChange = async (e) => {
		setAssignJobTitle(e.target.value);
	}

	// Bar chart

	const data = {
		labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
		datasets: [
			{
				label: 'My First dataset',
				backgroundColor: 'rgba(255,99,132,0.2)',
				borderColor: 'rgba(255,99,132,1)',
				borderWidth: 1,
				hoverBackgroundColor: 'rgba(255,99,132,0.4)',
				hoverBorderColor: 'rgba(255,99,132,1)',
				data: [65, 59, 80, 81, 56, 55, 40]
			}
		]
	};


	const jobDetailsTablecolumns = [
		{
			Header: () => (
				<div className="text-center font-weight-bold">
					Job Title
				</div>
			),
			accessor: 'jobAssignTitle',
			className: 'font',
			width: 140,
			Cell: row => <div className="text-center h-4">{row.value}</div>,
		},
		{
			Header: () => (
				<div className="text-center font-weight-bold">
					Total Openings
				</div>
			),
			accessor: 'openings',
			className: 'font',
			width: 140,
			Cell: row => <div className="text-center h-6">{row.value}</div>,
		},
		{
			Header: () => (
				<div className="text-center font-weight-bold">
					Job Status
				</div>
			),
			accessor: 'status',
			className: 'px-4 py-3 text-sm',
			width: 140,
			Cell: row => <div className="text-center h-4">{row.value}</div>,
		},
		{
			Header: () => (
				<div className="text-center font-weight-bold">
					Entry Level
				</div>
			),
			accessor: 'level',
			filterable: false,
			width: 250,
			Cell: row => <div className="text-center h-4">{row.value}</div>,
		},
		{
			Header: () => (
				<div className="text-center font-weight-bold">
					Apply
				</div>
			),
			accessor: 'apply',
			filterable: false,
			width: 100,
		}
	];

	return (
		<div>
			<div className="container">
				<Row>
					<Col>
						<Card className="card-statss">
							<Card.Body>
								<Row>
									<Col xs="5">
										<div className="icon-big text-center icon-warning">
											<FcBullish size={70} />
										</div>
									</Col>
									<Col xs="7">
										<div className="numbers">
											<p></p>
											<Card.Title as="h4">{totalJobs}</Card.Title>
										</div>
									</Col>
								</Row>
							</Card.Body>
							<Card.Footer>
								<div className="stats">
									<i className="fas fa-redo mr-1"></i>
                  					Total Job openings
                			</div>
							</Card.Footer>
						</Card>
						<Card className="mt-4">
							<Card.Body>
								<Row>
									<Col xs="5">
										<div className="icon-big text-center icon-warning">
											<BsFillHeartFill size={70} />
										</div>
									</Col>
									<Col xs="7">
										<div className="numbers">
											<p></p>
											<Card.Title as="h4">10K+</Card.Title>
										</div>
									</Col>
								</Row>
							</Card.Body>
							<Card.Footer>
								<div className="stats">
									<i className="fas fa-redo mr-1"></i>
                  					Satisfied clients
                			</div>
							</Card.Footer>
						</Card>
					</Col>
					<Col >
						<ReactTable
							data={jobs}
							columns={jobDetailsTablecolumns}
							className='candidateReactTable'
							sortable={true}
							defaultPageSize={5}
							resizable={false}
						/>
					</Col>
				</Row>
			</div>
			<ToastContainer />
		</div>
	)
}

export default Candidates