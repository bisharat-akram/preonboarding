import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/index.js';
import outputs from '../amplify_outputs.json';
import { Amplify } from 'aws-amplify';

Amplify.configure(outputs);
const existingConfig = Amplify.getConfig();
Amplify.configure({
  ...existingConfig,
  API: {
    ...existingConfig?.API,
    REST: outputs?.custom?.API,
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter >
    <Provider store={store}>
      <App />
    </Provider >
  </BrowserRouter>
)
