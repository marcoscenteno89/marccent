import React, { Fragment } from 'react';
import './App.scss';
import InputTodo from './components/input-todo';
import ListTodo from './components/list-todo';
// import 'https://cdnjs.cloudflare.com/ajax/libs/gsap/2.1.0/TweenMax.min.js';
// import './tween-max.js';

function App() {
  return (
    <Fragment>
      <InputTodo />
      <ListTodo />
    </Fragment>
  );
}

export default App;
