import React, { useContext, useState, useEffect } from 'react'
import { firestore } from '../firebase/config';
import ReactTable from "react-table-6";
import 'react-table-6/react-table.css';
import { UserContext } from '../providers/UserProvider'

const Candidates = () => {
    const [JobTitle, setJobTitle] = useState('');
    const [jobs, setJobs] = useState([]);
    const [jobAssignTitle, setAssignJobTitle] = useState('');
    const {currentUser} = useContext(UserContext);
    var userEmail = currentUser?.email || '';

      useEffect(() => {
        firestore.collection('jobs').get()
          .then(response => {
            const fetchedJobs = [];
            response.docs.forEach(document => {
              const fetchedJob = {
                id: document.id,
                title: document.data().jobtitle,
                openings: document.data().totalopenings,
                status: document.data().jobstatus,
                level: document.data().entrylevel
              };
              fetchedJobs.push(fetchedJob);
            });
            setJobs(fetchedJobs);
          })
      }, []);
    
      console.log(jobs)

      const handleSubmit = (e, userEmail, jobAssignTitle) => {
		e.preventDefault();
		firestore.collection('candidates')
			.doc()
			.set({userEmail ,jobAssignTitle })
			.catch((err) => { console.log(err) })
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
			width: 250,
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
			width: 250,
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
			width: 250,
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
		}
	];

    return (
        <div>
            <h6 className="applyTitle">{`${userEmail},select the job title and click apply`}</h6>

            <form onSubmit={(e) => {
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
            </form>

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