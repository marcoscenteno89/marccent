import React, { Component, Fragment } from 'react';
import './styles/App.scss';
import './styles/Global.scss';
import './styles/keyframes.scss';

// import Todo from './components/todo';
import Theme from './components/theme';

class App extends Component {
  render() {
      return (
      <Fragment>
          <Theme />
      </Fragment>
      )}
}

export default App;