import React, { useContext, useState, useEffect } from "react";
import { auth } from "../firebase/config";
import { UserContext } from "../providers/UserProvider";
import { firestore } from "../firebase/config";

import { Pie } from "react-chartjs-2";
import { Card, Col, Container, Row } from "react-bootstrap";
import { FcBullish, BsFillHeartFill } from "react-icons/all";
import { Ring } from "react-spinners-css";

const Dashboard = () => {
  const item = "";

  const [labelsArray, setlabelsArray] = useState([]);
  const [dataArray, setdataArray] = useState([]);
  const [jobsDetails, setJobDetails] = useState([]);
  const [colorChart, setcolorChart] = useState([]);
  const [isFirebaseInitialized, setFirebaseInitialized] = useState(false);
  const [totalJobs, setTotalJob] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getJobsForCandidates();
  }, []);

  const getJobsForCandidates = async () => {
    firestore
      .collection("jobs")
      .get()
      .then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          var item = doc.data();
          var jobtitle = item.jobtitle;
          setlabelsArray((prevState) => [...prevState, item.jobtitle]);

          var jobVacancy = item.totalopenings;

          setdataArray((prevStatee) => [...prevStatee, item.totalopenings]);
          setTotalJob((prevState) => prevState + parseInt(item.totalopenings));

          setLoading(false);
        });
      });
  };

  const data = {
    labels: labelsArray,
    datasets: [
      {
        data: dataArray,
        backgroundColor: [
          "#f44336",
          "#e91e63",
          "#9c27b0",
          "#673ab7",
          "#3f51b5",
          "#2196f3",
          "#03a9f4",
          "#00bcd4",
          "#009688",
          "#4caf50",
          "#8bc34a",
          "#cddc39",
          "#ffeb3b",
          "#ffc107",
          "#ff9800",
          "#ff5722",
          "#795548",
          "#607d8b",
        ],
        hoverBackgroundColor: [
          "#f44336",
          "#e91e63",
          "#9c27b0",
          "#673ab7",
          "#3f51b5",
          "#2196f3",
          "#03a9f4",
          "#00bcd4",
          "#009688",
          "#4caf50",
          "#8bc34a",
          "#cddc39",
          "#ffeb3b",
          "#ffc107",
          "#ff9800",
          "#ff5722",
          "#795548",
          "#607d8b",
        ],
      },
    ],
  };

  const currentUser = auth.currentUser;
  const userMsg = currentUser
    ? `${currentUser.email} ,Welcome back`
    : `No user is logged in`;

  return !loading ? (
    <div className="container-fluid">
      <div className="d-inline-flex p-2 bd-highlight jobsPieChart">
        <Pie
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: true,
          }}
        />
      </div>

      <div className="d-inline-flex p-2 bd-highlight">
        <Card className="totalJobDashboardCard">
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

      <div className="d-inline-flex p-2 bd-highlight dashboardCard">
        <Card className="totalJobDashboardCard">
          <Card.Body>
            <div className="d-flex flex-row bd-highlight mb-3">
              <div className="p-2 bd-highlight">
                <div className="icon-big text-center icon-warning">
                  <FcBullish size={70} />
                </div>
              </div>
              <div className="p-2 bd-highlight">
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
    </div>
  ) : (
    <span>
      <Ring color="gray" size={100} />
    </span>
  );
};

export default Dashboard;
