import React, { Component } from 'react';
import socket from './../../lib/withSocket'
import {withRouter} from "react-router-dom";
import Navbar from './../Navbar'
import axios from 'axios'
import RoomList from './RoomList'
import Room from './Room'

class Rooms extends Component {
  constructor(props) {
    super(props)
    this.state = {
      building:{},
      rooms:[]
    }
  }
  componentWillMount() {
    let self = this
    axios.get(`/api/building/buildingid/${this.props.match.params.building}`)
    .then(function (response) {
      console.log(response.data)
      self.setState({building:response.data})
    })
    .catch(function (error) {
      console.log(error);
    });
    this.fetchRoom("","","")
  }
  fetchRoom(roomno,floor,status) {
    console.log('fetch')
    let self = this
    roomno = roomno==""?"%20":roomno
    floor = floor==""?"%20":floor
    status = status==""?"%20":status
    axios.get(`/api/room/buildingid/${this.props.match.params.building}/roomno/${roomno}/floor/${floor}/status/${status}`)
    .then(function (response) {
      console.log(response.data)
      self.setState({rooms:response.data})
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  htmlElement(id) {
    return document.getElementById(id)
  }
  handleAllRoomButton() {
    this.fetchRoom("","","")
    this.htmlElement("room").value = ""
    this.htmlElement("floor").value = ""
    this.htmlElement("status").value = ""
  }
  handleSubmit(e) {
    e.preventDefault()
    let roomno = this.htmlElement("room").value
    let floor = this.htmlElement("floor").value
    let status = this.htmlElement("status").value
    this.fetchRoom(roomno,floor,status)
  }
  render() {
    let entrys = this.props.entrys
    return (
      <div>
        <Navbar history={this.props.history}/>
        <div className="container mt-4">
          <div className="row">
            <div className="col-12">
              <h2>Rooms</h2>
              <h3>{this.state.building.name}</h3>
              <hr/>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-3">
              <p className="h4">Filter</p>
              <div>
                <button className="btn btn-block" onClick={()=>this.handleAllRoomButton()}>All Rooms</button>
              </div>
              <form onSubmit={(e)=>this.handleSubmit(e)}>
                <div className="form-row mt-3">
                  <input id="floor" className="form-control col" type="text" placeholder="Floor Number"/>
                </div>
                <div className="form-row mt-3">
                  <input id="room" className="form-control col" type="text" placeholder="Room Number"/>
                </div>
                <div className="form-row mt-3">
                  <span className="col-12">Status</span>
                  <select id="status" className="form-control col" defaultValue="">
                    <option value="">None</option>
                    <option value="hasowner">Has owner</option>
                    <option value="noowner">No owner</option>
                  </select>
                </div>
                <button type="submit" className="btn col">Go</button>
              </form>
            </div>
            <div className="col-sm-9">
              <button className="btn btn-success float-right">Add</button>
              {this.props.match.params.roomid?
                <Room roomid={this.props.match.params.roomid}/>
              :<RoomList buildingid={this.state.building.buildingid} entrys={this.state.rooms} history={this.props.history}/>}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Rooms);
