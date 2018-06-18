import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import PollsPage from './PollsPage';
import NotFound from './NotFound';
import PollPage from './PollPage';
import NewPoll from './NewPoll';
const firebase = require('firebase/app');

const config = {
  apiKey: 'AIzaSyCKg28QO97IFsRTWt1z2UFA5LEdXslIiMw',
  authDomain: 'poll-app-web.firebaseapp.com',
  databaseURL: 'https://poll-app-web.firebaseio.com',
  projectId: 'poll-app-web',
  storageBucket: 'poll-app-web.appspot.com',
  messagingSenderId: '1036908880226',
};

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
