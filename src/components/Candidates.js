import React, { useContext, useState, useEffect } from "react";
import { auth, firestore } from "../firebase/config";
import ReactTable from "react-table-6";
import "react-table-6/react-table.css";
import { UserContext } from "../providers/UserProvider";
import { Bar } from "react-chartjs-2";
import { getUserRole } from "../firebase/functions";
import { Redirect } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import { Card, Row, Col } from "react-bootstrap";
import { FcBullish, BsFillHeartFill } from "react-icons/all";
import { Ring } from "react-spinners-css";

const Candidates = () => {
  const [JobTitle, setJobTitle] = useState("");
  const [jobs, setJobs] = useState([]);
  const [jobAssignTitle, setAssignJobTitle] = useState("");
  const [role, getRole] = useState("");
  const currentLoggedUser = auth.currentUser;
  const { currentUser } = useContext(UserContext);
  var userEmail = currentLoggedUser?.email || "";
  const [totalJobs, setTotalJob] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserRole();
    getJobsForCandidates();
  }, []);

  const getJobsForCandidates = () => {
    firestore
      .collection("jobs")
      .get()
      .then((response) => {
        const fetchedJobs = [];
        response.docs.forEach((document) => {
          const fetchedJob = {
            id: document.id,
            jobAssignTitle: document.data().jobtitle,
            openings: document.data().totalopenings,
            status: document.data().jobstatus,
            level: document.data().entrylevel,
            appliedemails: document.data().appliedemails,
            apply:
              document.data().appliedemails === currentLoggedUser?.email ? (
                "Applied"
              ) : (
                <button
                  className="btn btn-success"
                  id={document.data().jobtitle}
                  onClick={(e) =>
                    handleSubmit(
                      e,
                      userEmail,
                      document.data().jobtitle,
                      document.id,
                      document.data().totalopenings,
                      document.data().appliedemails
                    )
                  }
                >
                  Apply
                </button>
              ),
          };
          setTotalJob(
            (prevState) => prevState + parseInt(document.data().totalopenings)
          );
          fetchedJobs.push(fetchedJob);
        });
        setJobs(fetchedJobs.filter((open) => open.openings > 0));

        setLoading(false);
      });
  };

  const getUserRole = () => {
    auth.onAuthStateChanged(function (user) {
      if (user) {
        firestore
          .collection("users")
          .doc(user.uid)
          .get()
          .then((document) => {
            getRole(document.data().role);
          });
      }
    });
  };

  const decrementJobOpeningOnApply = (jobId, openingss, userEmail) => {
    firestore
      .collection("jobs")
      .doc(jobId)
      .update({
        totalopenings: parseInt(openingss - 1),
        appliedemails: userEmail,
      });
  };

  const handleSubmit = (e, userEmail, jobAssignTitle, jobId, openingss) => {
    e.preventDefault();
    document.getElementById(jobAssignTitle).disabled = true;

    decrementJobOpeningOnApply(jobId, openingss, userEmail);

    firestore
      .collection("candidates")
      .doc()
      .set({ userEmail, jobAssignTitle })
      .catch((err) => {
        console.log(err);
      });
    toast.success("Applied successfully");
  };

  const jobDetailsTablecolumns = [
    {
      Header: () => (
        <div className="text-center font-weight-bold">Job Title</div>
      ),
      accessor: "jobAssignTitle",
      className: "font",
      width: 140,
      Cell: (row) => <div className="text-center h-4">{row.value}</div>,
    },
    {
      Header: () => (
        <div className="text-center font-weight-bold">Total Openings</div>
      ),
      accessor: "openings",
      className: "font",
      width: 140,
      Cell: (row) => <div className="text-center h-6">{row.value}</div>,
    },
    {
      Header: () => (
        <div className="text-center font-weight-bold">Job Status</div>
      ),
      accessor: "status",
      className: "px-4 py-3 text-sm",
      width: 140,
      Cell: (row) => <div className="text-center h-4">{row.value}</div>,
    },
    {
      Header: () => (
        <div className="text-center font-weight-bold">Entry Level</div>
      ),
      accessor: "level",
      filterable: false,
      width: 250,
      Cell: (row) => <div className="text-center h-4">{row.value}</div>,
    },
    {
      Header: () => <div className="text-center font-weight-bold">Apply</div>,
      accessor: "apply",
      filterable: false,
      width: 100,
    },
  ];

  return !loading ? (
    <div>
      <div className="container-fluid">
        <div className="d-inline-flex p-2 bd-highlight">
          <Card className="candidatesVacanyCard">
            <Card.Body>
              <div className="d-flex flex-row bd-highlight mb-3">
                <div className="p-2 bd-highlight">
                  <div className="icon-big text-center icon-warning">
                    <FcBullish size={70} />
                  </div>
                </div>
                <div className="p-2 bd-highlight">
                  <p></p>
                  <Card.Title as="h2">{totalJobs}</Card.Title>
                </div>
              </div>
            </Card.Body>
            <Card.Footer>
              <div className="stats">
                <i className="fas fa-redo mr-1"></i>
                Total Job openings
              </div>
            </Card.Footer>
          </Card>
        </div>

        <div className="d-inline-flex p-2 bd-highlight">
          <Card className="candidatesClientCard">
            <Card.Body>
              <div className="d-flex flex-row bd-highlight mb-3">
                <div className="p-2 bd-highlight">
                  <div className="icon-big text-center icon-warning">
                    <BsFillHeartFill size={70} />
                  </div>
                </div>
                <div className="p-2 bd-highlight">
                  <p></p>
                  <Card.Title as="h4">10K+</Card.Title>
                </div>
              </div>
            </Card.Body>
            <Card.Footer>
              <div className="stats">
                <i className="fas fa-redo mr-1"></i>
                Satisfied clients
              </div>
            </Card.Footer>
          </Card>
        </div>

        <div className="d-inline-flex p-2 bd-highlight">
          <ReactTable
            data={jobs}
            columns={jobDetailsTablecolumns}
            className="-striped -highlight candidateReactTable"
            sortable={true}
            defaultPageSize={5}
            resizable={false}
            showPageSizeOptions={false}
          />
        </div>
      </div>
      <ToastContainer />
    </div>
  ) : (
    <span>
      <Ring color="gray" size={100} />
    </span>
  );
};

export default Candidates;
