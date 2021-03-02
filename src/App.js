import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useContext } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Home from './components/Home'
import Profile from './components/Profile'
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
import 'react-toolbox/lib/table';

function App() {

  const { currentUser } = useContext(UserContext);

  //const jsx = currentUser? <Profile/>:
  const jsx = currentUser?.role === "hr" ? <Recruiter/>:
  //const jsx = currentUser?.role === "admin" ?( <Admin />): currentUser?.role === "hr" ? (<Recruiter />) : currentUser?.role === "interviewer" ? (<Interviewer />) :
  //const jsx = (currentUser?.role === "hr") ?( <Recruiter />): (currentUser?.role === "admin") ? (<Admin />) : currentUser? <Profile /> :
  currentUser?.role === "admin" ? <Admin/> :
    <div>
      <Route exact path="/" component={Home}/>
      <Route exact path="/login" component={Login}/>
      <Route exact path="/signup" component={SignUp}/>
      <Route exact path="/admin" component={Admin}/>
      <Route exact path="/recruiter" component={Recruiter}/>
      <Route exact path="/interviewer" component={Interviewer}/>
      <Route exact path="/candidates" component={Candidates}/>
      <Route exact path="/candidatestatus" component={Candidatestatus}/>
      <Route exact path="/assigncandidates" component={Assigncandidates}/>
    </div>
    
    console.log(currentUser?.role);
  return (
    <BrowserRouter>
      <Header/>
      <br/><br/>
      {jsx}
      <Footer />
    </BrowserRouter>
  );
}

export default App;
