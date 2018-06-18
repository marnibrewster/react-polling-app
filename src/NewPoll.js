import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

var firebase = require("firebase/app");
require("firebase/auth");
require("firebase/database");

// #508CBA,#F7D694,#FF9C7A,#FFF1D6,#FCC9B8,#508CBA,#F7D694,#FF9C7A
class NewPoll extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      user: null,
      newPoll: {
        title: '',
        options: ''
      }
    };

    this.handleChange = this.handleChange.bind(this);
    this.createNewPollHere = this.createNewPollHere.bind(this);
  }

  componentDidMount() {
    this.getUser();
  }

  getUser () {
    firebase.auth().onAuthStateChanged((userHere) => {
      if(userHere) {
        this.setState({
          user: userHere
        })
      };
    });
  }

  createNewPollHere(e) {
    e.preventDefault();

    let {newPoll} = this.state;
    const optionsObj = { };

    if (newPoll.options) {
      const optionsArray = newPoll.options.split(', ');
      for (let i=0; i<optionsArray.length; i++){
        const key = optionsArray[i];
        optionsObj[key] = 0;
      }
    }
    let pollData = {
      title: newPoll.title,
      options: optionsObj,
      user: this.state.user.displayName || this.state.user.email
    };

    let newPollKey = firebase.database().ref('/polls/').push().key;
    let updates = {};
    updates['/polls/'+newPollKey] = pollData;
    return firebase.database().ref().update(updates).then(() => {
      this.props.history.push(`/Polls/${newPollKey}`);
    });
  }

  handleChange(event){
    const name = event.target.name;
    const value = event.target.value ;

    var oldState = this.state.newPoll;
    var newState = {
      [name]: value
    }

    this.setState({
      newPoll: Object.assign(oldState, newState)
    });
  }

  render() {
    return (
      <HomeDiv>
      <Title>Polling App</Title>
      <Heading2><StyledLink to='/Polls'>&#8592; Polls</StyledLink></Heading2>
        <hr />
         <div>
          <Heading3>Create New Poll</Heading3>
           <form onSubmit={ this.createNewPollHere }>
             <Label>
               Poll Title
               <br />
                 <Input type="text" value={this.state.newPoll.title} name="title" onChange={this.handleChange}/>
             </Label>
             <br />

             <Label>
               Add options, separated by a comma plus a space (", "):
               <br />
               <Input type="textarea" value={this.state.newPoll.options} name="options" onChange={this.handleChange}/>
             </Label>
             <br />
             {this.state.newPoll.title !== '' && this.state.newPoll.options !== '' && <Button><input type="submit" value="Submit" /></Button>}
           </form>
         </div>
      </HomeDiv>
    )
  }
}
const StyledLink = styled(Link)`
    text-decoration: none;
    color: #508CBA;
    &:focus, &:hover, &:visited, &:link, &:active {
        text-decoration: none;
        color: #508CBA;
    }
`;
const Button = styled.button`
  background: ${props => props.primary ? '#508CBA' : 'white'};
  color: ${props => props.primary ? 'white' : '#508CBA'};
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid #508CBA;
  border-radius: 3px;
`;
const Input = styled.input`
  padding: 0.5em;
  margin: 0.5em;
  color: #508CBA;
  background: #FFF1D6;
  border: 1px solid #508CBA;
  border-radius: 3px;
`;
const Label = styled.label`
  font-size: 1.2em;
  color: #508CBA;
  margin: 1.2em 1em 1em 1em;
`;
const HomeDiv = styled.div`
  margin: 1em 1em 1em 1em;
  background-image: url("cloud.jpg");
  justifyContent: center;
  padding: 3em;
`;
const Heading3 = styled.h3`
  font-size: 1.1em;
  color: #508CBA;
  margin: 1em;
`;
const Heading2 = styled.h2`
  font-size: 1.4em;
  color: #508CBA;
  margin: 1em;
`;
const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: #508CBA;
`;

export default NewPoll;
