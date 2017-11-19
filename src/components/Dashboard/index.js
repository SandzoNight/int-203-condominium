import React, { Component } from 'react';
import socket from './../../lib/withSocket'
import {withRouter} from "react-router-dom";
import Navbar from './components/Navbar'

class Dashboard extends Component {
  constructor(props) {
    super(props)
  }
  
  componentWillMount() {
    if(localStorage.getItem('session_id')!=1){
      console.log('not logged in')
      this.props.history.push("/login")
    }
  }

  render() {
    return (
      <div className="">
        <Navbar history={this.props.history}/>
      </div>
    );
  }
}

export default withRouter(Dashboard);
