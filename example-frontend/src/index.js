import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import { Provider } from 'react-redux';
import store from './redux/store/index';

// import {HASURA_ENDPOINT, HASURA_SECRET_API_KEY} from './keys';

import {
  ApolloProvider,
  ApolloClient,
  HttpLink,
  InMemoryCache,
  split
} from '@apollo/client';
import { WebSocketLink } from '@apollo/link-ws';
import { getMainDefinition } from '@apollo/client/utilities';

const HASURA_ENDPOINT = 'suitable-hedgehog-89.hasura.app/v1/graphql'
const HASURA_SECRET_API_KEY = 'v9MhgGMmEDvq0wkL7Uf7kjU0NAiLVQKpdGyGmRYhwHbj4njqIjFDWoqiuqoRO7H6'

const httpLink = new HttpLink({
  headers: {
    'x-hasura-admin-secret': HASURA_SECRET_API_KEY
  },
  uri: `https://${HASURA_ENDPOINT}`,
});

const wsLink = new WebSocketLink({
  uri: `ws://${HASURA_ENDPOINT}`,
  options: {
    reconnect: true,
    connectionParams: {
      headers: {
        'x-hasura-admin-secret': HASURA_SECRET_API_KEY
      }
    }
  },
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      Subscription: {
        fields: {
          DatasetsTable: {
            merge: false
          }
        }
      }
    }
  }),
  link: splitLink,
});

ReactDOM.render(
  <ApolloProvider client={client}>
  <Provider store={store}>
    <App />
  </Provider>
  </ApolloProvider>,
document.getElementById('root'));
