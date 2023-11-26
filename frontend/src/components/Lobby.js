// Lobby.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Lobby.css';
import backgroundImage from '../images/snake_background.png';
import Authentication from './Authentication';

const Lobby = ({ authenticated, username, onAuthenticate }) => {
  const backgroundStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100vh',
  };

  return (
    <div className="lobby-container" style={backgroundStyle}>
      <div className="lobby-overlay">
        {authenticated ? (
          <>
            <h1>Bienvenido al Juego Snake, {username}!</h1>
            <div className="lobby-buttons">
              <Link to={`/create/${username}`} className="lobby-button">
                Crear Partida
              </Link>
              <Link to="/join" className="lobby-button">
                Unirse a Partida
              </Link>
              <Link to="/rankings" className="lobby-button">
                Ver Ranking
              </Link>
            </div>
          </>
        ) : (
          <Authentication onAuthenticate={onAuthenticate} />
        )}
      </div>
    </div>
  );
};

export default Lobby;
