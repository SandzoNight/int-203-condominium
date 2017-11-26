import React, { Component } from 'react';
import socket from './../../lib/withSocket'
import {withRouter} from "react-router-dom";

class EmployeeList extends Component {
  handleOnSelectEmp(billid) {
    this.props.history.push(`/bill/maintenance/${billid}`)
  }
  render() {
    let entrys = this.props.entrys
    return (
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Bill ID</th>
            <th>Room No.</th>
            <th>Maintenance Cost</th>
            <th>Total cost</th>
            <th>Start date</th>
            <th>Due date</th>
            <th>Paid date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {entrys.map(entry => (
            <tr className="clickable" key={entry.billid} onClick={(billid)=>this.handleOnSelectEmp(entry.billid)}>
              <td>{entry.billid}</td>
              <td>{entry.roomnum}</td>
              <td>{entry.cost}</td>
              <td>{entry.totalcost}</td>
              <td>{entry.startdate}</td>
              <td>{entry.duedate}</td>
              <td>{entry.paiddate?entry.paiddate:"-"}</td>
              <td>{entry.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

export default withRouter(EmployeeList);
