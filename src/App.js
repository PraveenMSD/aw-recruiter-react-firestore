import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useContext } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import Home from './components/Home'
import Profile from './components/Profile'
import Header from './components/Navbar'
import Footer from './components/Footer'
import Login from './components/Login'
import SignUp from './components/SignUp'
import Admin from './components/Admin'
import { UserContext } from './providers/UserProvider'

function App() {

  const { currentUser } = useContext(UserContext);

  const jsx = currentUser? <Profile/>: 
    <div>
      <Route exact path="/" component={Home}/>
      <Route path="/login" component={Login}/>
      <Route path="/signup" component={SignUp}/>
      <Route path="/admin" component={Admin}/>
    </div>
    
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
