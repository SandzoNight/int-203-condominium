import React, { Component } from 'react';
import socket from './../../lib/withSocket'
import {withRouter} from "react-router-dom";
import axios from 'axios'
import moment from 'moment'

class Bill extends Component {
  constructor(props) {
    super(props)
    this.state = {
      entry:{},
      statuses:[],
      editing:false,
      billid: "",
      roomNum: "",
      cost: "",
      chargecost: "",
      totalcost: "",
      chargerate: "",
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
  componentDidMount() {
    
  }
  fetchBill() {
    var self = this
    axios.get(`/api/bill/maintenance/billid/${this.props.billid}`)
    .then(function (response) {
      self.setState({
        entry:response.data,
        billid: response.data.billid,
        roomNum: response.data.roomNum,
        cost: response.data.cost,
        totalcost: response.data.totalcost,
        chargecost: response.data.chargecost,
        chargerate: response.data.chargerate,
        startdate: response.data.startdate,
        duedate: response.data.duedate,
        paiddate: response.data.paiddate?response.data.paiddate:"",
        status: response.data.billstatusid
      })
      if(!self.state.paiddate)
        self.changeChargeCost(self.state.paiddate)
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  changeChargeCost(paiddate) {
    console.log("change charge cost")
    if(paiddate){
      // let a = moment().format("YYYY-MM-DD").split("-")
      let cost = this.state.cost
      let chargecost = this.state.chargecost
      let chargerate = this.state.chargerate
      let a = paiddate.split("-")
      let b = this.state.duedate.split("-")
      let nowdate = moment([a[0],a[1],a[2]])
      let duedate = moment([b[0],b[1],b[2]])
      let diff = nowdate.diff(b,'days')
      console.log("chargecost calculated")
      chargecost = diff*chargerate
      this.setState({
        chargecost: chargecost,
        totalcost: chargecost+cost
      })
      // this.setState({
      //   totalcost: chargecost+this.state.cost
      // })
    }
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
    console.log(e.target.value)
    this.changeChargeCost(e.target.value)
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
      cost: this.state.entry.cost,
      totalcost: this.state.entry.totalcost?this.state.entry.totalcost:"--Please Select Paid date to calculate charge cost--",
      chargecost: this.state.entry.chargecost?this.state.entry.chargecost:"--Please Select Paid date to calculate total cost--",
      chargerate: this.state.entry.chargerate,
      startdate: this.state.entry.startdate,
      duedate: this.state.entry.duedate,
      paiddate: this.state.entry.paiddate?this.state.entry.paiddate:"",
      status: this.state.entry.billstatusid
    })
    console.log(this.state.paiddate)
    this.htmlElement("paiddate").value = this.state.entry.paiddate?this.state.entry.paiddate:""
  }
  handleSave() {
    this.setState({
      editing:false
    })
    var self = this
    axios.post(`/api/bill/maintenance/billid/${this.state.billid}/paiddate/${this.state.paiddate!==""?this.state.paiddate:" "}/statusid/${this.state.status}/chargecost/${this.state.chargecost}/totalcost/${this.state.totalcost}`)
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
          <dt className="col-3">Cost:</dt>
          <input disabled={true} type="text" className="form-control col-9" value={this.state.cost} onChange={(e)=>this.handleWaterused(e)}/>
          <dt className="col-3">Charge Cost:</dt>
          <input disabled={true} type="text" className="form-control col-9" value={this.state.chargecost?this.state.chargecost:"--Please select Paid date to calculate charge cost--"} onChange={(e)=>this.handleWaterused(e)}/>
          <dt className="col-3">Total cost:</dt>
          <input disabled={true} type="text" className="form-control col-9" value={this.state.totalcost?this.state.totalcost:"--Please select Paid date to calculate charge cost--"} onChange={(e)=>this.handleTotalcost(e)}/>
          <dt className="col-3">Start date:</dt>
          <input disabled={true} type="date" className="form-control col-9" value={this.state.startdate} onChange={(e)=>this.handleStartdate(e)}/>
          <dt className="col-3">Due date:</dt>
          <input disabled={true} type="date" className="form-control col-9" value={this.state.duedate} onChange={(e)=>this.handleDueDate(e)}/>
          <dt className="col-3">Paid date:</dt>
          <input disabled={!editing} id="paiddate" type="date" className="form-control col-9"  value={this.state.paiddate?this.state.paiddate:""} onChange={(e)=>this.handlePaiddate(e)}/>
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
