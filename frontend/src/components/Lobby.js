import React from 'react';
import { Link } from 'react-router-dom';
import './Lobby.css'; // Importa el archivo de estilos
import backgroundImage from '../images/snake_background.png';


const Lobby = () => {
  const backgroundStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100vh',
  };

  return (
    <div className="lobby-container" style={backgroundStyle}>
      <div className="lobby-overlay">
        <h1>Bienvenido al Juego Snake</h1>
        <div className="lobby-buttons">
          <Link to="/create" className="lobby-button">
            Crear Partida
          </Link>
          <Link to="/join" className="lobby-button">
            Unirse a Partida
          </Link>
          <Link to="/rankings" className="lobby-button">
            Ver Ranking
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Lobby;

