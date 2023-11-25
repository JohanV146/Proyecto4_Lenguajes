// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Lobby from './components/Lobby';
import CreateGame from './components/CreateGame';
import GameScreen from './components/GameScreen';
import PlayGame from './components/PlayGame';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Lobby />} />
        <Route path="/create" element={<CreateGame />} />
        <Route path="/game/:gameCode" element={<GameScreen />} />
        <Route path="/play/:code" element={<PlayGame />} /> {/* Nueva ruta para jugar */}
      </Routes>
    </Router>
  );
};

export default App;
