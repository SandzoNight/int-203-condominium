import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

class Navbar extends Component {
  constructor(props) {
    super(props)
    this.handleSignOut = this.handleSignOut.bind(this)
  }

  handleSignOut() {
    localStorage.setItem('session_id',0)
    this.props.history.push('/login')
  }

  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="#">FTBCondo</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/dashboard">Dashboard</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/room">Rooms</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/building">Buildings</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/owner">Owners</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/bill">Bills</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/employee">Employees</Link>
            </li>
          </ul>
            <button className="btn btn-outline-success my-2 my-sm-0" onClick={this.handleSignOut}>Sign out</button>
        </div>
      </nav>
    );
  }
}

export default Navbar
