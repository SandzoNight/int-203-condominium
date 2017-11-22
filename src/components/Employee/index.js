import React, { Component } from 'react';
import socket from './../../lib/withSocket'
import {withRouter} from "react-router-dom";
import Navbar from './../Navbar'
import EmployeeList from './EmployeeList'
import axios from 'axios'

class Employee extends Component {
  constructor(props) {
    super(props)
    this.state = {
      entrys: []
    }
  }
  
  componentWillMount() {
    if(localStorage.getItem('session_id')!=1){
      console.log('not logged in')
      this.props.history.push("/login")
    }
    this.fetchAll()
  }

  htmlElement(id) {
    return document.getElementById(id)
  }
  handleBuildingId(event) {
    this.setState({buildingid: event.target.value});
  }
  handlePosition(event) {
    this.setState({position: event.target.value});
  }
  handleBuildingIdSubmit() {
    let buildingid = this.htmlElement("buildingid").value
    console.log(buildingid)
    if(buildingid=="")
      this.fetchAll()
    else
      this.fetchBuilding(buildingid)
  }
  handlePositionSubmit() {
    // let buildingid = this.htmlElement("buildingid").value
    // console.log(buildingid)
    // if(buildingid=="")
    //   this.fetchAll()
    // else
    //   this.fetchBuilding(buildingid)
  }
  handleAllEmpButton() {
    //unfinish
    let buildingid = this.htmlElement("buildingid").value
    let position = this.htmlElement("position").value
    if(buildingid!=="")
      this.htmlElement("buildingid").value = ""
    if(position!=="")
      this.htmlElement("position").value = ""
    this.fetchAll()
  }
  fetchAll() {
    var self = this
    axios.get(`/api/employee`)
    .then(function (response) {
      console.log(response.data)
      self.setState({entrys:response.data})
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  fetchBuilding(bid) {
    var self = this
    axios.get(`/api/employee/buildingid/${bid}`)
    .then(function (response) {
      console.log(response.data)
      self.setState({entrys:response.data})
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  render() {
    return (
      <div>
        <Navbar history={this.props.history}/>
        <div className="container mt-4">
          <div className="row">
            <div className="col-sm-3">
              <div>
                <button className="btn btn-block" onClick={()=>this.handleAllEmpButton()}>All Employees</button>
              </div>
              <div className="form-row mt-3">
                <input id="buildingid" className="form-control col-9" type="text" onChange={(e)=>this.handleBuildingId(e)} placeholder="Building ID"/>
                <button className="btn col" onClick={()=>this.handleBuildingIdSubmit()}>Go</button>
              </div>
              <div className="form-row mt-3">
                <input id="position" className="form-control col-9" type="text" onChange={(e)=>this.handlePosition(e)} placeholder="Position"/>
                <button className="btn col" onClick={()=>this.handlePositionSubmit()}>Go</button>
              </div>
            </div>
            <div className="col-sm-9">
              <EmployeeList entrys={this.state.entrys}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Employee);
