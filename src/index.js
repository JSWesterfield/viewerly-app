import 'webrtc-adapter';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { split } from 'apollo-client-preset';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import { BrowserRouter } from 'react-router-dom';
import './styles/index.scss';
import routes from './routes';
import store from './store';
import { setToken } from './actions/token';

store.dispatch(setToken(window.__JWT_TOKEN__));

const httpLink = new HttpLink({
  uri: process.env.GRAPHQL_URI,
  credentials: 'same-origin',
});

const wsLink = new WebSocketLink({
  uri: process.env.GRAPHQL_WS_URI,
  options: {
    reconnect: true,
  },
});