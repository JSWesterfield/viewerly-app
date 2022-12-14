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

const subscriptionMiddleware = {
  applyMiddleware(options, next) { // suggested way to extend Redux with custom functionality
    const { token } = store.getState();
    options.connectionParams = { authToken: token };
    next();
  },
};

// GraphQL subsubscription client passes in the Redux subscription middleware
wsLink.subscriptionClient.use([subscriptionMiddleware]); 
 const link = split(
   ({ query }) => {
     const { kind, operation } = getMainDefinition(query);
     return kind === 'OperationDefinition' && operation === 'subscription';
   },
   wsLink,
   httpLink,
 );

 // GraphQL Apollo client cache use by almost every instance of ApolloClient
const cache = new InMemoryCache().restore(window.__APOLLO_STATE__);

