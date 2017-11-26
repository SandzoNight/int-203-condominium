import React, { Component } from 'react';
import socket from './../../lib/withSocket'
import {withRouter} from "react-router-dom";
import Navbar from './../Navbar'
import axios from 'axios'

class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      setting: {}
    }
  }
  
  componentWillMount() {
    if(localStorage.getItem('session_id')!=1){
      console.log('not logged in')
      this.props.history.push("/login")
    }
    var self = this
    axios.get(`/api/condosetting`)
    .then(function (response) {
      console.log(response.data)
      self.setState({setting:response.data})
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  render() {
    return (
      <div>
        <Navbar history={this.props.history}/>
        <div className="d-flex flex-column justify-content-center align-content-center flex-wrap">
          <h1 className="animated bounceInUp mt-5 align-self-center">Hello, Administrator!</h1>
          <p className="animated bounceInLeft h4 align-self-center">Start navigating by clicking on the navbar above.</p>
        </div>
        <div className="d-flex flex-column justify-content-center align-content-center flex-wrap mt-5">
          <p className="align-self-center animated fadeIn">{this.state.setting.name}, {this.state.setting.address}</p>
        </div>
      </div>
    );
  }
}

export default withRouter(Dashboard);
