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

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolClientId: '2dm1pfhom4scg1h2f86gviuie3',
      userPoolId: 'ap-south-1_KFg0e1okT',
      loginWith: { // Optional
        oauth: {
          domain: 'https://sparktest.auth.ap-south-1.amazoncognito.com',
          scopes: ['openid email phone profile aws.cognito.signin.user.admin '],
          redirectSignIn: ['http://localhost:5173/', 'https://example.com/'],
          redirectSignOut: ['http://localhost:5173/', 'https://example.com/'],
          responseType: 'code',
        },
        username: 'true',
        email: 'true', // Optional
        phone: 'false', // Optional
      }
    }
  }
});

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
