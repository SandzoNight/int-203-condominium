import React, { Component } from 'react';
import socket from './../../lib/withSocket'
import {withRouter} from "react-router-dom";

class OwnerList extends Component {
  handleOnSelectRoom(roomid) {
    this.props.history.push(`/room/building/${this.props.buildingid}/${roomid}`)
  }
  render() {
    let entrys = this.props.entrys
    let i = 1
    return (
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Room No.</th>
            <th>Floor</th>
            <th>Size</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {entrys.map(entry => (
            <tr className="clickable" key={entry.roomid} onClick={(roomid)=>this.handleOnSelectRoom(entry.roomid)}>
              <td>{entry.roomNum}</td>
              <td>{entry.floorNum}</td>
              <td>{entry.size}</td>
              <td>{entry.ownerid?"Owned":"Empty"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

export default withRouter(OwnerList);
