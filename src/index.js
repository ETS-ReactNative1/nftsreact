import './index.css';

import React, { createContext } from 'react';
import ReactDOM from 'react-dom';
import { io } from 'socket.io-client';

import App from './App';

export const SocketContext = createContext();
const socket = io( "http://localhost:5050", {
  transports: [ "websocket" ],
} );


ReactDOM.render(
  <SocketContext.Provider value={socket}>
    <App />
  </SocketContext.Provider>,
  document.getElementById( 'root' )
);
