import React, { Component } from 'react';
import socket from './../../lib/withSocket'
import {withRouter} from "react-router-dom";
import SweetAlert from 'sweetalert-react';

class Login extends Component {
  constructor(props) {
    super(props)
    this.loginAttempt = this.loginAttempt.bind(this);
    this.handleUser = this.handleUser.bind(this);
    this.handlePass = this.handlePass.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.state = {
      username: "",
      password: "",
      status: ""
    }
  }
  
  componentDidMount() {
    if(localStorage.getItem('session_id')==1){
      console.log('already logged in')
      this.props.history.push("/dashboard")
    }
  }

  handleUser(event) {
    this.setState({username: event.target.value});
  }
  handlePass(event) {
    this.setState({password: event.target.value});
  }

  loginAttempt(e) {
    e.preventDefault();
    fetch('/api/login', {  
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      })
    })
    .then(res => res.text())
    .then(text => this.handleLogin(text))
  }

  handleLogin(data) {
    if(data){
      data = JSON.parse(data)
      console.log(data.userid)
      localStorage.setItem('session_id',data.userid)
      this.setState({
        status:'pass',
        show: true,
        popuptype: "success",
        popuptext: "Permission Granted"
      })
      setTimeout(() => {
        this.setState({
          show: false
        })
        this.props.history.push("/dashboard")
      }, 1500);
    }else{
      this.setState({
        status:'failed',
        show: true,
        popuptype: "error",
        popuptext: "Authentication Failed !"
      })
    }
  }

  render() {
    return (
      <div className="container-fluid loginbg pt-5">
        <div className="row animated fadeInDown">
          <div className="card col-8 offset-md-4 col-md-4 pt-3 pb-3">
            <h2 className="text-center">Condo Management</h2>
            <form onSubmit={this.loginAttempt}>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input type="text" className="form-control" id="username" placeholder="" autoFocus onChange={this.handleUser}/>
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" className="form-control" id="password" placeholder="" onChange={this.handlePass}/>
              </div>
              <button className="btn btn-primary btn-block mt-5">Sign in</button>
            </form>
          </div>
        </div>
        {/* {this.state.status=='failed'?<h1 className="text-center text-danger">Authentication Failed!</h1>:''} */}
        <SweetAlert
          show={this.state.show}
          title={this.state.popuptext}
          type={this.state.popuptype}
          onConfirm={() => {
            this.setState({ show: false });
          }}
          onEscapeKey={() => {
            this.setState({ delpopup: false })
          }}
        />
      </div> 
    );
  }
}

export default withRouter(Login);
