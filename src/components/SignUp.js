import React, { useContext, useState } from "react";
import { UserContext } from "../providers/UserProvider";
import { auth, firestore } from "../firebase/config";
import { Link, useHistory } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const SignUp = () => {
  const { setCurrentUser } = useContext(UserContext);
  const history = useHistory();

  let [name, setName] = useState("");
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");

  const handleSubmit = (e, name, email, password) => {
    e.preventDefault();
    // auth.createUserWithEmailAndPassword(email, password).then(userAuth => {
    // 	firestore.collection('users').doc(userAuth.user.uid).set({ name })
    // 		.then(() => {
    // 			setCurrentUser({ name, email })
    // 			history.push("/profile")
    // 		})
    // })
    toast.warning(
      "Please contact admin to create user with roles. Write to 'praveenrk189@gmail.com'"
    );
    // alert("Please contact admin to create user with roles. Write to 'praveenrk189@gmail.com'")
  };

  const handleChange = (e) => {
    if (e.target.id === "name-sign-up") {
      setName(e.target.value);
    } else if (e.target.id === "email-sign-up") {
      setEmail(e.target.value);
    } else {
      setPassword(e.target.value);
    }
  };

  return (
    <div className="component">
      <div className="shadow p-3 mb-5 bg-white rounded loginsignup-form">
        <h1 className="text-center">Sign up</h1>
        <form onSubmit={(e) => handleSubmit(e, name, email, password)}>
          <div className="form-group my-4">
            <input
              onChange={handleChange}
              className="form-control"
              type="text"
              id="name-sign-up"
              name="name-sign-up"
              placeholder="Enter Your Name"
            />
          </div>
          <div className="form-group mt-4">
            <input
              onChange={handleChange}
              className="form-control"
              type="email"
              id="email-sign-up"
              name="email-sign-up"
              placeholder="Enter Your Email"
            />
          </div>
          <div className="form-group mt-4">
            <input
              onChange={handleChange}
              className="form-control"
              type="password"
              id="password-sign-up"
              name="password-sign-up"
              placeholder="Enter Your Password"
            />
          </div>
          <div className="form-group mt-4">
            <button className="btn btn-success">Sign up</button>
          </div>
          <div className="form-group">
            <h6>
              Already have account?
              <Link to="/"> Sign in</Link>
            </h6>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SignUp;
