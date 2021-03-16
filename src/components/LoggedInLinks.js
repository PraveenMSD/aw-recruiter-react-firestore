import React, { useContext, useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../providers/UserProvider";
import { auth } from "../firebase/config";
import SignedOutLinks from "./SignedOutLinks";
import { firestore } from "../firebase/config";
import { Dropdown } from "react-bootstrap";
import { FaUserAlt } from "react-icons/fa";

const LoggedInLinks = () => {
  const currentUser = auth.currentUser;

  const { setCurrentUser } = useContext(UserContext);
  const [userRole, setUserRole] = useState("");
  const userName = currentUser ? currentUser.email : "";

  const [dashboardColor, setdashboardColor] = useState("");
  const [assignCandidatesColor, setassignCandidatesColor] = useState("");
  const [interviewerColor, setinterviewerColor] = useState("");
  const [candidatesColor, setcandidatesColor] = useState("");
  const [recruiterColor, setrecruiterColor] = useState("");
  const [candidatesStatusColor, setcandidatesStatusColor] = useState("");

  const history = useHistory();

  useEffect(() => {
    getUserRole();
  });

  const handleClick = async () => {
    await auth.signOut();
    setCurrentUser(null);
    history.push("/");
    window.location.reload();
  };

  const getUserRole = () => {
    firestore
      .collection("users")
      .doc(currentUser?.uid)
      .get()
      .then((response) => {
        setUserRole(response.data().role);
      });
  };

  const setBlueColor = () => {
    setdashboardColor("blue");
    setassignCandidatesColor("blue");
    setinterviewerColor("blue");
    setcandidatesColor("blue");
    setrecruiterColor("blue");
    setcandidatesStatusColor("blue");
  };

  const activeColor = (e, path) => {
    if (path === "/dashboard") {
      setBlueColor();
      setdashboardColor("black");
    } else if (path === "/assigncandidates") {
      setBlueColor();
      setassignCandidatesColor("black");
    } else if (path === "/interviewer") {
      setBlueColor();
      setinterviewerColor("black");
    } else if (path === "/candidates") {
      setBlueColor();
      setcandidatesColor("black");
    } else if (path === "/recruiter") {
      setBlueColor();
      setrecruiterColor("black");
    } else if (path === "/candidatestatus") {
      setBlueColor();
      setcandidatesStatusColor("black");
    } else {
      setBlueColor();
    }
  };

  return (
    <div>
      <ul>
        {userRole === "hr" ? (
          <li>
            <Link
              to="/dashboard"
              onClick={(e) => {
                activeColor(e, "/dashboard");
              }}
              style={{ color: dashboardColor }}
            >
              Dashboard
            </Link>
          </li>
        ) : (
          ""
        )}
        {userRole === "hr" ? (
          <li>
            <Link
              to="/assigncandidates"
              onClick={(e) => {
                activeColor(e, "/assigncandidates");
              }}
              style={{ color: assignCandidatesColor }}
            >
              Interviewer
            </Link>
          </li>
        ) : (
          ""
        )}
        {userRole === "interviewer" ? (
          <li>
            <Link
              to="/interviewer"
              onClick={(e) => {
                activeColor(e, "/interviewer");
              }}
              style={{ color: interviewerColor }}
            >
              Interviews
            </Link>
          </li>
        ) : (
          ""
        )}
        {userRole === "candidate" ? (
          <li>
            <Link
              to="/candidates"
              onClick={(e) => {
                activeColor(e, "/candidates");
              }}
              style={{ color: candidatesColor }}
            >
              Apply Jobs
            </Link>
          </li>
        ) : (
          ""
        )}
        {userRole === "hr" ? (
          <li>
            <Link
              to="/recruiter"
              onClick={(e) => {
                activeColor(e, "/recruiter");
              }}
              style={{ color: recruiterColor }}
            >
              Jobs
            </Link>
          </li>
        ) : (
          ""
        )}
        <li>
          <Link
            to="/candidatestatus"
            onClick={(e) => {
              activeColor(e, "/candidatestatus");
            }}
            style={{ color: candidatesStatusColor }}
          >
            Status
          </Link>
        </li>
        <li>{userName}</li>
        <li>
          <Dropdown>
            <Dropdown.Toggle variant="white" id="dropdown-basic">
              <FaUserAlt />
            </Dropdown.Toggle>

            <Dropdown.Menu className="listRight">
              <Dropdown.Item>
                <Link
                  to="/profile"
                  onClick={(e) => {
                    activeColor(e);
                  }}
                >
                  Profile
                </Link>
              </Dropdown.Item>
              <Dropdown.Item href="/" onClick={handleClick}>
                Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </li>
      </ul>
    </div>
  );
};

export default LoggedInLinks;
