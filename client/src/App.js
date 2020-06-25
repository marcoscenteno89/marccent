import React, { Component } from 'react';
import './App.scss';
// import Todo from './components/todo';
// import Theme from './components/theme';
import Nav from './components/nav';

class App extends Component {
  render() {
      return  (
        <div className="App">
          <Nav />
          {/* <Todo /> */}
          {/* <Theme /> */}
        </div>
      )        
  }
}

export default App;
