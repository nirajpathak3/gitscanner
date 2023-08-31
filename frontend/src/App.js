import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ApolloProvider } from "@apollo/client";
import './App.css';
import RepositoryList from './components/RepositoryList';
import RepositoryDetail from './components/RepositoryDetails';
import aplClient from './client'

function App() {
  return (
    <ApolloProvider client={aplClient}>
      <Router>
        <div className="App">
          <h1>Github Repository Data</h1>
          <Routes>
            <Route path="/" element={<RepositoryList />} />
            <Route path="/repository/:owner/:name" element={<RepositoryDetail />} />
          </Routes>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
