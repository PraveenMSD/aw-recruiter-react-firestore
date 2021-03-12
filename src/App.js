import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useContext, useState } from 'react'
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
import StickyFooter from 'react-sticky-footer';


function App(props) {

  const { currentUser, setCurrentUser } = useContext(UserContext);

  const history = useHistory();



  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      firestore.collection('users')
        .doc(user.uid)
        .get()
        .then(user => {
          setCurrentUser({
            email: user.data().email,
            name: user.data().name,
            userRole: user.data().role,
          })
        })
    })
  }, [])


  console.log(currentUser)


  return (
    <div className="App">
      <BrowserRouter>
        <UserProvider>
          <Header />
          <br /><br />
          {/* {jsx} */}
            <Route exact path="/" component={Login} />
            <Route exact path="/dashboard" render={() => (currentUser?.userRole === "hr" ? (<Dashboard />) : (<Redirect to="/profile" />))} />
            {/* <Route exact path="/login" component={Login}/> */}
            <Route exact path="/signup" component={SignUp} />
            <Route exact path="/admin" component={Admin} />
            <Route exact path="/recruiter" render={() => (currentUser?.userRole === "hr" ? (<Recruiter />) : (<Redirect to="/profile" />))} />
            {/* <Route exact path="/interviewer" component={Interviewer}/> */}
            <Route exact path="/interviewer" render={() => (currentUser?.userRole === "interviewer" || "hr" ? (<Interviewer />) : (<Redirect to="/profile" />))} />
            <Route exact path="/candidates" render={() => (currentUser?.userRole === "candidate" || "hr" ? (<Candidates />) : (<Redirect to="/profile" />))} />
            <Route exact path="/candidatestatus" render={() => (currentUser?.userRole === "candidate" || "hr" ? (<Candidatestatus />) : (<Redirect to="/profile" />))} />
            <Route exact path="/assigncandidates" render={() => (currentUser?.userRole === "hr" ? (<Assigncandidates />) : (<Redirect to="/profile" />))} />
            <Route exact path="/profile" component={Profile} />
          <div className="footer">
            <Footer />
          </div>
        </UserProvider>
      </BrowserRouter>
    </div>
  );

  // return (
  //   <BrowserRouter>
  //     <UserProvider>
  //       <Header/>
  //       <br/><br/>
  //       {/* {jsx} */}
  //       <div>
  //     <Route exact path="/" component={Login}/>
  //     <Route exact path="/dashboard" component={Dashboard} />
  //     {/* <Route exact path="/login" component={Login}/> */}
  //     <Route exact path="/signup" component={SignUp}/>
  //     <Route exact path="/admin" component={Admin}/>
  //     <Route exact path="/recruiter" component={Recruiter}/>
  //     {/* <Route exact path="/interviewer" component={Interviewer}/> */}
  //     <Route exact path="/interviewer" component={Interviewer}/>
  //     <Route exact path="/candidates" component={Candidates}/>
  //     <Route exact path="/candidatestatus" component={Candidatestatus}/>
  //     <Route exact path="/assigncandidates" component={Assigncandidates}/>
  //     <Route exact path="/profile" component={Profile} />
  //   </div>
  //       <Footer />
  //     </UserProvider>  
  //   </BrowserRouter>
  // );
}

export default App;