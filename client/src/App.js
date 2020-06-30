import React, { Component, Fragment } from 'react';
import './App.scss';
// import Todo from './components/todo';
import Theme from './components/theme';
import Nav from './components/nav';

class App extends Component {
  render() {
      return (
      <Fragment>
          <Nav />
          {/* <Todo /> */}
          <Theme />
      </Fragment>
      )}
}

export default App;
