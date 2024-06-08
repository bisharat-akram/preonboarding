import './App.css'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { Amplify } from 'aws-amplify';
import Login from './pages/Login'
import LayoutSiderWrapper from './Components/LayoutSiderWrapper'
import Dashboard from './pages/Dashboard'
import ModalCreate from './pages/Modalcreate'
import SignUp from './pages/signUp'
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import outputs from '../amplify_outputs.json';

Amplify.configure(outputs);

function App() {
  const location = useLocation();
  const user = useSelector(st => st?.user);
  const navigate = useNavigate();
  console.log(user);

  
  useEffect(() => {
    console.log(location.pathname)
    if(location.pathname==='/signup')
      navigate('/signup');
    else if (!user.isSignedIn) 
      navigate('/login');
    else
      navigate('/')
  }, [user.isSignedIn])

  if (user.isSignedIn) {
    console.log(user)
    return (
      <Routes>
        <Route exact path='/' element={<LayoutSiderWrapper><Dashboard /></LayoutSiderWrapper>} />
        <Route exact path='/modal' element={<ModalCreate />} />
        {/* <Route exact path='/dashboard' element={<Dashboard />} /> */}
      </Routes>
    )
  }
 
  return (

    <Routes>
      <Route exact path='/login' element={<Login />} />
      <Route exact path='/signup' element={<SignUp />} />
    </Routes>
  )
}
export default App;
