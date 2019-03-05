import React, { Component } from 'react';
import Score from './components/Score.js';
import './styles/styles.scss';

class App extends Component {
  render() {
    return (
      <main className="wrapper">
        <h1>Did the raps score enough?</h1>
        <Score />

      </main>
    );
  }
}

export default App;
