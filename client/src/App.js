import React, { Component, Fragment } from 'react';
// import Todo from './components/todo';
import Theme from './components/theme';
import GA4React from 'ga-4-react';
import { hotjar } from 'react-hotjar';
 
hotjar.initialize(process.env.REACT_APP_HOTJAR);

const ga4react = new GA4React(
  'G-XT2J9RQ50E',
);

ga4react.initialize().then((ga4) => {
  ga4.pageview(`${window.location.pathname}${window.location.search}`)
},(err) => {
  console.error(err)
})

class App extends Component {

  render() {
      return (
        <Fragment>
            <Theme />
        </Fragment>
      )}
}

export default App;