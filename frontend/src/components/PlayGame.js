import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Board from './Board';

const PlayGame = () => {
  const { code, gameId } = useParams();
  const selectedColor = localStorage.getItem('selectedColor') || '#ff0000';

  // Asegúrate de que gameId tenga un valor antes de usarlo en parseInt
  const numPlayers = gameId ? parseInt(gameId, 10) / 10 : 0;

  useEffect(() => {
    // Lógica adicional según sea necesario
  }, [code]);

  return (
    <div>
      <h2>Game Code: {code}</h2>
      <h2>Number of Players: {numPlayers}</h2>
      <Board gameId={gameId ? parseInt(gameId, 10) : 0} snakeColor={selectedColor} />
    </div>
  );
};

export default PlayGame;
