import React, { Component } from 'react';
import socket from './../../lib/withSocket'
import {withRouter} from "react-router-dom";
import axios from 'axios'

class Own extends Component {
  constructor(props) {
    super(props)
    this.state = {
      entry:{},
      rooms:[]
    }
  }
  componentWillMount() {
    this.fetchOwner()
  }
  fetchOwner() {
    var self = this
    axios.get(`/api/owner/ownerid/${this.props.ownerid}`)
    .then(function (response) {
      self.setState({entry:response.data})
    })
    .catch(function (error) {
      console.log(error);
    });
    axios.get(`/api/owner/ownedroom/ownerid/${this.props.ownerid}`)
    .then(function (response) {
      self.setState({rooms:response.data})
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  handleBack() {
    this.props.history.push("/owner")
  }
  render() {
    let owner = this.state.entry
    let rooms = this.state.rooms
    return (
      <div>
        <div className="row">
          <div className="col-12 text-right">
            <button className="btn btn-info" onClick={()=>this.handleBack()}>{"<"} Back</button>
          </div>
        </div>
        <div className="row">
          <h3 className="col-12">Personal details</h3>
          <dt className="col-3">Owner ID:</dt>
          <dd className="col-9">{owner.ownerid}</dd>
          <dt className="col-3">Name:</dt>
          <dd className="col-9">{owner.fname} {owner.lname}</dd>
          <dt className="col-3">Citizen ID:</dt>
          <dd className="col-9">{owner.citizenid}</dd>
          <dt className="col-3">Address:</dt>
          <dd className="col-9">{owner.address} {owner.tumbol} {owner.amphoe} {owner.province} {owner.postcode} {owner.country}</dd>
          <dt className="col-3">Telno:</dt>
          <dd className="col-9">{owner.telno}</dd>
          <dt className="col-3">Email:</dt>
          <dd className="col-9">{owner.email}</dd>
          <h3 className="col-12">Condo details</h3>
          <dt className="col-12">Owned room:</dt>
          <table className="col-12 table table-sm text-center">
            <thead>
              <th>Room No.</th>
              <th>Building</th>
            </thead>
          {rooms.length==0?"-":rooms.map(entry => (
            <tr key={entry.roomNum+entry.building}>
              <td>{entry.roomNum}</td>
              <td>{entry.building}</td>
            </tr>
          ))}
          </table>
        </div>
      </div>
    );
  }
}

export default withRouter(Own);
