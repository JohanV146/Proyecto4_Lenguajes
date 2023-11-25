// src/components/CreateGame.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateGame.css';

const CreateGame = () => {
  const navigate = useNavigate();
  const [gameSettings, setGameSettings] = useState({
    gameType: 'Tiempo',
    theme: 'standard',
    numPlayers: 2,
    duration: 180,
    snakeLength: 5,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGameSettings((prevSettings) => ({ ...prevSettings, [name]: value }));
  };

  const handleCreateGame = () => {
    const code = generateGameCode();
    const adjustedGameId = 10 * gameSettings.numPlayers;
    // Redirigir a la pantalla del juego con el código de la partida
    navigate(`/game/${code}`);
  };

  const generateGameCode = () => {
    return Math.random().toString(36).substring(7).toUpperCase();
  };

  return (
    <div className="create-game-container">
      <div className="centered-container">
        <h1>Crea tu Partida</h1>
        <div className="form-container">
          <div className="form-group">
            <label>Tipo de Juego:</label>
            <select
              name="gameType"
              value={gameSettings.gameType}
              onChange={handleInputChange}
            >
              <option value="Tiempo">Tiempo</option>
              <option value="Largo">Largo</option>
            </select>
            {gameSettings.gameType === 'Tiempo' && (
              <div>
                <label>Duracion (segundos):</label>
                <input
                  type="number"
                  name="duration"
                  value={gameSettings.duration}
                  onChange={handleInputChange}
                />
              </div>
            )}
            {gameSettings.gameType === 'Largo' && (
              <div>
                <label>Longitud:</label>
                <input
                  type="number"
                  name="snakeLength"
                  value={gameSettings.snakeLength}
                  onChange={handleInputChange}
                />
              </div>
            )}
          </div>
          <div className="form-group">
            <label>Tema:</label>
            <select
              name="theme"
              value={gameSettings.theme}
              onChange={handleInputChange}
            >
              <option value="standard">Estandar</option>
            </select>
          </div>
          <div className="form-group">
            <label>Cantidad de Jugadores:</label>
            <input
              type="number"
              name="numPlayers"
              value={gameSettings.numPlayers}
              onChange={handleInputChange}
            />
          </div>
          <button className="primary-button" onClick={handleCreateGame}>
            Crear Partida
          </button>
          <button className="secondary-button" onClick={() => navigate('/')}>
            Volver
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGame;
