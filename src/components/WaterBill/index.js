import React, { Component } from 'react';
import {withRouter} from "react-router-dom";
import Navbar from './../Navbar'
import BillList from './BillList'
import Bill from './Bill'
import axios from 'axios'

class WaterBill extends Component {
  constructor(props) {
    super(props)
    this.state = {
      entrys: [],
      buildings: [],
      statuses: [],
    }
  }
  
  componentWillMount() {
    if(localStorage.getItem('session_id')!=1){
      console.log('not logged in')
      this.props.history.push("/login")
    }
    var self = this
    axios.get(`/api/building`)
    .then(function (response) {
      console.log(response.data)
      self.setState({buildings:response.data})
    })
    .catch(function (error) {
      console.log(error);
    });
    axios.get(`/api/billstatus`)
    .then(function (response) {
      console.log(response.data)
      self.setState({statuses:response.data})
    })
    .catch(function (error) {
      console.log(error);
    });
    this.fetchBillList("","","","","","","","","")
  }

  componentWillReceiveProps(nextProps){
    let billid = this.props.match.params
  }

  htmlElement(id) {
    return document.getElementById(id)
  }
  handleBuildingId(event) {
    this.setState({building: event.target.value});
  }
  handleRoom(event) {
    this.setState({position: event.target.value});
  }
  handleBuildingIdSubmit(e) {
    e.preventDefault()
    let building = this.htmlElement("building").value
    let position = this.htmlElement("position").value
    console.log(position)
    this.fetchBillList(building,position)
    }
  handleRoomSubmit(e) {
    e.preventDefault()
    let bname = this.htmlElement("building").value
    let position = this.htmlElement("position").value
    console.log(position)
    this.fetchBillList(bname,position)
  }
  handleSubmit(e) {
    if(e!=null){
      e.preventDefault()
    }
    this.fetchBillList(this.htmlElement("building").value,this.htmlElement("room").value,
      this.htmlElement("floor").value,this.htmlElement("status").value,this.htmlElement("startStart").value,
      this.htmlElement("startEnd").value,this.htmlElement("dueStart").value,this.htmlElement("dueEnd").value,this.htmlElement("paid").value
    )
  }
  handleAllBillButton() {
    this.htmlElement("building").value = ""
    this.htmlElement("room").value = ""
    this.htmlElement("status").value = ""
    this.htmlElement("startStart").value = ""
    this.htmlElement("startEnd").value = ""
    this.htmlElement("dueStart").value = ""
    this.htmlElement("dueEnd").value = ""
    this.htmlElement("floor").value = ""
    this.htmlElement("paid").value = ""
    this.fetchBillList("","","","","","","","","")
  }
  fetchBillList(buildingid,room,floor,statusid,start,startend,due,dueend,paid) {
    var self = this
    axios.get(`/api/bill/water/buildingid/${buildingid!==""?buildingid:"%20"}/roomno/${room!==""?room:"%20"}/floor/${floor!==""?floor:"%20"}/statusid/${statusid!==""?statusid:"%20"}/start/${start!==""?start:"%20"}/startend/${startend!==""?startend:"%20"}/due/${due!==""?due:"%20"}/dueend/${dueend!==""?dueend:"%20"}/paid/${paid!==""?paid:"%20"}`)
    .then(function (response) {
      console.log(response.data)
      self.setState({entrys:response.data})
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  render() {
    let buildings = this.state.buildings
    let statuses = this.state.statuses
    return (
      <div>
        <Navbar history={this.props.history}/>
        <div className="container mt-4">
          <div className="row">
            <div className="col-sm-3">
              <p className="h4">Filter</p>
              <div>
                <button className="btn btn-block" onClick={()=>this.handleAllBillButton()}>All Bills</button>
              </div>
              <form onSubmit={(e)=>this.handleSubmit(e)}>
                <div className="form-row mt-3">
                  <select id="building" className="form-control col" defaultValue="">
                    <option value="">None</option>
                    {buildings.map(entry => (
                      <option key={entry.buildingid} value={entry.buildingid}>{entry.name}</option>
                    ))}
                  </select>
                </div>
              </form>
              <form onSubmit={(e)=>this.handleSubmit(e)}>
                <div className="form-row mt-3">
                  <input id="room" className="form-control col" type="text" placeholder="Room Number"/>
                </div>
              </form>
              <form onSubmit={(e)=>this.handleSubmit(e)}>
                <div className="form-row mt-3">
                  <input id="floor" className="form-control col" type="text" onChange={(e)=>this.handleRoom(e)} placeholder="Floor Number"/>
                </div>
              </form>
              <form onSubmit={(e)=>this.handleSubmit(e)}>
                <div className="form-row mt-3">
                <select id="status" className="form-control col" defaultValue="">
                  <option value="">None</option>
                  {statuses.map(entry => (
                    <option key={entry.statusid} value={entry.statusid}>{entry.name}</option>
                  ))}
                </select>
                {/* <input id="building" className="form-control col-9" type="text" onChange={(e)=>this.handleBuildingId(e)} placeholder="Building name"/> */}
                </div>
              </form>
              <form onSubmit={(e)=>this.handleSubmit(e)}>
                <div className="form-row mt-3">
                  <span className="col-12">Start date</span>
                  <input id="startStart" className="form-control col-6" type="date" placeholder="Start date"/>
                  <input id="startEnd" className="form-control col-6" type="date" placeholder="Due date"/>
                </div>
              </form>
              <form onSubmit={(e)=>this.handleSubmit(e)}>
                <div className="form-row mt-3">
                  <span className="col-12">Due date</span>
                  <input id="dueStart" className="form-control col-6" type="date" placeholder="Due date"/>
                  <input id="dueEnd" className="form-control col-6" type="date" placeholder="Due date"/>
                </div>
              </form>
              <form onSubmit={(e)=>this.handleSubmit(e)}>
                <div className="form-row mt-3">
                  <span className="col-12">Paid date</span>
                  <input id="paid" className="form-control col" type="date" onChange={(e)=>this.handleRoom(e)} placeholder="Paid date"/>
                </div>
              </form>
              <button onClick={()=>this.handleSubmit()} className="btn col">Go</button>
            </div>
            <div className="col-sm-9">
              <button className="btn btn-success float-right">Add</button>
              {this.props.match.params.id?
                <Bill billid={this.props.match.params.id}/>
              :<BillList entrys={this.state.entrys} history={this.props.history}/>}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(WaterBill);
