import React from 'react';
import styled from 'styled-components';
import {
  TwitterShareButton,
  TwitterIcon
} from 'react-share';
import { Link } from 'react-router-dom';
import { Doughnut } from 'react-chartjs-2';

var firebase = require("firebase/app");
require("firebase/auth");
require("firebase/database");

class PollPage extends React.Component {
  constructor(props) {
    super(props);
    const thisPollId = this.props.match.params.pollId;

    this.state = {
      loading: true,
      username: '',
      user: null,
      optionName: {},
      optionVisible: '',
      newOption: '',
      activePoll: thisPollId,
      poll: {},
    };

    this.getUser = this.getUser.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.removePoll = this.removePoll.bind(this);
    this.optionVisible = this.optionVisible.bind(this);
    this.handleNewOption = this.handleNewOption.bind(this);
    this.submitNewOption = this.submitNewOption.bind(this);
  }

  componentDidMount() {
    this.getUser();
    this.getPoll();
  }

  componentWillUnmount() {
    firebase.database().ref().off();
  }

  getUser() {
    firebase.auth().onAuthStateChanged((userHere) => {
      if (userHere) {
        this.setState({
          user: userHere,
        });
      }
    });
  }

  getPoll() {
    const thisPoll = '/polls/' + this.state.activePoll;
    const pollsRef = firebase.database().ref(thisPoll);

    pollsRef.on('value', (snapshot) => {
      let pollHere = snapshot.val();
      if(pollHere) {
        this.setState({
          poll: {
            id: this.props.match.params.pollId,
            title: pollHere.title,
            options: pollHere.options,
            user: pollHere.user,
            chartData: {
              labels: Object.keys(pollHere.options),
              datasets: [{
                data: Object.values(pollHere.options),
                backgroundColor: [
                '#508CBA',
                '#F7D694',
                '#FBB987',
                '#FF9C7A',
                '#FFF1D6',
                '#FFC7A8',
                '#FCC9B8',
                '#FEDDC7',
                '#FAB29C',
                '#A8949B'
                ],
                hoverBackgroundColor: [
                '#508CBA',
                '#F7D694',
                '#FBB987',
                '#FF9C7A',
                '#FFF1D6',
                '#FFC7A8',
                '#FCC9B8',
                '#FEDDC7',
                '#FAB29C',
                '#A8949B',
              ],
              }],
            },
          },
          optionName: {},
          loading: false,
        });
      }
    });
  }

  handleChange(event) {
    const voteString = event.target.value;
    const optionNameHere = voteString.split(',');
    const optionNameNow = optionNameHere[0];
    const voteCountHere = +optionNameHere[1];

    if(voteString.length > 0){
      this.setState({
        optionName: {
          [optionNameNow]: voteCountHere,
        },
      });
    }
    event.preventDefault();
  }

  handleSubmit(pollId) {
    const optionNameHere = Object.keys(this.state.optionName);
    const voteCountHere = +Object.values(this.state.optionName) +1;

    if (optionNameHere !== '') {
      let updates = {};
      updates[`/polls/${pollId}/options/${optionNameHere}`] = voteCountHere;
      return firebase.database().ref().update(updates);
    }
  }

  removePoll(pollId) {
    const pollRef = firebase.database().ref(`/polls/${pollId}`);
    this.setState({
      poll: {},
    });
    pollRef.remove();
    this.props.history.push('/Polls');
  }

  optionVisible(pollId) {
    this.setState({
      optionVisible: pollId
    });
  }

  handleNewOption(event) {
    event.preventDefault();
    const optionName = event.target.value;
    this.setState({
      newOption: optionName,
    });

  }
  submitNewOption(pollId) {
    const optionNameHere = this.state.newOption;

    this.setState({
      activePoll: pollId,
    });

    if (optionNameHere !== '') {
      let updates = {};
      updates[`/polls/${pollId}/options/${optionNameHere}`] = 0;
      return firebase.database().ref().update(updates);
    } else {
      this.props.history.push('/PollPage');
    }
  }

