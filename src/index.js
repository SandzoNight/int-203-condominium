import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import Routes from './routes';
import createBrowserHistory from 'history/createBrowserHistory'
import './css/bootstrap.css'
import './css/bootstrap-grid.css'
import './css/animate.css'
import './css/mystyle.css'
import 'sweetalert/dist/sweetalert.css'
const customHistory = createBrowserHistory()

ReactDOM.render(<Routes history={customHistory}/>, document.getElementById('root'));
registerServiceWorker();
