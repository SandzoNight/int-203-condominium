import React, { Component } from 'react';
import logo from './logo.svg';
import './style.css';

class App extends Component {

  state = {users: [],text:''}
  
  componentDidMount() {
    fetch('/user')
      .then(res => res.json())
      .then(users => this.setState({ users }))

      fetch('/hello')
      .then(res => res.text())
      .then(text => this.setState({ text }));
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">{this.state.text}</h1>
        </header>
        <p className="App-intro">
        {this.state.users.map(user =>
          <div key={user.id}>{user.username}</div>
        )}
        </p>
      </div>
    );
  }
}

export default App;
