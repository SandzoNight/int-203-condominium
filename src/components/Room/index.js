import React, { Component } from 'react';
import socket from './../../lib/withSocket'
import {withRouter} from "react-router-dom";
import Navbar from './../Navbar'
import axios from 'axios'

class Room extends Component {
  constructor(props) {
    super(props)
    this.state = {
      entrys: [],
    }
  }
  
  componentWillMount() {
    if(localStorage.getItem('session_id')!=1){
      console.log('not logged in')
      this.props.history.push("/login")
    }
    this.fetchBuildingList()
  }

  htmlElement(id) {
    return document.getElementById(id)
  }

  fetchBuildingList() {
    console.log('fetch both')
    var self = this
    axios.get(`/api/building`)
    .then(function (response) {
      console.log(response.data)
      self.setState({entrys:response.data})
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  handleSelect(e) {
    this.props.history.push(`/room/building/${e.target.value}`)
  }

  render() {
    let entrys = this.state.entrys
    return (
      <div>
        <Navbar history={this.props.history}/>
        <div className="container mt-4">
          <div className="row">
            <div className="col-10">
              <h2>Rooms</h2>
              <h3>Select building</h3>
            </div>
            <div className="col-2">
              <button className="btn btn-success float-right">+ Add new building</button>
            </div>
          </div>
          <hr/>
          <div className="row">
            {entrys.map(entry => (
            <div className="col-3" key={entry.buildingid}>
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title">{entry.name}</h4>
                  <button value={entry.buildingid} onClick={(e)=>this.handleSelect(e)} className="btn btn-primary float-right">Select</button>
                </div>
              </div>
            </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Room);
