// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Lobby from './components/Lobby';
import CreateGame from './components/CreateGame';
import Board from './components/Board';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Lobby />} />
        <Route path="/create" element={<CreateGame />} />
        <Route path="/game/:gameCode" element={<Board />} />
      </Routes>
    </Router>
  );
};

export default App;
