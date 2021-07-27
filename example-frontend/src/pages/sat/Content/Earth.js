import React from 'react';

import {
  Card as MuiCard,
  CardContent as MuiCardContent,
  CardHeader,
} from '@material-ui/core';

const Card = styled(MuiCard)(spacing);

const CardContent = styled(MuiCardContent)`
  &:last-child {
    padding-top: 0;
    padding-bottom: ${(props) => props.theme.spacing(4)}px;
  }
`;
function Earth() {
  return (
    <Card
      mb={4}
      ml={4}
      mr={4}
      style={{ display: 'flex', flex: '1', flexDirection: 'column' }}
    >
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <CardHeader title="Real-Time Satellites View" />
      </div>

      <CardContent>
        <div
          ref={(c) => (this.el = c)}
          style={{ width: '100%', height: '100%' }}
        />
      </CardContent>
    </Card>
  );
}

export default Earth;
