import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import Routes from './routes';
import createBrowserHistory from 'history/createBrowserHistory'
import './css/bootstrap.css'
const customHistory = createBrowserHistory()

ReactDOM.render(<Routes history={customHistory}/>, document.getElementById('root'));
registerServiceWorker();
