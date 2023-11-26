// PlayGame.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Board from './Board';
import './PlayGame.css'; // Importa el archivo de estilos

const PlayGame = () => {
  const { code, numPlayers, snakeColor, username } = useParams();

  useEffect(() => {
    // Lógica adicional según sea necesario
  }, [code]);

  return (
    <div className="play-game-container">
      <div className="info-container">
        <h1>Game Code: {code}</h1>
        <h2>Number of Players: {numPlayers/10}</h2>
        <h2>Username: {username}</h2>
      </div>
      <div className="board-container">
        <Board gameId={numPlayers} snakeColor={snakeColor} username={username} />
      </div>
    </div>
  );
};

export default PlayGame;
