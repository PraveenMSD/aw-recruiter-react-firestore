import React, { useContext, useState, useEffect } from 'react'
import { auth, firestore } from '../firebase/config';
import ReactTable from "react-table-6";
import 'react-table-6/react-table.css';
import { UserContext } from '../providers/UserProvider'

const Interviewer = () => {
    const [appliedCandidates, setCandidate] = useState([]);
    const currentLoggedUser = auth.currentUser;
    const userName = currentLoggedUser?.email.split("@")[0];
    const capUserName = userName?.charAt(0).toUpperCase() + userName?.slice(1);

    useEffect(() => {
        getCandidates();
        // fileterInterviewer();
        // appliedCandidates.filter(interviewer => interviewer === userName)
    }, []);

    // setStonesToShow(currentStones => {
    //     return currentStones.filter(item => item.type === stoneType.checked && stoneColor.checked)
    //  })

    const options = [
        { value: 'Selected' },
        { value: 'Rejected' },
        { value: 'On-Hold' }
    ]

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
                        selectedstatus: document.data().status,
                        select: (
                            <div className="text-center h-6">
                                <select onClick={(e) => handleChange(e, document.id)}>
                                    <option id="selectedValue" name="selectedValue" value="Selected"  >Selected</option>
                                    <option id="selectedValue" name="selectedValue" value="Rejected"  >Rejected</option>
                                    <option id="selectedValue" name="selectedValue" value="On-Hold"  >On-Hold</option>
                                    {/* <option id="selectedValue" name="selectedValue" >{options.value}</option> */}
                                    {/* <option id="selectedValue" name="selectedValue" value="Selected"  selected={document.data().status ? document.data().status : "Selected"}>Selected</option> */}
                                </select>
                            </div>
                        ),
                    };
                    fetchedCandidates.push(fetchedCandidate);
                });
                setCandidate(fetchedCandidates);
                // .filter(user => user.online == true);
                setCandidate(fetchedCandidates.filter(int => int.interviewer === capUserName));
            })
    }

    // const fileterInterviewer = () => {
    //     setCandidate(appliedCandidates.filter(interviewer => interviewer === userName))
    //     console.log(appliedCandidates)
    // }

    const handleChange = async (e, id) => {
        firestore.collection('candidates')
            .doc(id)
            .update({ status: e.target.value })
            .then((data) => { console.log(e.target.value) })
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
            width: 160,
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
            width: 160,
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
            width: 140,
            Cell: row => <div className="text-center h-6">{row.value}</div>,
        },
        {
            Header: () => (
                <div className="text-center font-weight-bold">
                    Status
                </div>
            ),
            accessor: 'selectedstatus',
            className: 'font',
            width: 140,
            Cell: row => <div className="text-center h-6">{row.value}</div>,
        },
        {
            Header: () => (
                <div className="text-center font-weight-bold">
                    Set Status
                </div>
            ),
            accessor: 'select',
            className: 'font',
            width: 140,
            Cell: row => <div className="text-center h-6">{row.value}</div>,
        }
    ];

    return (
        <div>
            <ReactTable
                data={appliedCandidates}
                columns={appliedCandidatescolumns}
                className='interviewerReactTable'
                sortable={true}
                defaultPageSize={5}
            />
        </div >
    )
}

export default Interviewer