import React, { useContext, useState, useEffect } from 'react'
import { firestore } from '../firebase/config';
import ReactTable from "react-table-6";
import 'react-table-6/react-table.css';
import { UserContext } from '../providers/UserProvider'

const Interviewer = () => {
    const [appliedCandidates, setCandidate] = useState([]);

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
                        select: (
                            <div className="text-center h-6">
                                <select onChange={(e) => handleChange(e, document.id)}>
                                    <option id="selectedValue" name="selectedValue" value="Selected">Selected</option>
                                    <option id="selectedValue" name="selectedValue" value="Rejected">Rejected</option>
                                    <option id="selectedValue" name="selectedValue" value="On-Hold">On-Hold</option>
                                </select>
                            </div>
                        ),
                    };
                    fetchedCandidates.push(fetchedCandidate);
                });
                setCandidate(fetchedCandidates);
            })
    }

    console.log(appliedCandidates)


    const handleChange = async (e, id) => {
        firestore.collection('candidates')
        .doc(id)
        .update({ status: e.target.value })
        .then((data) => {console.log(data)})
        .catch((err) => { console.log(err) })
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
            width: 250,
            Cell: row => <div className="text-center h-4">{row.value}</div>,
        },
        {
            Header: () => (
                <div className="text-center font-weight-bold">
                    Candidate
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
            width: 250,
            Cell: row => <div className="text-center h-6">{row.value}</div>,
        },
        {
            Header: () => (
                <div className="text-center font-weight-bold">
                    Status
                </div>
            ),
            accessor: 'select',
            className: 'font',
            width: 250,
            Cell: row => <div className="text-center h-6">{row.value}</div>,
        }
    ];

    return (
        <div>
            <ReactTable
                data={appliedCandidates}
                columns={appliedCandidatescolumns}
                className='assignCandidateReactTable'
                sortable={true}
                defaultPageSize={5}
            />
        </div >
    )
}

export default Interviewer