import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

var firebase = require("firebase/app");
require("firebase/auth");
require("firebase/database");

export default class PollsPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      polls: [],
      loadingHere: true,
      username: '',
      user: null,
      myPolls: false,
      activePoll: '',
    }
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.showMyPolls = this.showMyPolls.bind(this);
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user });
      }
    });

    const pollsRef = firebase.database().ref('/polls');

    pollsRef.on('value', (snapshot) => {
      const pollsHere = snapshot.val();
      console.log(JSON.stringify(pollsHere));
      const newState = [];

      for (const poll in pollsHere) {
        if (poll) {
          newState.push({
            id: poll,
            title: pollsHere[poll].title,
            user: pollsHere[poll].user
          });
        }
      };

      this.setState({
        polls: newState,
        loadingHere: false,
      });
    });
   }

  login() {
    firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then((result) => {
        const user = result.user;
        this.setState({
          user,
        });
      });
  }

  logout() {
    firebase.auth().signOut()
    .then(() => {
      this.setState({
        user: null,
      });
    });
  }

  showMyPolls(event) {
    console.log('clicked see my polls');

    let currentMyPolls = !this.state.myPolls;
    this.setState({
      myPolls: currentMyPolls,
    });
    event.preventDefault();
  }

  render() {
    if (this.state.loadingHere) {
      return (
        <div>
          Loading...
        </div>
      );
    }

    return (
      <HomeDiv>
      <Title>Polling App</Title>
      <Wrapper>
        {this.state.user ?
          <div>
            <Heading3>{this.state.user.displayName}</Heading3>
            {this.state.user && this.state.myPolls === false ? <Button onClick={this.showMyPolls}>See My Polls</Button>
              : <Button onClick={this.showMyPolls}>All Polls</Button>}
            <Button onClick={this.logout}>Log Out</Button>
          </div>
          :
          <Button onClick={this.login}>Log In</Button>
        }
      </Wrapper>

      <List>
        <Heading2>Polls:</Heading2>
        {this.state.polls.map((poll) => {
          return (
            <li key={poll.id}>
              {this.state.myPolls === true && this.state.user && (poll.user === this.state.user.userName || poll.user === this.state.user.displayName) &&
                <div id={poll.id}>
                  <Heading3><Link to={`/Polls/${poll.id}`}>{poll.title}</Link> by {poll.user}</Heading3>

                </div>
              }
              {this.state.myPolls === false &&
                <div id={poll.id}>
                  <Heading3><Link to={`/Polls/${poll.id}`}>{poll.title}</Link> by {poll.user}</Heading3>
                </div>}
            </li>
          );
        })}
      </List>

        {this.state.user &&
          <CenteredButton><StyledLink to="/NewPoll">Create New Poll</StyledLink></CenteredButton>
        }
      </HomeDiv>
    );
  }
}
const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: #508CBA;
  margin-top: 0.5em;
`;

const Heading3 = styled.h3`
  font-size: 1.1em;
  color: #508CBA;
  margin: 1em;
`;

const HomeDiv = styled.div`
  margin: 1em 2em auto 2em;
  background-image: url('cloud.jpg');
  justifyContent: center;
`;

const List = styled.div`
  justifyContent: center;
  background-color: white;
  border: 1px solid #508CBA;
  border-radius: 4px;
  list-style: none;
  display: block;
  margin: auto;
  width: 80%;
  overflow-y: auto;
  padding: 1em;
`;

const StyledLink = styled(Link)`
    text-decoration: none;
    color: #508CBA;
    &:focus, &:hover, &:visited, &:link, &:active {
        text-decoration: none;
        color: #508CBA;
    }
`;
const Button = styled.button`
  background: ${(props) => props.primary ? '#508CBA' : 'white'};
  color: ${(props) => props.primary ? 'white' : '#508CBA'};
  font-size: 1em;
  margin: .5em;
  padding: 0.25em 1em;
  border: 2px solid #508CBA;
  border-radius: 3px;
  text-decoration: none;
`;
const CenteredButton = styled.button`
  background: ${(props) => props.primary ? '#508CBA' : 'white'};
  color: ${(props) => props.primary ? 'white' : '#508CBA'};
  font-size: 1em;
  padding: 0.25em 1em;
  border: 2px solid #508CBA;
  border-radius: 3px;
  text-decoration: none;
  text-align: center;
  display: block;
  margin: auto;
  margin-top: .7em;
`;
const Heading2 = styled.h2`
  font-size: 1.4em;
  color: #508CBA;
  margin: 1em;
`;
const Wrapper = styled.div`
  width: 80%;
  text-align: center;
  display: block;
  margin: auto;
`;
