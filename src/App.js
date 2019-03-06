import React, { Component } from 'react';
import Header from './components/Header.js';
import Score from './components/Score.js';
import Footer from './components/Footer.js';
import './styles/styles.scss';

class App extends Component {
  render() {
    return (
      <div className="App_Component">
        <Header 
          title="Did the raps score enough?"
        />
        <main className="wrapper">
          <Score />

        </main>
        <Footer />
      </div>
    );
  }
}

export default App;
