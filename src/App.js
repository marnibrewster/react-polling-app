import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import PollsPage from './PollsPage';
import NotFound from './NotFound';
import PollPage from './PollPage';
import NewPoll from './NewPoll';
import config from './firebaseConfig';
const firebase = require('firebase/app');

firebase.initializeApp(config);

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Switch>
            <Route exact path='/' component={PollsPage} />
            <Route exact path='/Polls' component={PollsPage} />
            <Route exact path='/Polls/:pollId' component={PollPage} />
            <Route path='/NewPoll' component={NewPoll} />
            <Route path='/PollPage' component={PollPage} />
            <Route component={NotFound} />
          </Switch>
        </div>
    </Router>
    );
  }
}

export default App;
