import * as React from 'react';
import styled from 'styled-components';

const Root = styled.div`
  margin-top: 0px;
`;

const Top = styled.div`
  background-color: $color-gray;
  height: 40px;
  display: flex;
  align-items: center;
`;

interface Props {
  className?: string;
}

const Header = ({ className }: Props) => (
  <Root className={className}>
    <Top>Header</Top>
  </Root>
);

export default Header;