  render() {
    const poll = this.state.poll;
    const isEnabled = this.state.newOption !== '';
    const shareUrl = window.location.href;
    const voteIsEnabled = Object.keys(this.state.optionName).length === 0;
    return (
      <HomeDiv>
        <Title>Polling App</Title>
        <Heading2><StyledLink to="/Polls">&#8592; Polls</StyledLink></Heading2>
        <hr />
        {this.state.loading === false &&
          <div>
            <div>
              <Heading1>{poll.title}</Heading1>
              <Heading5>by: {poll.user}</Heading5>
              <Doughnut data={poll.chartData} options={poll.options} />
              <br />
              <Wrapper>
                <form onSubmit={(e) => { this.handleSubmit(poll.id); e.preventDefault(); }}>
                  <Label>
                    Vote For This:
                    <Selection onChange={this.handleChange} >
                      <option value={''}>Choose Your Vote</option>
                      {poll.options && Object.keys(poll.options).map((key, i) =>
                        <option key={i + 'key'} value={ key + "," + poll.options[key] }>{key}</option>
                      )}
                    </Selection>
                  </Label>
                  <br />
                  <Button><input type="submit" value="Submit" disabled={voteIsEnabled}/></Button>

                </form>
              </Wrapper>
              <br />
              <br />
              {this.state.user && (poll.user === this.state.user.displayName || poll.user === this.state.user.email) ?
                <div>
                  <TwitterShareButton
                    url={shareUrl}
                    title={`Vote for my poll: "${poll.title}"`}>
                    <TwitterIcon
                      size={32}
                      round
                    />
                      Tweet This Poll
                  </TwitterShareButton>
                  <br />
                  <Button onClick={() => this.optionVisible(poll.id)}>Add Option</Button>
                  <br />
                  {this.state.optionVisible === poll.id ?
                    <form onSubmit={(e) => { e.preventDefault(); this.submitNewOption(poll.id); }}>
                      <Input
                        type="text"
                        placeholder="Option Name"
                        style={{ border: '1px solid black' }}
                        onChange={this.handleNewOption}
                        ref={(ref) => this.mainInput= ref}
                      />
                      <Button><input type="submit" value="Submit" disabled={!isEnabled} /></Button>
                    </form>
                    : <div></div>}
                  <Button onClick={() => this.removePoll(poll.id)}>Remove Poll</Button>
                </div>
                : <p></p>}
            </div>
          </div>
        }
      </HomeDiv>
    );
  }
}
const Button = styled.button`
  background: ${(props) => props.primary ? '#508CBA' : 'white'};
  color: ${(props) => props.primary ? 'white' : '#508CBA'};
  font-size: 1em;
  margin: 0.5em;
  padding: 0.25em 1em;
  border: 2px solid #508CBA;
  border-radius: 3px;
`;
const HomeDiv = styled.div`
  margin: 1em;
  background-image: url("cloud.jpg");
  justifyContent: center;
  padding: 3em;
`;
const Input = styled.input`
  padding: 0.85em;
  margin: 0.5em;
  color: #508CBA;
  background: #FFF1D6;
  border: 0.5px solid #508CBA;
  border-radius: 3px;
  text-align: center;
`;
const Selection = styled.select`
  border-radius: 4px;
  -webkit-font-smoothing: antialiased;
  -webkit-touch-callout: none;
  outline: 0;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-weight: bold;
  font-size: 16px;
  border: 2px solid #41addd;
  color: #508CBA;
  margin: 1em;
`;
const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: #508CBA;
`;
const Heading5 = styled.h5`
  font-size: 0.9em;
  color: #508CBA;
  margin: 2em;
`;
const Heading2 = styled.h2`
  font-size: 1.4em;
  color: #508CBA;
  margin: 1em;
`;
const Heading1 = styled.h1`
  font-size: 2em;
  color: #508CBA;
  margin: 1em;
`;
const Label = styled.label`
  font-size: 1.3em;
  color: #508CBA;
  font-family: Sans-Serif;
`;
const StyledLink = styled(Link)`
  text-decoration: none;
  color: #508CBA;
  &:focus, &:hover, &:visited, &:link, &:active {
      text-decoration: none;
      color: #508CBA;
  }
`;
const Wrapper = styled.div`
  width: 80%;
  text-align: center;
  display: block;
  margin: auto;
  padding-top: 2em;
  background-color: white;
`;
export default PollPage;
