// src/routes.js
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import App from './components/App';
import Dashboard from './components/Dashboard';
import Employee from './components/Employee';
import Emp from './components/Employee/Emp';
import Login from './components/Login';
import NotFound from './components/NotFound';
import WaterBill from './components/WaterBill'
import MaintenanceBill from './components/MaintenanceBill'

const Routes = (props) => (
  <Router {...props}>
    <Switch>
      <Route exact path="/" component={App}/>
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/login" component={Login} />
      <Route exact path="/employee" component={Employee} />
      <Route path="/employee/:id" component={Employee}/>
      <Route exact path="/bill/water" component={WaterBill} />
      <Route path="/bill/water/:id" component={WaterBill}/>
      <Route exact path="/bill/maintenance" component={MaintenanceBill} />
      <Route path="/bill/maintenance/:id" component={MaintenanceBill}/>
      <Route path="*" component={NotFound} />
    </Switch>
  </Router>
);

export default Routes;