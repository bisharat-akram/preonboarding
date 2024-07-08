import './App.css'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import Login from './pages/Login'
import LayoutSiderWrapper from './Components/LayoutSiderWrapper'
import Dashboard from './pages/Dashboard'
import ModalCreate from './pages/Modalcreate'
import ListUser from './pages/listUser'
import SignUp from './pages/signUp'
import Model from './pages/model'
import { useEffect, useState } from 'react';
import { Hub } from 'aws-amplify/utils';
import { fetchAuthSession, fetchUserAttributes } from 'aws-amplify/auth';
import { useDispatch } from 'react-redux'
import { createUser } from './redux/actions/userAction'
import { ConfigProvider } from 'antd';
import { green } from '@ant-design/colors';


const customTheme = {
  primaryColor: 'black !important',
};


function App() {
  const location = useLocation();
  const [session, setSession] = useState();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // cog:-"a173cdda-4011-709d-adae-325fc36c21a8"


  useEffect(() => {
    async function init() {
      const _session = await fetchAuthSession();
      console.log(_session);
      if (_session?.tokens?.accessToken) {
        setSession(true);
        const user = await fetchUserAttributes();
        dispatch(createUser(user));
      }
      else {
        if (location.pathname !== '/signup' && location.pathname !== '/login')
          navigate('/login')
      }
      Hub.listen('auth', ({ payload }) => {
        console.log(payload)
        switch (payload.event) {
          case 'signedIn':
            console.log('user have been signedIn successfully.');
            setSession(true)
            break;
          case 'signedOut':
            console.log('user have been signedOut successfully.');
            setSession(false)
            break;
          case 'tokenRefresh':
            console.log('auth tokens have been refreshed.');
            break;
          case 'tokenRefresh_failure':
            console.log('failure while refreshing auth tokens.');
            break;
          case 'signInWithRedirect':
            console.log('signInWithRedirect API has successfully been resolved.');
            break;
          case 'signInWithRedirect_failure':
            console.log('failure while trying to resolve signInWithRedirect API.');
            break;
          case 'customOAuthState':
            console.log('custom state returned from CognitoHosted UI');
            break;
        }
      });
    }
    init();

  }, [])
  
  if (session) {
    return (
      <ConfigProvider
        theme={{
          // token: {
          //   colorPrimary: data.colorPrimary,
          //   borderRadius: data.borderRadius,
          // },
          components: {
            Button: {
              colorPrimary: '#17B26A',
            },
          },
        }}
      >
        <Routes>
          <Route exact path='/' element={<LayoutSiderWrapper><Dashboard /></LayoutSiderWrapper>} />
          <Route exact path='/createmodel' element={<ModalCreate />} />
          <Route exact path='/account' element={<ListUser />}></Route>
          <Route exact path='/model/:id' element={<LayoutSiderWrapper><Model /></LayoutSiderWrapper>}></Route>
        </Routes>
    </ConfigProvider>
     
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
