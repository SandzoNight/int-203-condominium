import React, { Component } from 'react';
import socket from './../../lib/withSocket'
import {withRouter} from "react-router-dom";
import axios from 'axios'
import SweetAlert from 'sweetalert-react';

class Emp extends Component {
  constructor(props) {
    super(props)
    this.state = {
      entry:{},
      deletePopupType: "warning",
      delpopup: false,
      popuptext: "Are you sure you want to delete this?"
    }
  }
  componentWillMount() {
    this.fetchEmp()
  }
  fetchEmp() {
    var self = this
    axios.get(`/api/employee/empid/${this.props.empid}`)
    .then(function (response) {
      self.setState({entry:response.data})
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  handleBack() {
    this.props.history.push("/employee")
  }
  handleDeletePopup() {
    let self = this
    axios.delete(`/api/employee/empid/${this.props.empid}`)
    .then(function (response) {
      console.log(response.data)
      self.setState({
        deletePopupType: "success",
      })
      setTimeout(() => {
        self.setState({
          delpopup:false
        })
        self.props.history.push("/employee")
      }, 1500);
    })
    .catch(function (error) {
      self.setState({
        deletePopupType: "error",
        popuptext: "Error !!"
      })
      console.log(error);
    });
  }
  handleDeleteButton() {
    this.setState({
      delpopup: true
    })
  }
  render() {
    let emp = this.state.entry
    return (
      <div>
        <div className="row">
          <div className="col-12 text-right">
            <button className="btn btn-info" onClick={()=>this.handleBack()}>{"<"} Back</button> 
            <button className="btn btn-danger" onClick={()=>this.handleDeleteButton()}>Delete</button>
          </div>
        </div>
        <div className="row">
          <dt className="col-3">Employee ID:</dt>
          <dd className="col-9">{emp.empid}</dd>
          <dt className="col-3">Name:</dt>
          <dd className="col-9">{emp.fname} {emp.lname}</dd>
          <dt className="col-3">Citizen ID:</dt>
          <dd className="col-9">{emp.citizenid}</dd>
          <dt className="col-3">Address:</dt>
          <dd className="col-9">{emp.address} {emp.tumbol} {emp.amphoe} {emp.province} {emp.postcode} {emp.country}</dd>
          <dt className="col-3">Telno:</dt>
          <dd className="col-9">{emp.telno}</dd>
          <dt className="col-3">Email:</dt>
          <dd className="col-9">{emp.email}</dd>
          <dt className="col-3">Position:</dt>
          <dd className="col-9">{emp.position?emp.position:`-`}</dd>
          <dt className="col-3">Salary:</dt>
          <dd className="col-9">{emp.salary}</dd>
          <dt className="col-3">Responsible Building:</dt>
          <dd className="col-9">{emp.building?emp.building:`-`}</dd>
        </div>
        <SweetAlert
          show={this.state.delpopup}
          title="Confirm"
          type={this.state.deletePopupType}
          showCancelButton
          text={this.state.popuptext}
          onConfirm={() => {
            console.log('confirm');
            // this.setState({ delpopup: false });
            this.handleDeletePopup()
          }}
          onEscapeKey={() => {
            this.setState({ delpopup: false })
          }}
          onCancel={() => {
            this.setState({delpopup: false})
          }}
        />
      </div>
    );
  }
}

export default withRouter(Emp);
