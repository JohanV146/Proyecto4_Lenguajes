// src/components/CreateGame.js
import React, { useState, useEffect } from 'react';
import './CreateGame.css';
import { useNavigate } from 'react-router-dom';
import { FaRegClock } from 'react-icons/fa';
import Board from './Board';


const CreateGame = () => {
  const navigate = useNavigate();
  const [gameSettings, setGameSettings] = useState({
    gameType: 'Tiempo',
    theme: 'standard',
    numPlayers: 2,
  });
  const [gameCode, setGameCode] = useState(null);
  const [countdown, setCountdown] = useState(180); // 3 minutos en segundos
  const [timerStarted, setTimerStarted] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (gameCode !== null && countdown === 0) {
      console.log('Iniciar partida ahora');
      setGameStarted(false);
      setTimerStarted(false);
      setCountdown(180);
    } else if (timerStarted && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, gameCode, timerStarted]);

  const handleInputChange = (e) => {
    if (!timerStarted) {
      const { name, value } = e.target;
      setGameSettings((prevSettings) => ({ ...prevSettings, [name]: value }));
    }
  };

  const handleCreateGame = () => {
    if (!timerStarted && countdown > 0) {
    const code = generateGameCode();
    setGameCode(code);
    setTimerStarted(true);
    setGameStarted(true);
    }
  };

  const generateGameCode = () => {
    return Math.random().toString(36).substring(7).toUpperCase();
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className="create-game-container">
      <h1>Crea tu Partida</h1>
      <div className="form-container">
        <div className="form-group">
          <label>Tipo de Juego:</label>
          <select
            name="gameType"
            value={gameSettings.gameType}
            onChange={handleInputChange}
            disabled={timerStarted || countdown === 0 || gameCode !== null}
          >
            <option value="Time">Tiempo</option>
            <option value="Large">Largo</option>
          </select>
        </div>
        <div className="form-group">
          <label>Tema:</label>
          <select
            name="theme"
            value={gameSettings.theme}
            onChange={handleInputChange}
            disabled={timerStarted || countdown === 0 || gameCode !== null}
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
            disabled={timerStarted || countdown === 0 || gameCode !== null}
          />
        </div>
        <button
          className="small-button"
          onClick={handleCreateGame}
          disabled={timerStarted || countdown === 0 || gameCode !== null}
        >
          Crear Partida
        </button>
        <button className="small-button" onClick={() => navigate('/')}>
          Volver
        </button>
      </div>

      {gameCode !== null && (
        <div className="countdown-container">
          <h2>Codigo de la Partida: {gameCode}</h2>
          <div className="countdown-timer">
            <FaRegClock size={30} />
            <span>{formatTime(countdown)}</span>
          </div>
        </div>
      )}

      {gameStarted && <Board gameId={gameSettings.numPlayers} />}
    </div>
  );
};

export default CreateGame;
