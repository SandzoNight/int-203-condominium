import React, { Component } from 'react';
import socket from './../../lib/withSocket'
import {withRouter} from "react-router-dom";

class OwnerList extends Component {
  handleOnSelectOwner(ownerid) {
    this.props.history.push(`/owner/${ownerid}`)
  }
  render() {
    let entrys = this.props.entrys
    let i = 1
    return (
      <table className="table table-hover">
        <thead>
          <tr>
            <th>#</th>
            <th>Citizen id</th>
            <th>First name</th>
            <th>Last name</th>
            <th>Tel no</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {entrys.map(entry => (
            <tr className="clickable" key={entry.ownerid} onClick={(ownerid)=>this.handleOnSelectOwner(entry.ownerid)}>
              <td>{i++})</td>
              <td>{entry.citizenid}</td>
              <td>{entry.fname}</td>
              <td>{entry.lname}</td>
              <td>{entry.telno}</td>
              <td>{entry.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

export default withRouter(OwnerList);
