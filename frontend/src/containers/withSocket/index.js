import React from 'react';
import socket from '../../utils/socketClient';

const withSocket = Target => {
  return class extends React.Component {
    render () {
      return (
          <Target socket={socket.client} {...this.props} />
      );
    }
  }
};

export default withSocket;
