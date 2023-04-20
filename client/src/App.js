import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';

const httpLink = createHttpLink({
  uri: '/graphql',
});

// middleware that will attach the JWT token to every request as an `authorization` header
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage 
  const token = localStorage.getItem('id_token');
  // return the headers 
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  // Set up our client to execute the authentication middleware prior to making the request to our GraphQL API
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <><ApolloProvider client={client} /><Router>
      <>
        <Navbar />
        <Routes>
          <Route
            path='/'
            element={<SearchBooks />} />
          <Route
            path='/saved'
            element={<SavedBooks />} />
          <Route
            path='*'
            element={<h1 className='display-2'>Wrong page!</h1>} />
        </Routes>
      </>
    </Router></>
  );
}

export default App;
