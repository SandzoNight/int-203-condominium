import React, { Component } from 'react';
import socket from './../../lib/withSocket'
import {withRouter} from "react-router-dom";
import axios from 'axios'

class Bill extends Component {
  constructor(props) {
    super(props)
    this.state = {
      entry:{},
      statuses:[],
      editing:false,
      billid: "",
      roomNum: "",
      waterused: "",
      totalcost: "",
      startdate: "",
      duedate: "",
      paiddate: "",
      status: ""
    }
  }
  componentWillMount() {
    let self = this
    axios.get(`/api/billstatus`)
    .then(function (response) {
      self.setState({statuses:response.data})
    })
    .catch(function (error) {
      console.log(error)
    });
    this.fetchBill()
  }
  fetchBill() {
    var self = this
    axios.get(`/api/bill/maintenance/billid/${this.props.billid}`)
    .then(function (response) {
      self.setState({
        entry:response.data,
        billid: response.data.billid,
        roomNum: response.data.roomNum,
        waterused: response.data.waterused,
        totalcost: response.data.totalcost,
        startdate: response.data.startdate,
        duedate: response.data.duedate,
        paiddate: response.data.paiddate,
        status: response.data.billstatusid
      })
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  handleBillid(e) {
    this.setState({
      billid:e.target.value
    })
  }
  handleRoomNum(e) {
    this.setState({
      roomNum:e.target.value
    })
  }
  handleWaterused(e) {
    this.setState({
      waterused:e.target.value
    })
  }
  handleTotalcost(e) {
    this.setState({
      totalcost:e.target.value
    })
  }
  handleStartdate(e) {
    this.setState({
      startdate:e.target.value
    })
  }
  handleDuedate(e) {
    this.setState({
      duedate:e.target.value
    })
  }
  handlePaiddate(e) {
    this.setState({
      paiddate:e.target.value
    })
  }
  handleStatus(e) {
    this.setState({
      status:e.target.value
    })
  }
  handleBack() {
    this.props.history.push("/bill/maintenance")
  }
  handleEdit() {
    this.setState({
      editing:true
    })
  }
  handleCancel() {
    this.setState({
      editing:false,
      billid: this.state.entry.billid,
      roomNum: this.state.entry.roomNum,
      waterused: this.state.entry.waterused,
      totalcost: this.state.entry.totalcost,
      startdate: this.state.entry.startdate,
      duedate: this.state.entry.duedate,
      paiddate: this.state.entry.paiddate,
      status: this.state.entry.billstatusid
    })
    this.htmlElement("billstatus").value = this.state.entry.billstatusid
  }
  handleSave() {
    this.setState({
      editing:false
    })
    var self = this
    axios.post(`/api/bill/water/billid/${this.state.billid}/paiddate/${this.state.paiddate!==""?this.state.paiddate:" "}/statusid/${this.state.status}`)
    .then(function (response) {
      console.log(response)
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  htmlElement(id) {
    return document.getElementById(id)
  }
  render() {
    let bill = this.state.entry
    let editing = this.state.editing
    let statuses = this.state.statuses
    return (
      <div>
        <div className="row">
          <div className="col-12 text-right">
            <button className="btn btn-info" onClick={()=>this.handleBack()}>{"<"} Back</button>
            <button disabled={editing} className="btn btn-warning" onClick={()=>this.handleEdit()}>Edit</button>
          </div>
        </div>
        <div className="row mt-4">
          <dt className="col-3">Bill ID:</dt>
          <input disabled={true} type="text" className="form-control col-9" value={this.state.billid} onChange={(e)=>this.handleBillid(e)}/>
          <dt className="col-3">Room No:</dt>
          <input disabled={true} type="text" className="form-control col-9" value={this.state.roomNum} onChange={(e)=>this.handleRoomNum(e)}/>
          <dt className="col-3">Used unit:</dt>
          <input disabled={true} type="text" className="form-control col-7" value={this.state.waterused} onChange={(e)=>this.handleWaterused(e)}/>
          <p className="col-2">{`/ ${bill.waterrate?bill.waterrate:'-'} บาท`}</p>
          <dt className="col-3">Total cost:</dt>
          <input disabled={true} type="text" className="form-control col-9" value={this.state.totalcost} onChange={(e)=>this.handleTotalcost(e)}/>
          <dt className="col-3">Start date:</dt>
          <input disabled={true} type="date" className="form-control col-9" value={this.state.startdate} onChange={(e)=>this.handleStartdate(e)}/>
          <dt className="col-3">Due date:</dt>
          <input disabled={true} type="date" className="form-control col-9" value={this.state.duedate} onChange={(e)=>this.handleDueDate(e)}/>
          <dt className="col-3">Paid date:</dt>
          <input disabled={!editing} type="date" className="form-control col-9"  value={this.state.paiddate} onChange={(e)=>this.handlePaiddate(e)}/>
          <dt className="col-3">Status:</dt>
          <select disabled={!editing} id="billstatus" className="form-control col-9" value={this.state.status} onChange={(e)=>this.handleStatus(e)}>
            {statuses.map(entry => (
              <option key={entry.statusid} value={entry.statusid}>{entry.name}</option>
            ))}
          </select>
        </div>
        <div className="row mt-4">
          <div className="col-12 text-center">
            <button disabled={!editing} className="btn btn-success" onClick={()=>this.handleSave()}>Save</button>
            <button disabled={!editing} className="btn" onClick={()=>this.handleCancel()}>Cancel</button>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Bill);
