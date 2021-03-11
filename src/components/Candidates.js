import React, { useContext, useState, useEffect } from 'react'
import { auth, firestore } from '../firebase/config';
import ReactTable from "react-table-6";
import 'react-table-6/react-table.css';
import { UserContext } from '../providers/UserProvider'
import { Bar } from 'react-chartjs-2';

const Candidates = () => {
	const [JobTitle, setJobTitle] = useState('');
	const [jobs, setJobs] = useState([]);
	const [jobAssignTitle, setAssignJobTitle] = useState('');
	const currentLoggedUser = auth.currentUser;
	const { currentUser } = useContext(UserContext);
	var userEmail = currentLoggedUser?.email || '';
	const [disabled, setDisabled] = useState(false);
	const [appCandidateEm, setappCandidateEm] = useState([]);
	const [appCandidateJb, setappCandidateJb] = useState([]);
	const [isFirebaseInitialized, setFirebaseInitialized] = useState(false)

	console.log(currentLoggedUser?.email)


	//onClick={(e) => handleSubmit(e,userEmail,document.data().jobtitle)} , onClick={(e) => onBtnClick(e, document.data().jobtitle)}
	useEffect(() => {
		getJobsForCandidates()
	}, []);

	console.log(isFirebaseInitialized)


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
						)
					};
					fetchedJobs.push(fetchedJob);
				});
				// setJobs(fetchedJobs);
				setJobs(fetchedJobs.filter(open => open.openings > 0));
			})
	}


	// appCandidateEm.map(function (val) {
	// 	if (userEmail === val.uEmail) {
	// 		setemBool(true)
	// 	}
	// })



	console.log(jobs)

	const decrementJobOpeningOnApply = (jobId, openingss, userEmail) => {
		console.log(jobId);
		console.log(parseInt(openingss - 1))

		// var appliedemails = "ArrayThree"
		// firestore.collection('jobs').doc("ozjBKq5TNMpqGDMmomgt")
		// 	.set({ appliedemails: [{ mail: "cdadam@awr.com"}] },
		// 		{ merge: true }
		// .update({appliedemails: [{appliedemails}]}, { merge: true}



		// if (docSnapshot.exists) {
		// 	usersRef.onSnapshot((doc) => {
		// 		// do stuff with the data
		// 	});
		// } else {
		// 	usersRef.set({}) // create the document
		// }
		// );

		firestore.collection('jobs')
			.doc(jobId)
			.update({ totalopenings: parseInt(openingss - 1), appliedemails: userEmail })
	}

	const handleSubmit = (e, userEmail, jobAssignTitle, jobId, openingss) => {
		e.preventDefault();
		document.getElementById(jobAssignTitle).disabled = true;
		console.log(userEmail);
		console.log(jobAssignTitle);

		decrementJobOpeningOnApply(jobId, openingss, userEmail);

		firestore.collection('candidates')
			.doc()
			.set({ userEmail, jobAssignTitle })
			.catch((err) => { console.log(err) })
	}

	const handleChange = async (e) => {
		setAssignJobTitle(e.target.value);
		console.log(jobAssignTitle)
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
			//Cell: row => <div className="text-center h-4"><button className="btn btn-success" type="submit">Apply</button></div>,
		}
	];

	return (
		<div>
			{/* <h6 className="applyTitle">{`${currentLoggedUser.email},select the job title and click apply`}</h6> */}

			{/* <form onSubmit={(e) => {
                handleSubmit(e, userEmail, jobAssignTitle)
            }}>
                <select className="jobSelectDD" onChange={(e) => handleChange(e)}>
                    {jobs.length !== 0 && jobs.map((data) => (
                    <option id="selectedValue" name="selectedValue" value={data.title}>{data.title}</option> )
                    )}
                </select>
                <div className="form-group text-center">
                    <button className="btn btn-success applyCandidateJob" type="submit">Apply</button>
                </div>
            </form> */}

			<div className="container">
				<ReactTable
					data={jobs}
					columns={jobDetailsTablecolumns}
					className='candidateReactTable'
					sortable={true}
					defaultPageSize={5}
				/>
			</div>
			<Bar
				data={data}
				width={10}
				height={10}
				options={{
					maintainAspectRatio: false
				}}
			/>
		</div>
	)
}

export default Candidates