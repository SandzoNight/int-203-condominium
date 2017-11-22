import React, { Component } from 'react';
import socket from './../../lib/withSocket'

class EmployeeList extends Component {

  render() {
    let entrys = this.props.entrys
    let i = 1
    return (
      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>First name</th>
            <th>Last name</th>
            <th>Position</th>
            <th>Building</th>
          </tr>
        </thead>
        <tbody>
          {entrys.map(entry => (
            <tr key={entry.empid}>
              <td>{i++})</td>
              <td>{entry.fname}</td>
              <td>{entry.lname}</td>
              <td>{entry.pos}</td>
              <td>{entry.building?entry.building:"-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

export default EmployeeList;
