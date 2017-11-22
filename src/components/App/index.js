import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

class App extends Component {

  render() {
    return (
      <Redirect to="/login"/>
    );
  }
}

export default App;
