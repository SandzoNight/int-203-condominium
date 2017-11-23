import React, { Component } from 'react';
import socket from './../../lib/withSocket'
import {withRouter} from "react-router-dom";
import Navbar from './../Navbar'

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
      <div>
        <Navbar history={this.props.history}/>
        <div className="d-flex flex-column justify-content-center align-content-center flex-wrap">
          <h1 className="animated bounceInUp mt-5 align-self-center">Hello, Administrator!</h1>
          <p className="animated bounceInLeft h4 align-self-center">Start navigating by clicking on the navbar above.</p>
        </div>
      </div>
    );
  }
}

export default withRouter(Dashboard);
