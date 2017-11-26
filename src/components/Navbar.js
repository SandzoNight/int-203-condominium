import React, { Component } from 'react';
import {
  Router,
  Route,
  Link
} from 'react-router-dom'
import axios from 'axios'

class Navbar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      setting: {}
    }
    this.handleSignOut = this.handleSignOut.bind(this)
  }

  handleSignOut() {
    localStorage.setItem('session_id',0)
    this.props.history.push('/login')
  }

  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="#">Menu</a>
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
              <Link className="nav-link" to="/room">Buildings</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/owner">Owners</Link>
            </li>
            <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Bills
            </a>
            <div className="dropdown-menu" aria-labelledby="navbarDropdown">
              <a className="dropdown-item" href="/bill/water">Water bills</a>
              <a className="dropdown-item" href="/bill/maintenance">Maintenance bills</a>
            </div>
          </li>
            <li className="nav-item">
              <Link className="nav-link" to="/employee">Employees</Link>
            </li>
          </ul>
            <button className="btn btn-outline-danger my-2 my-sm-0" onClick={this.handleSignOut}>Sign out</button>
        </div>
      </nav>
    );
  }
}

export default Navbar
