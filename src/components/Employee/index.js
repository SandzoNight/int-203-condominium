import React, { Component } from 'react';
import socket from './../../lib/withSocket'
import {withRouter} from "react-router-dom";
import Navbar from './../Navbar'
import EmployeeList from './EmployeeList'
import Emp from './Emp'
import axios from 'axios'

class Employee extends Component {
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
    this.fetchEmpList("","")
  }

  componentWillReceiveProps(nextProps){
    let empid = this.props.match.params
  }

  htmlElement(id) {
    return document.getElementById(id)
  }
  handleBuildingId(event) {
    this.setState({building: event.target.value});
  }
  handlePosition(event) {
    this.setState({position: event.target.value});
  }
  handleBuildingIdSubmit(e) {
    e.preventDefault()
    let building = this.htmlElement("building").value
    let position = this.htmlElement("position").value
    console.log(position)
    this.fetchEmpList(building,position)
    }
    handlePositionSubmit(e) {
      e.preventDefault()
      let building = this.htmlElement("building").value
      let position = this.htmlElement("position").value
      console.log(position)
      this.fetchEmpList(building,position)
  }
  handleAllEmpButton() {
    let building = this.htmlElement("building").value
    let position = this.htmlElement("position").value
    if(building!=="")
      this.htmlElement("building").value = ""
    if(position!=="")
      this.htmlElement("position").value = ""
      this.fetchEmpList("","")
  }
  fetchEmpList(bname,pname) {
    console.log('fetch both')
    var self = this
    axios.get(`/api/employee/buildingname/${bname!==""?bname:"%20"}/positionname/${pname!==""?pname:"%20"}`)
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
              <p className="h4">Filter</p>
              <div>
                <button className="btn btn-block" onClick={()=>this.handleAllEmpButton()}>All Employees</button>
              </div>
              <form onSubmit={(e)=>this.handleBuildingIdSubmit(e)}>
                <div className="form-row mt-3">
                  <input id="building" className="form-control col-9" type="text" onChange={(e)=>this.handleBuildingId(e)} placeholder="Building name"/>
                  <button type="submit" className="btn col">Go</button>
                </div>
              </form>
              <form onSubmit={(e)=>this.handlePositionSubmit(e)}>
                <div className="form-row mt-3">
                  <input id="position" className="form-control col-9" type="text" onChange={(e)=>this.handlePosition(e)} placeholder="Position"/>
                  <button type="submit" className="btn col">Go</button>
                </div>
              </form>
            </div>
            <div className="col-sm-9">
              {this.props.match.params.id?
                <Emp empid={this.props.match.params.id}/>
              :<EmployeeList entrys={this.state.entrys} history={this.props.history}/>}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Employee);
