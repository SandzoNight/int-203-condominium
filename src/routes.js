// src/routes.js
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import App from './components/App';
import Dashboard from './components/Dashboard';
import Employee from './components/Employee';
import Emp from './components/Employee/Emp';
import Login from './components/Login';
import NotFound from './components/NotFound';

const Routes = (props) => (
  <Router {...props}>
    <Switch>
      <Route exact path="/" component={App}/>
      <Route path="/dashboard" component={Dashboard} />
      <Route exact path="/employee" component={Employee} />
      <Route path="/employee/:id" component={Employee}/>
      <Route path="/login" component={Login} />
      <Route path="*" component={NotFound} />
    </Switch>
  </Router>
);

export default Routes;