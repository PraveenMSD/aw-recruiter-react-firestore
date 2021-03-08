import React, { useContext, useState, useEffect } from 'react'
import { Button, ButtonToolbar, Modal } from 'react-bootstrap';
import { UserContext } from '../providers/UserProvider'
import { firestore } from '../firebase/config';
import ReactTable from "react-table-6";
import 'react-table-6/react-table.css';


const Recruiter = () => {
	const [show, setShow] = useState(false);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const [jobsDetails, setJobDetails] = useState([]);
	let [jobtitle, setJobTitle] = useState('');
	let [totalopenings, setTotalOpenings] = useState('');
	let [jobstatus, setJobStatus] = useState('');
	let [entrylevel, setEntryLevel] = useState('');
	const offersRef = firestore.collection('jobs');

	const handleSubmit = (e, jobtitle, totalopenings, jobstatus, entrylevel) => {
		e.preventDefault();
		if (jobtitle, totalopenings, jobstatus, entrylevel == "") {
			alert("Input fields cannot be empty")
		} else {
			firestore.collection('jobs')
				.doc()
				.set({ jobtitle, totalopenings, jobstatus, entrylevel })
				.then(() => handleClose()

				)
				.catch((err) => { console.log(err) })
		}
	}


	const handleChange = (e) => {
		if (e.target.id === 'jobtitle-create') {
			setJobTitle(e.target.value);
		} else if (e.target.id === 'totalopenings-create') {
			setTotalOpenings(parseInt(e.target.value));
		} else if (e.target.id === 'jobstatus-create') {
			setJobStatus(e.target.value);
		} else {
			setEntryLevel(e.target.value);
		}
	}

	useEffect(() => {
		(async () => {
			await firestore.collection('jobs').get()
				.then((snapshot) => {
					console.log(snapshot);
					var data = []
					snapshot.docs.map((doc) => {
						console.log(doc.id)

						var view = (
							<div className="text-center h-4"><button type='button' onClick={() => handleDelete(doc.id)}>
								&#10005;
						</button></div>
						)

						data.push({ ...doc.data(), id: doc.id, view })
						setJobDetails([...data]);

					});
				})
				.catch((err) => {
					console.log('Error getting documents', err);
				});
		})();
	}, []);
	console.log(jobsDetails)
	const handleDelete = id => {
		offersRef.doc(id)
			.delete()
	};


	const BootstrapModal = () => (
		<div>
			<Button className="addJobBtn" variant="primary" onClick={handleShow}>
				Add job
			</Button>
			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>New Job</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<form onSubmit={(e) => {
						handleSubmit(e, jobtitle, totalopenings, jobstatus, entrylevel)
						console.log('here')
					}}>
						<div className="form-group">
							<label htmlFor="jobtitle-create">Job Title</label>
							<input onChange={handleChange} className="form-control" type="text" id="jobtitle-create" name="jobtitle-create" placeholder="Enter Job Title" />
						</div>
						<div className="form-group">
							<label htmlFor="totalopenings-create">Total Openings</label>
							<input onChange={handleChange} className="form-control" type="number" id="totalopenings-create" name="totalopenings-create" placeholder="Enter Total Openings" />
						</div>
						<div className="form-group">
							<label htmlFor="jobstatus-create">Job Status</label>
							<input onChange={handleChange} className="form-control" type="text" id="jobstatus-create" name="jobstatus-create" placeholder="Enter Status" />
						</div>
						<div className="form-group">
							<label htmlFor="entrylevel-create">Entry Level</label>
							<input onChange={handleChange} className="form-control" type="text" id="entrylevel-create" name="entrylevel-create" placeholder="Enter entry Level" />
						</div>
						<div className="form-group text-center">
							<Button variant="secondary" onClick={handleClose}>
								Close
						</Button> &nbsp;
							<button className="btn btn-success" type="submit" onClick={useEffect}>Create</button>
						</div>
					</form>
				</Modal.Body>
			</Modal>
		</div>
	)


	const jobDetailsTablecolumns = [
		{
			Header: () => (
				<div className="text-center font-weight-bold">
					Job Title
				</div>
			),
			accessor: 'id',
			className: 'font',
			width: 250,
			show: false,
			Cell: row => <div className="text-center h-4">{row.value}</div>,
		},
		{
			Header: () => (
				<div className="text-center font-weight-bold">
					Job Title
				</div>
			),
			accessor: 'jobtitle',
			className: 'font',
			width: 250,
			Cell: row => <div className="text-center h-4">{row.value}</div>,
		},
		{
			Header: () => (
				<div className="text-center font-weight-bold">
					Total Openings
				</div>
			),
			accessor: 'totalopenings',
			className: 'font',
			width: 250,
			Cell: row => <div className="text-center h-6">{row.value}</div>,
		},
		{
			Header: () => (
				<div className="text-center font-weight-bold">
					Job Status
				</div>
			),
			accessor: 'jobstatus',
			className: 'px-4 py-3 text-sm',
			width: 250,
			Cell: row => <div className="text-center h-4">{row.value}</div>,
		},
		{
			Header: () => (
				<div className="text-center font-weight-bold">
					Entry Level
				</div>
			),
			accessor: 'entrylevel',
			filterable: false,
			width: 250,
			Cell: row => <div className="text-center h-4">{row.value}</div>,
		},
		{
			Header: () => (
				<div className="text-center font-weight-bold">
					Action
				</div>
			),
			accessor: 'view',
			filterable: false,
			width: 250,
			// Cell: row => {row.value}
		}
	];



	return (
		<>
			<h4 className="recruiterTitle font-weight-bold">Jobs</h4>
			{BootstrapModal()}
			{console.log(jobsDetails)}
			<div className="container text-center">
				<ReactTable
					data={jobsDetails}
					columns={jobDetailsTablecolumns}
					className='ReactTable'
					sortable={true}
					defaultPageSize={5}
				/>
			</div>

		</>
	);
}

// render(<Recruiter />);

export default Recruiter