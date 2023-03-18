import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
//
import {ApolloClient, ApolloProvider, InMemoryCache} from "@apollo/client";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

//uri du prof : https://isiscapitalistgraphql.kk.kurasawa.fr/graphql
//uri de Océane :http://localhost:4000/graph
const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache()
});


root.render(
  <React.StrictMode>
      <ApolloProvider client={client}>
    <App />
    </ApolloProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();




























































/*import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {ApolloClient, ApolloProvider, InMemoryCache} from "@apollo/client";


//uri océane= http://localhost:4000/graphql ET url du prof = https://isiscapitalistgraphql.kk.kurasawa.fr/graphql
// ici on met l'url du prof du backend en attendant que océane finisse
const client = new ApolloClient({
  //uri: 'https://isiscapitalistgraphql.kk.kurasawa.fr/graphql',
  uri: 'http://localhost:4000/graphql',
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


reportWebVitals();
*/