// src/components/Snake.js
import React from 'react';
import './Snake.css';

const Snake = ({ color, onColorChange }) => {
  const handleClick = () => {
    if (onColorChange) {
      onColorChange(color);
    }
  };

  return (
    <div className={`snake-container ${color ? 'selected' : ''}`} onClick={handleClick}>
      <div className="snake-body" style={{ backgroundColor: color }}>
        <div className="snake-image"></div>
      </div>
    </div>
  );
};

export default Snake;
