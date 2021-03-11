import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import {useEffect, useContext, useState } from 'react'
import { BrowserRouter, Route, Switch, useHistory, Redirect } from 'react-router-dom'
import Header from './components/Navbar'
import Footer from './components/Footer'
import Login from './components/Login'
import SignUp from './components/SignUp'
import Admin from './components/Admin'
import Interviewer from './components/Interviewer'
import Recruiter from "./components/Recruiter"
import Assigncandidates from "./components/Assigncandidates"
import Candidates from './components/Candidates'
import Candidatestatus from './components/Candidatestatus'
import { UserContext } from './providers/UserProvider'
import { UserProvider } from './providers/UserProvider'
import 'react-toolbox/lib/table';
import { auth, firestore } from './firebase/config';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';


function App(props) {

	const {currentUser, setCurrentUser } = useContext(UserContext);

  const history = useHistory();



  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      console.log(user.uid)
      firestore.collection('users')
					.doc(user.uid)
					.get()
					.then(user => {
						setCurrentUser({
							email: user.data().email,
							name: user.data().name,
							userRole: user.data().role,
						})
						// if (user.data().role === "admin") {
						// 	history.push("/admin");
						// 	//console.log("Welcome admin")
						// 	//return <Redirect to="/admin" />

						// } else if (user.data().role === "hr") {
						// 	history.push("/recruiter");
						// 	console.log("Not authorized")
						// } else if (user.data().role === "interviewer") {
						// 	history.push("/interviewer");
						// 	console.log("Not authorized")
						// } else if (user.data().role === "candidate") {
						// 	history.push("/candidates");
						// 	console.log("Not authorized")
						// } else {
						// 	history.push("/")
						// }
					})
    })
  }, [])

  console.log(currentUser?.userRole);


  // const jsx = currentUser? <Recruiter/>:
  // const jsx = "";
  // if(jsx = )
 
    // <div>
    //   <Route exact path="/" component={Login}/>
    //   <Route exact path="/profile" component={Profile} />
    //   {/* <Route exact path="/login" component={Login}/> */}
    //   <Route exact path="/signup" component={SignUp}/>
    //   <Route exact path="/admin" render = {() => (currentUser?.userRole === "admin"  ?  (<Admin />) : (alert("You need to be admin to access this page")))}/>
    //   <Route exact path="/recruiter" render = {() => (currentUser?.userRole === "hr"  ?  (<Recruiter />) : (alert("You need to be hr to access this page")))}/>
    //   {/* <Route exact path="/interviewer" component={Interviewer}/> */}
    //   <Route exact path="/interviewer" render = {() => (currentUser?.userRole === "interviewer"  ?  (<Interviewer />) : (alert("You need to be interviewer to access this page")))}/>
    //   <Route exact path="/candidates" render = {() => (currentUser?.userRole === "hr"  ?  (<Candidates />) : (alert("You need to be hr to access this page")))}/>
    //   <Route exact path="/candidatestatus" component={Candidatestatus}/>
    //   <Route exact path="/assigncandidates" render = {() => (currentUser?.userRole === "hr"  ?  (<Assigncandidates />) : (alert("You need to be hr to access this page")))}/>
    // </div>
    

  return (
    <BrowserRouter>
      <UserProvider>
        <Header/>
        <br/><br/>
        {/* {jsx} */}
        <div>
      <Route exact path="/" component={Login}/>
      <Route exact path="/dashboard" component={Dashboard} />
      {/* <Route exact path="/login" component={Login}/> */}
      <Route exact path="/signup" component={SignUp}/>
      <Route exact path="/admin" component={Admin}/>
      <Route exact path="/recruiter" component={Recruiter}/>
      {/* <Route exact path="/interviewer" component={Interviewer}/> */}
      <Route exact path="/interviewer" component={Interviewer}/>
      <Route exact path="/candidates" component={Candidates}/>
      <Route exact path="/candidatestatus" component={Candidatestatus}/>
      <Route exact path="/assigncandidates" component={Assigncandidates}/>
      <Route exact path="/profile" component={Profile} />
    </div>
        <Footer />
      </UserProvider>  
    </BrowserRouter>
  );
}

export default App;