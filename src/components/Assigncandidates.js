import React, { useContext, useState, useEffect } from 'react'
import { firestore } from '../firebase/config';
import ReactTable from "react-table-6";
import 'react-table-6/react-table.css';
import { UserContext } from '../providers/UserProvider'

const Assigncandidates = () => {

  const [appliedCandidates, setCandidate] = useState([]);
  const [assignInterviewer, setInterviewer] = useState([]);
  const [candidateAssignInterviewer, setAssignInterviewer] = useState('');
  const { currentUser } = useContext(UserContext);
  var userEmail = currentUser?.email || '';
  var value = 'initial'

  useEffect(() => {
    getCandidates();
    getInterviewer();
  },[]);

  console.log(appliedCandidates)

  const getCandidates = () => {
    firestore.collection('candidates').get()
      .then(response => {
        const fetchedCandidates = [];
        response.docs.forEach(document => {
          const fetchedCandidate = {
            id: document.id,
            title: document.data().userEmail,
            openings: document.data().jobAssignTitle,
            select: (
              <div className="text-center h-6">
                <select onClick={(e) => handleChange(e, document.id)}>
                  {assignInterviewer.length !== 0 && assignInterviewer.map((data) => (
                    <option id="selectedValue" name="selectedValue" value={data.name}>{data.name}</option>)
                  )}
                </select>
              </div>
            )
          };
          fetchedCandidates.push(fetchedCandidate);
        });
        setCandidate(fetchedCandidates);
    })
  }

  const getInterviewer = () => {
    firestore.collection('users').where('role', '==', "interviewer").get()
    .then(response => {
      const fetchedUsers = [];
      response.docs.forEach(document => {
        const fetchedUser = {
          id: document.id,
          name: document.data().name,
          role: document.data().role,
        };
        fetchedUsers.push(fetchedUser);
      });
      setInterviewer(fetchedUsers);
    })
  }

  console.log(assignInterviewer)

  const handleChange = async (e, id) => {
    setAssignInterviewer(e.target.value);
    console.log(id);
    firestore.collection('candidates')
    .doc(id)
    .update({ interviewer: candidateAssignInterviewer })
    .then((data) => {console.log(data)})
    .catch((err) => { console.log(err) })
  }


  // const handleSubmit = (e, userEmail, jobAssignTitle) => {
  //   e.preventDefault();
  //   firestore.collection('candidates')
  //     .doc()
  //     .set({ userEmail, jobAssignTitle })
  //     .then((data) => {console.log(data)})
  //     .catch((err) => { console.log(err) })
  // }

  const appliedCandidatescolumns = [
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
          Assign To
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
      {console.log(assignInterviewer)}
      {/* <h6 className="applyTitle">{`${userEmail} select and assign interviewer`}</h6> */}
      <ReactTable
        data={appliedCandidates}
        columns={appliedCandidatescolumns}
        className='assignCandidateReactTable'
        sortable={true}
        defaultPageSize={5}
      />
    </div>
  )
}

export default Assigncandidates