// Authentication.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Authentication.css';

const Authentication = ({ onAuthenticate }) => {
  const [nickname, setNickname] = useState('');
  const history = useNavigate();

  const handleAuthentication = () => {
    if (nickname.trim() !== '') {
      onAuthenticate(nickname);
      history('/');
    } else {
      alert('Por favor, ingresa un nickname válido.');
    }
  };

  return (
    <div className="authentication-container">
      <h2>Ingresa tu Nickname</h2>
      <input
        type="text"
        placeholder="Nickname"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
      />
      <button className="custom-button" onClick={handleAuthentication}>
        Ingresar
      </button>
    </div>
  );
};

export default Authentication;
