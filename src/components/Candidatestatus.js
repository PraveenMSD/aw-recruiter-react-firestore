import React, { useContext, useState, useEffect } from 'react'
import { firestore, auth } from '../firebase/config';
import ReactTable from "react-table-6";
import 'react-table-6/react-table.css';

const Candidatestatus = () => {

    const [appliedCandidates, setCandidate] = useState([]);
    const currentLoggedUser = auth.currentUser;
    const userName = currentLoggedUser?.email.split("@")[0];
    const capUserName = userName?.charAt(0).toUpperCase() + userName?.slice(1);

    useEffect(() => {
        getCandidates();
    }, []);

    const getCandidates = () => {
        firestore.collection('candidates').get()
            .then(response => {
                const fetchedCandidates = [];
                response.docs.forEach(document => {
                    const fetchedCandidate = {
                        id: document.id,
                        interviewer: document.data().interviewer,
                        title: document.data().jobAssignTitle,
                        useremail: document.data().userEmail,
                        status: document.data().status,
                    };
                    fetchedCandidates.push(fetchedCandidate);
                });
                //(currentLoggedUser?.email === "hrjack@awr.com")) ? fetchedCandidates : setCandidate(fetchedCandidates.filter(email => (email.useremail === currentLoggedUser?.email)));
                if(currentLoggedUser == null || currentLoggedUser?.email === "hrjack@awr.com" || currentLoggedUser?.email === "iwrtechy@awr.com" ){
                    setCandidate(fetchedCandidates)
                }
                else {
                    setCandidate(fetchedCandidates.filter(email => (email.useremail === currentLoggedUser?.email) || (email.useremail =="hrjack@awr.com") ));
                }
                //setCandidate(fetchedCandidates.filter(email => (email.useremail === currentLoggedUser?.email) || (email.useremail =="hrjack@awr.com") ));
            })
    }
    const appliedCandidatescolumns = [
        {
            Header: () => (
                <div className="text-center font-weight-bold">
                    Interviewer
                </div>
            ),
            accessor: 'interviewer',
            className: 'font',
            width: 200,
            Cell: row => <div className="text-center h-4">{row.value}</div>,
        },
        {
            Header: () => (
                <div className="text-center font-weight-bold">
                    Candidate Name
                </div>
            ),
            accessor: 'useremail',
            className: 'font',
            width: 200,
            Cell: row => <div className="text-center h-6">{(row.value).split("@")[0]}</div>,
        },
        {
            Header: () => (
                <div className="text-center font-weight-bold">
                    Candidate Email
                </div>
            ),
            accessor: 'useremail',
            className: 'font',
            width: 250,
            Cell: row => <div className="text-center h-6">{row.value}</div>,
        },
        {
            Header: () => (
                <div className="text-center font-weight-bold">
                    Position
                </div>
            ),
            accessor: 'title',
            className: 'font',
            width: 200,
            Cell: row => <div className="text-center h-6">{row.value}</div>,
        },
        {
            Header: () => (
                <div className="text-center font-weight-bold">
                    Status
                </div>
            ),
            accessor: 'status',
            className: 'font',
            width: 200,
            Cell: row => <div className="text-center h-6">{row.value}</div>,
        }
    ];


    return (
        <div>
            <ReactTable
                data={appliedCandidates}
                columns={appliedCandidatescolumns}
                className='statusCandidateReactTable'
                sortable={true}
                defaultPageSize={5}
            />
        </div>
    )
}

export default Candidatestatus