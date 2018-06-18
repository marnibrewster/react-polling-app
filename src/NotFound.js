import React from 'react';
import styled from 'styled-components';

export default class NotFound extends React.PureComponent {
  render() {
    return (
      <HomeDiv>
        <Heading3>Not Found</Heading3>
      </HomeDiv>
    )
  }
}

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
