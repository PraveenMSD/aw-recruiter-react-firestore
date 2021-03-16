import React, { useContext, useState, useEffect } from "react";
import { firestore } from "../firebase/config";
import ReactTable from "react-table-6";
import "react-table-6/react-table.css";
import { UserContext } from "../providers/UserProvider";
import { ToastContainer, toast } from "react-toastify";
import { Container, Card, Row, Col } from "react-bootstrap";
import { FcBullish, BsFillHeartFill } from "react-icons/all";
import { Ring } from "react-spinners-css";

const Assigncandidates = () => {
  const [appliedCandidates, setCandidate] = useState([]);
  const { currentUser } = useContext(UserContext);
  var userEmail = currentUser?.email || "";
  var value = "initial";
  const totalInterviewer = [];
  const notify = () => toast.success("Interviewer assigned successfully");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getInterviewer();
  }, []);

  const getCandidates = (fetchedUsers) => {
    firestore
      .collection("candidates")
      .get()
      .then((response) => {
        const fetchedCandidates = [];
        response.docs.forEach((document) => {
          const fetchedCandidate = {
            id: document.id,
            email: document.data().userEmail,
            candidateName: document.data().userEmail,
            openings: document.data().jobAssignTitle,
            assignedTo: document.data().interviewer,
            select: (
              <select onClick={(e) => handleChange(e, document.id)}>
                {fetchedUsers.length !== 0 &&
                  fetchedUsers.map((data) => (
                    <option
                      id="selectedValue"
                      name="selectedValue"
                      value={data.name}
                      selected={document.data().interviewer === data.name}
                    >
                      {data.name}
                    </option>
                  ))}
              </select>
            ),
          };
          totalInterviewer.push(document.data().interviewer);
          fetchedCandidates.push(fetchedCandidate);
        });

        setCandidate(fetchedCandidates);

        setLoading(false);
      });
  };

  const getInterviewer = () => {
    firestore
      .collection("users")
      .where("role", "==", "interviewer")
      .get()
      .then((response) => {
        const fetchedUsers = [];
        response.docs.forEach((document) => {
          const fetchedUser = {
            id: document.id,
            name: document.data().name,
            role: document.data().role,
          };
          fetchedUsers.push(fetchedUser);
        });
        getCandidates(fetchedUsers);
      });
  };

  const handleChange = async (e, id) => {
    firestore
      .collection("candidates")
      .doc(id)
      .update({ interviewer: e.target.value })
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
    notify();
  };

  const appliedCandidatescolumns = [
    {
      Header: () => (
        <div className="text-center font-weight-bold">Candidate Name</div>
      ),
      accessor: "candidateName",
      className: "font",
      width: 200,
      Cell: (row) => (
        <div className="text-center h-4">{row.value.split("@")[0]}</div>
      ),
    },
    {
      Header: () => (
        <div className="text-center font-weight-bold">Candidate email</div>
      ),
      accessor: "email",
      className: "font",
      width: 250,
      Cell: (row) => <div className="text-center h-4">{row.value}</div>,
    },
    {
      Header: () => (
        <div className="text-center font-weight-bold">Applied position</div>
      ),
      accessor: "openings",
      className: "font",
      width: 200,
      Cell: (row) => <div className="text-center h-6">{row.value}</div>,
    },
    {
      Header: () => (
        <div className="text-center font-weight-bold">Assign To</div>
      ),
      accessor: "select",
      className: "font",
      width: 200,
      Cell: (row) => <div className="text-center h-6">{row.value}</div>,
    },
  ];

  return !loading ? (
    <div className="container-fluid">
      <div class="d-inline-flex p-2 bd-highlight">
        <Card className="assignedCard">
          <Card.Body>
            <div class="d-flex flex-row bd-highlight mb-3">
              <div class="p-2 bd-highlight">
                <div className="icon-big text-center icon-warning">
                  <FcBullish size={70} />
                </div>
              </div>
              <div class="p-2 bd-highlight">
                <p></p>
                <Card.Title as="h2">2</Card.Title>
              </div>
            </div>
          </Card.Body>
          <Card.Footer>
            <div className="stats">
              <i className="fas fa-redo mr-1"></i>
              Assigned candidates
            </div>
          </Card.Footer>
        </Card>
      </div>

      <div class="d-inline-flex p-2 bd-highlight">
        <ReactTable
          data={appliedCandidates}
          columns={appliedCandidatescolumns}
          sortable={true}
          defaultPageSize={5}
          className="-striped -highlight assignCandidateReactTable"
          resizable={false}
          showPageSizeOptions={false}
        />
        <ToastContainer />
      </div>
    </div>
  ) : (
    <span>
      <Ring color="gray" size={100} />
    </span>
  );
};

export default Assigncandidates;
