import React, { useContext, useState, useEffect } from 'react'
import { auth, firestore } from '../firebase/config';
import ReactTable from "react-table-6";
import 'react-table-6/react-table.css';
import { UserContext } from '../providers/UserProvider'

const Candidates = () => {
    const [JobTitle, setJobTitle] = useState('');
    const [jobs, setJobs] = useState([]);
    const [jobAssignTitle, setAssignJobTitle] = useState('');
    const {currentUser} = useContext(UserContext);
    var userEmail = currentUser?.email || '';
	const [disabled, setDisabled] = useState(false);
	const currentLoggedUser = auth.currentUser;

	//onClick={(e) => handleSubmit(e,userEmail,document.data().jobtitle)} , onClick={(e) => onBtnClick(e, document.data().jobtitle)}
      useEffect(() => {
		getJobsForCandidates();
      }, []);
    
      


	  const getJobsForCandidates = () => {
		firestore.collection('jobs').get()
		.then(response => {
		  const fetchedJobs = [];
		  response.docs.forEach(document => {
			const fetchedJob = {
			  id: document.id,
			  title: document.data().jobtitle,
			  openings: document.data().totalopenings,
			  status: document.data().jobstatus,
			  level: document.data().entrylevel,
			  apply: (
				  <button className="btn btn-success" id={document.data().jobtitle} onClick={(e) => handleSubmit(e,userEmail,document.data().jobtitle, document.id, document.data().totalopenings)} >Apply</button>
			  )
			};
			fetchedJobs.push(fetchedJob);
		  });
		  setJobs(fetchedJobs);
		})
	  }

	  console.log(jobs)

	  const decrementJobOpeningOnApply = (jobId, openingss) => {
		console.log(jobId);
		console.log(parseInt(openingss -1 ))
		  firestore.collection('jobs')
		  .doc(jobId)
		  .update({totalopenings: parseInt(openingss -1)})
	  }

      const handleSubmit = (e, userEmail, title, jobId, openingss) => {
		e.preventDefault();
		document.getElementById(title).disabled=true;
		console.log(userEmail);
		console.log(title);
		
		decrementJobOpeningOnApply(jobId, openingss);
		
		//firestore.collection('candidates')
			// .doc()
			// .set({userEmail ,title })
			// .catch((err) => { console.log(err) })
	}

    const handleChange = async (e) => {
		setAssignJobTitle( e.target.value );
        console.log(jobAssignTitle)
	}

    const jobDetailsTablecolumns = [
		{
			Header: () => (
				<div className="text-center font-weight-bold">
					Job Title
				</div>
			),
			accessor: 'title',
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
            <h6 className="applyTitle">{`${currentLoggedUser.email},select the job title and click apply`}</h6>

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
        </div>
    )
}

export default Candidates