import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaRegClock } from 'react-icons/fa';
import Snake from './Snake';
import './GameScreen.css';
import Board from './Board';

const GameScreen = () => {
  const { numPlayers, gameCode, username, tipo, tipo2 } = useParams();
  const [countdown, setCountdown] = useState(180);
  const [snakeColor, setSnakeColor] = useState('#572364');
  const [selectionLocked, setSelectionLocked] = useState(false);
  const colors = ['#572364', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#a52a2a'];
  const navigate = useNavigate();

  useEffect(() => {
    let timer = null;

    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      // Cuando el cronómetro llega a 0:00, redirigir a la pantalla de inicio
      navigate('/');
    }

    return () => {
      clearTimeout(timer);
    };
  }, [countdown, navigate]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handleColorChange = (color) => {
    if (!selectionLocked) {
      setSnakeColor(color);
    }
  };

  const handleSelectClick = () => {
    // Aquí puedes realizar alguna lógica adicional antes de redirigir
    console.log('Color seleccionado:', snakeColor);

    // Elimina el carácter "#" antes de almacenar el color en el estado o en localStorage
    const cleanedColor = snakeColor.slice(1);
    localStorage.setItem('selectedColor', cleanedColor);

    // Redirigir a la pantalla de juego
    navigate(`/play/${gameCode}/${numPlayers}/${cleanedColor}/${username}/${tipo}/${tipo2}`);
  };

  return (
    <div className="game-screen-container">
      <div className="game-content">
        <div className="snake-container">
          <Snake color={snakeColor} />
        </div>

        <div className="color-container">
          {colors.map((color, index) => (
            <div
              key={index}
              className={`color-option ${selectionLocked ? 'locked' : ''}`}
              style={{ backgroundColor: color }}
              onClick={() => handleColorChange(color)}
            />
          ))}
        </div>

        <div className="select-button-container">
          <button onClick={handleSelectClick} disabled={selectionLocked}>
            Seleccionar
          </button>
        </div>

        <div className="info-container">
          <h2>Codigo de la Partida: {gameCode}</h2>
          <div className="countdown-container">
            <FaRegClock size={30} />
            <span>{formatTime(countdown)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameScreen;
