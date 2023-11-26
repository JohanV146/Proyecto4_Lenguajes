// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Lobby from './components/Lobby';
import CreateGame from './components/CreateGame';
import GameScreen from './components/GameScreen';
import PlayGame from './components/PlayGame';

const App = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState('');

  const handleAuthenticate = (name) => {
    setAuthenticated(true);
    setUsername(name);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Lobby authenticated={authenticated} username={username} onAuthenticate={handleAuthenticate} />}
        />
        <Route path="/create/:username" element={<CreateGame />} />
        <Route path="/game/:numPlayers/:gameCode/:username/:tipo/:tipo2" element={<GameScreen />} />
        <Route path="/play/:code/:numPlayers/:snakeColor/:username/:tipo/:tipo2" element={<PlayGame />} />
      </Routes>
    </Router>
  );
};

export default App;
