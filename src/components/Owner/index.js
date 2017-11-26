import React, { Component } from 'react';
import socket from './../../lib/withSocket'
import {withRouter} from "react-router-dom";
import Navbar from './../Navbar'
import OwnerList from './OwnerList'
import Own from './Own'
import axios from 'axios'

class Owner extends Component {
  constructor(props) {
    super(props)
    this.state = {
      entrys: [],
    }
  }
  
  componentWillMount() {
    if(localStorage.getItem('session_id')!=1){
      console.log('not logged in')
      this.props.history.push("/login")
    }
    this.fetchOwnerList("","")
  }

  htmlElement(id) {
    return document.getElementById(id)
  }

  handleAllOwnerButton() {
    let name = this.htmlElement("name").value
    let email = this.htmlElement("email").value
    if(name!=="")
      this.htmlElement("name").value = ""
    if(email!=="")
      this.htmlElement("email").value = ""
      this.fetchOwnerList("","")
  }

  handleSubmit(e) {
    e.preventDefault()
    let name = this.htmlElement("name").value
    let email = this.htmlElement("email").value
    this.fetchOwnerList(name,email)
  }

  fetchOwnerList(name,email) {
    console.log('fetch both')
    var self = this
    axios.get(`/api/owner/name/${name!==""?name:"%20"}/email/${email!==""?email:"%20"}`)
    .then(function (response) {
      console.log(response.data)
      self.setState({entrys:response.data})
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  render() {
    return (
      <div>
        <Navbar history={this.props.history}/>
        <div className="container mt-4">
          <div className="row">
            <div className="col-12">
              <h2>Owners List</h2>
              <hr/>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-3">
              <p className="h4">Filter</p>
              <div>
                <button className="btn btn-block" onClick={()=>this.handleAllOwnerButton()}>All Owners</button>
              </div>
              <form onSubmit={(e)=>this.handleSubmit(e)}>
                <div className="form-row mt-3">
                  <input id="name" className="form-control col-12" type="text" placeholder="Owner name"/>
                </div>
                <div className="form-row mt-3">
                  <input id="email" className="form-control col-12" type="text" placeholder="Owner email"/>
                </div>
                <button type="submit" className="btn col">Go</button>
              </form>
            </div>
            <div className="col-sm-9">
              {this.props.match.params.id?
                <Own ownerid={this.props.match.params.id}/>
              :<OwnerList entrys={this.state.entrys} history={this.props.history}/>}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Owner);
