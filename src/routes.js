// src/routes.js
import React from 'react';
import {Router, Route, Switch } from 'react-router-dom';

import App from './components/App';
import Dashboard from './components/Dashboard';
import Employee from './components/Employee';
import AddEmp from './components/Employee/AddEmp';
import Owner from './components/Owner';
import Login from './components/Login';
import NotFound from './components/NotFound';
import WaterBill from './components/WaterBill'
import MaintenanceBill from './components/MaintenanceBill'
import Room from './components/Room'
import Rooms from './components/Room/Rooms'

const Routes = (props) => (
  <Router {...props}>
    <Switch>
      <Route exact path="/" component={App}/>
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/login" component={Login} />
      <Route exact path="/addemployee" component={AddEmp} />
      <Route exact path="/employee" component={Employee} />
      <Route path="/employee/:id" component={Employee}/>
      <Route exact path="/owner" component={Owner} />
      <Route path="/owner/:id" component={Owner}/>
      <Route exact path="/bill/water" component={WaterBill} />
      <Route path="/bill/water/:id" component={WaterBill}/>
      <Route exact path="/bill/maintenance" component={MaintenanceBill} />
      <Route path="/bill/maintenance/:id" component={MaintenanceBill}/>
      <Route exact path="/room" component={Room} />
      <Route exact path="/room/building/:building" component={Rooms} />
      <Route exact path="/room/building/:building/:roomid" component={Rooms} />
      <Route path="*" component={NotFound} />
    </Switch>
  </Router>
);

export default Routes;