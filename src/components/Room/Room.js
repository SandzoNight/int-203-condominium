import React, { Component } from 'react';
import socket from './../../lib/withSocket'
import {withRouter} from "react-router-dom";
import axios from 'axios'

class Own extends Component {
  constructor(props) {
    super(props)
    this.state = {
      entry:{},
      rooms:[],
      owners:[],
      owner:"",
      editing: false
    }
  }
  componentWillMount() {
    this.fetchRoom()
    this.fetchOwner()
  }
  fetchOwner() {
    var self = this
    axios.get(`/api/owner`)
    .then(function (response) {
      self.setState({owners:response.data})
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  fetchRoom() {
    var self = this
    axios.get(`/api/room/roomid/${this.props.match.params.roomid}`)
    .then(function (response) {
      self.setState({entry:response.data})
      self.setState({owner:response.data.ownerid?response.data.ownerid:""})
      console.log(response.data)
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  handleBack() {
    this.props.history.push(`/room/building/${this.state.entry.buildingid}`)
  }
  handleEdit() {
    this.setState({
      editing: true
    })
  }
  handleSave() {
    this.setState({
      editing: false
    })
    var self = this
    axios.post(`/api/room/roomid/${self.state.entry.roomid}/ownerid/${self.state.owner==""?"%20":self.state.owner}`)
    .then(function (response) {
      console.log(response)
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  handleCancel() {
    this.setState({
      editing: false,
      owner: this.state.entry.ownerid?this.state.entry.ownerid:""
    })
  }
  render() {
    let room = this.state.entry
    let editing = this.state.editing
    let owners = this.state.owners
    let ownerid = this.state.owner
    console.log(ownerid)
    return (
      <div>
        <div className="row">
          <div className="col-12 text-right">
            <button className="btn btn-info" onClick={()=>this.handleBack()}>{"<"} Back</button>
            <button className="btn btn-warning" onClick={()=>this.handleEdit()}>Edit owner</button>
          </div>
        </div>
        <div className="row">
          <h3 className="col-12">Room details</h3>
          <dt className="col-3">Room ID:</dt>
          <dd className="col-9">{room.roomid}</dd>
          <dt className="col-3">Room No.:</dt>
          <dd className="col-9">{room.roomNum}</dd>
          <dt className="col-3">Floor:</dt>
          <dd className="col-9">{room.floorNum}</dd>
          <dt className="col-3">Lock Pin:</dt>
          <dd className="col-9">{room.password}</dd>
          <dt className="col-3">Size:</dt>
          <dd className="col-9">{room.size}</dd>
          <dt className="col-3">Owned by:</dt>
          {editing?
            <select className="col-9" onChange={(e)=>this.setState({owner:e.target.value})} defaultValue={ownerid==null?"":ownerid}>
            <option value="">None</option>
              {owners.map(entry => (
              <option value={entry.ownerid} key={entry.ownerid}>[{entry.ownerid}] {entry.fname} {entry.lname}</option>
              ))}
            </select>
          :
          <dd className="col-9">{room.ownerid==null?`-`:`[${room.ownerid}] ${room.fname} ${room.lname}`}</dd>}
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

export default withRouter(Own);
