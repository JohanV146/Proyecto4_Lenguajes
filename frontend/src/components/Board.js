import React, { useEffect, useState, useCallback } from 'react';
import './Board.css';
import { randomInt } from './utils';
import {io} from 'socket.io-client';
const socket = io('http://localhost:3005');


const Board = ({ gameId }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [matrix, setMatrix] = useState([]);
    //Cambiar la orientacion de la serpiente.
    const [direction, setDirection] = useState('RIGHT');
    //posicion de la cabeza.
    const [snake, setSnake] = useState([{ x: randomInt(5, gameId - 5), y: randomInt(5, gameId - 5) }]);

    const [food, setFood] = useState([{x:randomInt(1, gameId), y:randomInt(1, gameId)}]);

    //cola de la serpiente.
    const [tail, setTail] = useState([]);
    
    //Conexcion de los sockets
    useEffect(() => {
      socket.on('connect', () => setIsConnected(true));
      socket.on('message', (data) => {
          const food_ = { ...food[0] };
          //Aqui recibimos la matrix.
          for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].length; j++) {
              if (data[i][j] !== 0) {
                changeCellColor(i,j, 'blue');
              } else {
                if(food_.y === i && food_.x === j) {

                } else {
                  if ((i + j) % 2 == 0) {
                    changeCellColor(i,j, '#acd44f');
                  } else { 
                    changeCellColor(i,j, '#7ea109');
                  }
                }
              }
            }
          }
          //console.log(data);
      });
      socket.on('matrix', (data) => {});
    //Cerramos las peticiones.
    return () => {
        socket.off('connect');
        socket.off('message');
        socket.off('matrix');
    }
    }, [food]);
    //funcion para enviar la matrix al servidor
    const sendMatrix = (head, tail) => {
      socket.emit('message', {
          usuario: socket.id,
          head_: head,
          tail_: tail,
      });
    }

    //send size
    const sendSize = () => {
      socket.emit('matrix', {
          size: gameId
      });
    }
    
    useEffect(() => {
      // Definir dos colores alternativos
      const color1 = '#acd44f'; // 
      const color2 = '#7ea109'; // 
      
      sendSize();
      // Generar una matriz cuadrada basada en el tamaño del gameId con colores alternos
      const generateMatrix = () => {
        const size = gameId; // El tamaño de la matriz es igual al gameId
  
        const newMatrix = Array.from({ length: size }, (row, rowIndex) =>
          Array.from({ length: size }, (cell, colIndex) => {
            // Alternar entre color1 y color2 según la posición de la casilla
            const color = (rowIndex + colIndex) % 2 === 0 ? color1 : color2;
            return { color };
          })
        );
        setMatrix(newMatrix);
      };
  
      generateMatrix();
    }, [gameId]);

    //Se utiliza para cambiar el color de una casilla.
    const changeCellColor = (rowIndex, colIndex, newColor) => {
        setMatrix((prevMatrix) => {
          const updatedMatrix = [...prevMatrix];
          updatedMatrix[rowIndex][colIndex].color = newColor;
          return updatedMatrix;
        });
    };



    //Este se utiliza para cambiar la orientacion de la serpiente.
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

    //Esta se encarga de mover la cabeza por el tablero cada 0.2 segundos
    const moveSnake = useCallback(() => {
        const head = { ...snake[0] };
        const food_i = { ...food[0] };
        const tail_ = [...tail];

        const newTail = [...tail];
        newTail.pop();
        setTail([head, ...newTail]);

        //inicial apple
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
        
        //si comio
        if (head.x === food_i.x && head.y === food_i.y) {
            setTail((prevTail) => [...prevTail, ...Array(1).fill({ x: tail[tail.length - 1].x, y: tail[tail.length - 1].y })]);
            food_i.y = randomInt(1, 20);
            food_i.x = randomInt(1, 20);
            setFood([food_i, ...food.slice(0, food.length - 1)]);
        }
        
        //Colision con las pardes.
        if (head.x < 0 || head.x >= gameId || head.y < 0 || head.y >= gameId) {
            // ...
            console.log('perdió.')
            return;
        }
        
        //colision consigo mismo.
        tail.forEach((tailElement, index) => {
            //console.log(tailElement, " === ", head);
            if(head.y === tailElement.y && head.x === tailElement.x && index !== 0) {console.log("perdio")}
        });

        setSnake([head, ...snake.slice(0, snake.length - 1)]);
        //cambiamos el color de la siguiente casilla.
        
        changeCellColor(head.y, head.x, 'blue');

        //cambiamos el color de la casilla anterior.
        if (tail.length > 0) {
            const last_tail = tail[tail_.length - 1];

            tail.forEach((tailElement, index) => {
                changeCellColor(tailElement.y, tailElement.x, '#blue');
            });


            if((last_tail.x + last_tail.y) % 2 === 0) {
                changeCellColor(last_tail.y, last_tail.x, '#acd44f');
            } else {
                changeCellColor(last_tail.y, last_tail.x, '#7ea109');
            }
        }
        sendMatrix(head, tail);
    }, [snake, direction, gameId]);


    return (
      <div>
        <h2>Snake game </h2>
        <div className="matrix-container">
          {matrix.map((row, rowIndex) => (
            <div key={rowIndex} className="matrix-row">
              {row.map((cell, colIndex) => (
                <div key={colIndex} 
                className="matrix-cell" 
                style={{ backgroundColor: cell.color }}
                >
                  {/* Puedes personalizar el contenido de la casilla aquí si es necesario */}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
};

export default Board
