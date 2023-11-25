import React, { useEffect, useState, useCallback } from 'react';
import './Board.css';
import { randomInt } from './utils';

const Board = ({ gameId, snakeColor }) => {
  const [matrix, setMatrix] = useState([]);
  const [direction, setDirection] = useState('RIGHT');
  const [snake, setSnake] = useState([{ x: 5, y: 5 }]);
  const [food, setFood] = useState([{ x: randomInt(1, 20), y: randomInt(1, 20) }]);
  const [tail, setTail] = useState([]);

  useEffect(() => {
    const color1 = '#acd44f';
    const color2 = '#7ea109';

    const generateMatrix = () => {
      const size = gameId;

      const newMatrix = Array.from({ length: size }, (row, rowIndex) =>
        Array.from({ length: size }, (cell, colIndex) => {
          const color = (rowIndex + colIndex) % 2 === 0 ? color1 : color2;
          return { color };
        })
      );
      setMatrix(newMatrix);
    };

    generateMatrix();
  }, [gameId]);

  const changeCellColor = (rowIndex, colIndex, newColor) => {
    setMatrix((prevMatrix) => {
      const updatedMatrix = [...prevMatrix];
      updatedMatrix[rowIndex][colIndex].color = newColor;
      return updatedMatrix;
    });
  };

  const handleKeyPress = (event) => {
    switch (event.key) {
      case 'ArrowUp':
        setDirection('UP');
        break;
      case 'ArrowDown':
        setDirection('DOWN');
        break;
      case 'ArrowLeft':
        setDirection('LEFT');
        break;
      case 'ArrowRight':
        setDirection('RIGHT');
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [gameId]);

  useEffect(() => {
    const gameInterval = setInterval(moveSnake, 200);

    return () => {
      clearInterval(gameInterval);
    };
  }, [snake, direction]);

  const moveSnake = useCallback(() => {
    const head = { ...snake[0] };
    const food_i = { ...food[0] };
    const tail_ = [...tail];

    const newTail = [...tail];
    newTail.pop();
    setTail([head, ...newTail]);

    changeCellColor(food_i.y, food_i.x, 'red');

    switch (direction) {
      case 'UP':
        head.y -= 1;
        break;
      case 'DOWN':
        head.y += 1;
        break;
      case 'LEFT':
        head.x -= 1;
        break;
      case 'RIGHT':
        head.x += 1;
        break;
      default:
        break;
    }

    if (head.x === food_i.x && head.y === food_i.y) {
      setTail((prevTail) => [...prevTail, ...Array(1).fill({ x: tail[tail.length - 1].x, y: tail[tail.length - 1].y })]);
      food_i.y = randomInt(1, 20);
      food_i.x = randomInt(1, 20);
      setFood([food_i, ...food.slice(0, food.length - 1)]);
    }

    if (head.x < 0 || head.x >= gameId || head.y < 0 || head.y >= gameId) {
      console.log('Perdió.');
      return;
    }

    tail.forEach((tailElement, index) => {
      if (head.y === tailElement.y && head.x === tailElement.x && index !== 0) {
        console.log('Perdió.');
      }
    });

    setSnake([head, ...snake.slice(0, snake.length - 1)]);
    changeCellColor(head.y, head.x, snakeColor);

    if (tail.length > 0) {
      const last_tail = tail[tail_.length - 1];

      tail.forEach((tailElement) => {
        changeCellColor(tailElement.y, tailElement.x, snakeColor);
      });

      if ((last_tail.x + last_tail.y) % 2 === 0) {
        changeCellColor(last_tail.y, last_tail.x, '#acd44f');
      } else {
        changeCellColor(last_tail.y, last_tail.x, '#7ea109');
      }
    }
  }, [snake, direction, gameId, snakeColor]);

  return (
    <div>
      <h2>Snake game</h2>
      <div className="matrix-container">
        {matrix.map((row, rowIndex) => (
          <div key={rowIndex} className="matrix-row">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className="matrix-cell"
                style={{ backgroundColor: cell.color }}
              ></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Board;
