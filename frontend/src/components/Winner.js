import React from 'react';
import './Winner.css';
import { useNavigate } from 'react-router-dom';

const Winner = ({ tipo, nombreJugador, tipo2 }) => {
  const navigate = useNavigate();

  return (
    <div className="ganador-screen">
      <h1 className="ganador-label">Ganador</h1>
      <div className="jugador-nombre">
        <p>{`Jugador: ${nombreJugador}`}</p>
        <button className="boton-ir-a-inicio" onClick={() => navigate(`/`)}>
          Ir a Inicio
        </button>
      </div>
    </div>
  );
};

export default Winner;
