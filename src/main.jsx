import './index.css';

import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import store from './store/store.js';;
import Router from './routes/Route.jsx';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <Router />
  </Provider>,
)
