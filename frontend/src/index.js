import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import socketClient from './utils/socketClient';
import rootReducer from './redux/reducers';

const store = createStore(rootReducer);

socketClient.connect("ws://localhost:8080/connect");
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>, 
    document.getElementById('root')
);
