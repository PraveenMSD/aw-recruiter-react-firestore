import React, { useContext, useState, useEffect } from 'react'
import { Button, ButtonToolbar, Modal } from 'react-bootstrap';
import { UserContext } from '../providers/UserProvider'
import { firestore } from '../firebase/config';
import ReactTable from "react-table-6";
import 'react-table-6/react-table.css';
import { ToastContainer, toast } from 'react-toastify';
import { Ring } from 'react-spinners-css';


const Recruiter = () => {
	const [show, setShow] = useState(false);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const [jobsDetails, setJobDetails] = useState([]);
	let [jobtitle, setJobTitle] = useState('');
	let [totalopenings, setTotalOpenings] = useState('');
	let [jobstatus, setJobStatus] = useState('');
	let [entrylevel, setEntryLevel] = useState('');
	const [loading, setLoading] = useState(true)
	const offersRef = firestore.collection('jobs');

	const handleSubmit = (e, jobtitle, totalopenings, jobstatus, entrylevel) => {
		e.preventDefault();
		if (jobtitle === "") {
			toast.error("Job title cannot be empty")
		} else if (totalopenings === "") {
			toast.error("Total openings cannot be empty")
		} else if (jobstatus === "") {
			toast.error("Please choose job status")
		} else if (entrylevel === "") {
			toast.error("Please choose entry level")
		} else {
			firestore.collection('jobs')
				.doc()
				.set({ jobtitle, totalopenings, jobstatus, entrylevel })
				.then(() => handleClose()
				)
				.catch((err) => { console.log(err) })
			toast.success("Jobs added successfully");
		}
	}


	const handleChange = (e) => {
		if (e.target.id === 'jobtitle-create') {
			setJobTitle(e.target.value);
		} else if (e.target.id === 'totalopenings-create') {
			setTotalOpenings(parseInt(e.target.value));
		} else if (e.target.id === 'entrylevel-create') {
			setEntryLevel(e.target.value);
			setJobStatus("Active")
		}
	}

	useEffect(() => {
		firestore.collection('jobs')
			.onSnapshot((querySnapshot) => {
				var data = []
				querySnapshot.docs.map(doc => {
					var view = (
						<div className="text-center h-4"><button type='button' className="btn btn-danger" onClick={() => handleDelete(doc.id)}>
							Delete
						</button></div>
					)

					data.push({ ...doc.data(), id: doc.id, view })
					setJobDetails([...data]);

					setLoading(false)
				});
			})


	}, []);
	const handleDelete = id => {
		offersRef.doc(id)
			.delete()
		toast.warn("Job deleted successfully");
	};


	const BootstrapModal = () => (
		<>
			<div className="d-flex bd-highlight">
				<div className="ml-auto p-2 bd-highlight addJobBtn">
					<Button className="addJobBtn" variant="primary" onClick={handleShow}>
						Add job
					</Button>
				</div>
			</div>
			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>New Job</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<form onSubmit={(e) => {
						handleSubmit(e, jobtitle, totalopenings, jobstatus, entrylevel)
					}}>
						<div className="form-group">
							<label htmlFor="jobtitle-create">Job Title</label>
							<input onChange={handleChange} className="form-control" type="text" id="jobtitle-create" name="jobtitle-create" placeholder="Enter Job Title" required={true} />
						</div>
						<div className="form-group">
							<label htmlFor="totalopenings-create">Total Openings</label>
							<input onChange={handleChange} className="form-control" type="number" id="totalopenings-create" name="totalopenings-create" placeholder="Enter Total Openings" required={true} />
						</div>
						<div className="form-group">
							<label htmlFor="entrylevel-create">Entry Level</label>

							<select className="form-control" type="text" id="entrylevel-create" name="entrylevel-create" onClick={(e) => handleChange(e)}>
								<option id="selectedValue" name="selectedValue" value="Please select" >Please select...</option>
								<option id="selectedValue" name="selectedValue" value="Fresher"  >Fresher</option>
								<option id="selectedValue" name="selectedValue" value="Experience"  >Experience</option>
							</select>
						</div>
						<div className="form-group text-center">
							<Button variant="secondary" onClick={handleClose}>
								Close
						</Button> &nbsp;
							<button className="btn btn-success" type="submit">Create</button>
						</div>
					</form>
				</Modal.Body>
			</Modal>
		</>
	)

	const jobDetailsTablecolumns = [
		{
			Header: () => (
				<div className="text-center font-weight-bold">
					Job ID
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
			width: 200,
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
			width: 200,
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
			width: 200,
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
			width: 200,
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
			width: 200,
			// Cell: row => {row.value}
		}
	];



	return !loading ? (
		<>
			{BootstrapModal()}
			<div className="container text-center">
				<ReactTable
					data={jobsDetails}
					columns={jobDetailsTablecolumns}
					className='-striped -highlight ReactTable'
					sortable={true}
					defaultPageSize={5}
					resizable={false}
					showPageSizeOptions={false}
				/>
			</div>
			<ToastContainer />
		</>
	) : (
		<span><Ring color="gray" size={100} /></span>
	)
}

export default Recruiter