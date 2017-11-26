import React, { Component } from 'react';
import socket from './../../lib/withSocket'
import {withRouter} from "react-router-dom";
import Navbar from './../Navbar'
import EmployeeList from './EmployeeList'
import Emp from './Emp'
import axios from 'axios'
import SweetAlert from 'sweetalert-react';

class AddEmp extends Component {
  constructor(props) {
    super(props)
    this.state = {
      entrys: [],
      positions:[],
      buildings:[],
      popup: false,
    }
  }
  componentWillMount() {
    if(localStorage.getItem('session_id')!=1){
      console.log('not logged in')
      this.props.history.push("/login")
    }
    this.fetchBuilding()
    this.fetchPosition()
  }
  fetchPosition() {
    let self = this
    axios.get(`/api/position`)
    .then(function (response) {
      console.log(response.data)
      self.setState({positions:response.data})
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  fetchBuilding() {
    let self = this
    axios.get(`/api/building`)
    .then(function (response) {
      console.log(response.data)
      self.setState({buildings:response.data})
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  htmlElement(id) {
    return document.getElementById(id)
  }
  handleSubmit(e) {
    e.preventDefault()
    let self = this
    let fname = this.htmlElement("fname").value
    let lname = this.htmlElement("lname").value
    let citizenid = this.htmlElement("citizenid").value
    let telno = this.htmlElement("telno").value
    let email = this.htmlElement("email").value
    let salary = this.htmlElement("salary").value
    let address = this.htmlElement("address").value
    let tumbol = this.htmlElement("tumbol").value
    let amphoe = this.htmlElement("amphoe").value
    let province = this.htmlElement("province").value
    let country = this.htmlElement("country").value
    let postcode = this.htmlElement("postcode").value
    let positionid = this.htmlElement("positionid").value
    let buildingid = this.htmlElement("buildingid").value
    axios.put(`/api/employee/add/${fname}/${lname}/${citizenid}/${telno}
    /${email}/${salary}/${address}/${tumbol}/${amphoe}/${province}/${country}/${postcode}
    /${positionid}/${buildingid==""?'%20':buildingid}`)
    .then(function (response) {
      console.log(response.data)
      self.setState({popup:true})
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  handleConfirmPopup() {
    this.props.history.push("/employee")
  }
  handleBackButton() {
    this.props.history.push("/employee")
  }
  
  render() {
    let buildings = this.state.buildings
    let positions = this.state.positions
    return (
      <div>
        <Navbar history={this.props.history}/>
        <div className="container mt-4">
          <div className="row">
            <div className="col-10">
              <h2>Add Employee</h2>
            </div>
            <div className="col-2">
              <button className="btn btn-info" onClick={()=>this.handleBackButton()}>{'<'} Back</button>
            </div>
          </div>
          <hr/>
          <div className="container">
            <form>
            <div className="row">
              <div className="col-6">
                <h4>Personal Details</h4>
                <div className="form-group row">
                  <label  className="col-sm-3 col-form-label">First name:</label>
                  <div className="col-sm-9">
                    <input type="text" className="form-control" id="fname"/>
                  </div>
                </div>
                <div className="form-group row">
                  <label  className="col-sm-3 col-form-label">Last name:</label>
                  <div className="col-sm-9">
                    <input type="text" className="form-control" id="lname"/>
                  </div>
                </div>
                <div className="form-group row">
                  <label  className="col-sm-3 col-form-label">Citizen ID:</label>
                  <div className="col-sm-9">
                    <input type="text" className="form-control" id="citizenid"/>
                  </div>
                </div>
                <h4>Address Details</h4>
                <div className="form-group row">
                  <label  className="col-sm-3 col-form-label">Address:</label>
                  <div className="col-sm-9">
                    <input type="text" className="form-control" id="address" placeholder="ex. house no. / street"/>
                  </div>
                </div>
                <div className="form-group row">
                  <label  className="col-sm-3 col-form-label">Tumbol:</label>
                  <div className="col-sm-9">
                    <input type="text" className="form-control" id="tumbol"/>
                  </div>
                </div>
                <div className="form-group row">
                  <label  className="col-sm-3 col-form-label">Amphoe:</label>
                  <div className="col-sm-9">
                    <input type="text" className="form-control" id="amphoe"/>
                  </div>
                </div>
                <div className="form-group row">
                  <label  className="col-sm-3 col-form-label">Province:</label>
                  <div className="col-sm-9">
                    <input type="text" className="form-control" id="province"/>
                  </div>
                </div>
                <div className="form-group row">
                  <label  className="col-sm-3 col-form-label">Postcode:</label>
                  <div className="col-sm-9">
                    <input type="text" className="form-control" id="postcode"/>
                  </div>
                </div>
                <div className="form-group row">
                  <label  className="col-sm-3 col-form-label">Country:</label>
                  <div className="col-sm-9">
                    <input type="text" className="form-control" id="country"/>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <h4>Contact Details</h4>
                <div className="form-group row">
                  <label  className="col-sm-3 col-form-label">Email:</label>
                  <div className="col-sm-9">
                    <input type="email" className="form-control" id="email"/>
                  </div>
                </div>
                <div className="form-group row">
                  <label  className="col-sm-3 col-form-label">Tel no.:</label>
                  <div className="col-sm-9">
                    <input type="text" className="form-control" id="telno"/>
                  </div>
                </div>
                <h4>Employ Details</h4>
                <div className="form-group row">
                  <label  className="col-sm-3 col-form-label">Building:</label>
                  <div className="col-sm-9">
                    <select className="form-control" id="buildingid">
                     <option value="">None</option>
                    {buildings.map(entry=>(
                      <option key={entry.buildingid} value={entry.buildingid}>{entry.name}</option>
                    ))}
                    </select>
                  </div>
                </div>
                <div className="form-group row">
                  <label  className="col-sm-3 col-form-label">Position:</label>
                  <div className="col-sm-9">
                    <select className="form-control" id="positionid">
                    {positions.map(entry=>(
                      <option key={entry.positionid} value={entry.positionid}>{entry.name}</option>
                    ))}
                    </select>
                  </div>
                </div>
                <div className="form-group row">
                  <label  className="col-sm-3 col-form-label">Salary:</label>
                  <div className="col-sm-9">
                    <input type="number" className="form-control" id="salary"/>
                  </div>
                </div>
                <div className="form-group row">
                  <div className="col-6">
                    <button type="submit" className="btn btn-success btn-block" onClick={(e)=>this.handleSubmit(e)}>Confirm</button>
                  </div>
                  <div className="col-6">
                    <button type="reset" className="btn btn-block">Reset</button>
                  </div>
                </div>
              </div>
            </div>
            </form>
          </div>
        </div>
        <SweetAlert
          show={this.state.popup}
          title="Employee Added"
          type="success"
          text="Adding Succesful"
          onConfirm={() => {
            console.log('confirm');
            this.setState({ popup: false });
            this.handleConfirmPopup()
          }}
          onEscapeKey={() => {
            this.setState({ popup: false })
            this.handleConfirmPopup()
          }}
          onOutsideClick={() => {
            this.setState({ popup: false })
          }}
        />
      </div>
    );
  }
}

export default withRouter(AddEmp);
