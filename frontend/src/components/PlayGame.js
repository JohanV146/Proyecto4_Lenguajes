// PlayGame.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Board from './Board';
import './PlayGame.css'; // Importa el archivo de estilos

const PlayGame = () => {
  const { code, numPlayers, snakeColor, username, tipo, tipo2 } = useParams();

  useEffect(() => {
    // Lógica adicional según sea necesario
  }, [code]);

  console.log(tipo, tipo2);

  return (
    <div className="play-game-container">
      <div className="board-container">
        <Board
          gameId={numPlayers}
          snakeColor={snakeColor}
          username={username}
          code={code}
          numPlayers={numPlayers}
          username={username}
          tipo={tipo}
          tipo2={tipo2}
        />
      </div>
    </div>
  );
};

export default PlayGame;
