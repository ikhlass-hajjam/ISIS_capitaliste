import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {ApolloClient, ApolloProvider, InMemoryCache} from "@apollo/client";

// ici on met l'url du prof du backend en attendant que océane finisse
const client = new ApolloClient({
  uri: 'https://isiscapitalistgraphql.kk.kurasawa.fr/graphql',
  cache: new InMemoryCache()
 });

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
    <App />
    </ApolloProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Leagrn more: https://bit.ly/CRA-vitals
reportWebVitals();
