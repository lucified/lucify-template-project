import * as React from 'react';
import styled from 'styled-components';

import 'normalize.css/normalize.css';
import './fonts.css';

import './app.css';

import Header from './header';

const Root = styled.div`
  display: flex;
  flex-flow: column;
  height: 100%;
`;
const HeaderContainer = styled.div`
  flex: 0 1 auto;
`;
const Content = styled.div`
  flex: 1 1 auto;
  position: relative;
`;

interface Props {}

class App extends React.Component<Props> {
  public render() {
    return (
      <Root>
        <HeaderContainer>
          <Header />
        </HeaderContainer>
        <Content>Content</Content>
      </Root>
    );
  }
}

export default App;
