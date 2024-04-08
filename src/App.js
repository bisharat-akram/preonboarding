import { Route, Routes } from 'react-router-dom';

import { Amplify } from 'aws-amplify';
import { Authenticator, View, Image, useTheme, Text } from '@aws-amplify/ui-react';
import awsExports from './aws-exports';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import '@aws-amplify/ui-react/styles.css';

import SiteNav from './components/common/SiteNav';
import SiteFooter from './components/common/SiteFooter';

import HomePage from './components/home/HomePage';
import Contacts from './components/contacts/Contacts';
import UploadViewPage from './components/file/UploadView';
import FileDetailsPage from './components/file/FileDetails';
import Results from './components/results/Results';
import ResultsDetails from './components/results/ResultDetails';

Amplify.configure(awsExports);

function App() {
  const components = {
    Header() {
      const { tokens } = useTheme();

      return (
        <View textAlign="center" padding={tokens.space.large}>
          <Image
            alt="Contacts App"
            src="/img/prometheusagi_logo.png"
          />
        </View>
      );
    },
    Footer() {
      const { tokens } = useTheme();

      return (
        <View textAlign="center" padding={tokens.space.large}>
          <Text color={tokens.colors.neutral[80]}>
            &copy; 2024: All Rights Reserved
          </Text>
        </View>
      );
    },
  };

  return (
    <Authenticator loginMechanisms={["email"]} components={components}>
      {({ signOut, user }) => (
        <div>
          <SiteNav logOut={signOut} />
          <Routes>
            <Route path='*' element={<HomePage />} />
            <Route path='/' exact={true} element={<UploadViewPage />} />
            {/* <Route path='/' exact={true} element={<HomePage />} /> */}
            <Route path='/contacts' element={<Contacts />} />
            {/* <Route path='/files/' element={<UploadViewPage />} /> */}
            <Route path='/files/:fileKey' element={<FileDetailsPage />} />
            <Route path='/results' element={<Results />} />
            <Route path='/results/:key' element={<ResultsDetails />} />
          </Routes>
          <SiteFooter />
        </div>
      )}
    </Authenticator>
  );
}

export default App;