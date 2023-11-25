import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Board from './Board';

const PlayGame = () => {
  const { code, numPlayers} = useParams();

  // Aseg�rate de que gameId tenga un valor antes de usarlo en parseInt
  //const numPlayers = numPlayers*10;

  useEffect(() => {
    // L�gica adicional seg�n sea necesario
  }, [code]);

  return (
    <div>
      <h2>Game Code: {code}</h2>
      <h2>Number of Players: {numPlayers}</h2>
      <Board gameId={numPlayers} />
    </div>
  );
};

export default PlayGame;
