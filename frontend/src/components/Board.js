import React, { useEffect, useState, useCallback } from 'react';
import './Board.css';
import { randomInt } from './utils';


import {io} from 'socket.io-client';
import { FaRegClock } from 'react-icons/fa'; 
import Winner from './Winner';

//https://2579-201-197-80-5.ngrok-free.app/
//http://localhost:3005

const socket = io('https://minority-hairy-fort-textbooks.trycloudflare.com');

const Board = ({ gameId, snakeColor, username, code, numPlayers, tipo, tipo2:propTipo2 }) => {
    const [gameOver, setGameOver] = useState(false);

    const [save, setSave] = useState(false);
    const [winner, setWinner] = useState('');

    const [tipo2, setTipo2] = useState(propTipo2);

    const [players, setPlayers] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const [matrix, setMatrix] = useState([]);
    //Cambiar la orientacion de la serpiente.
    const [direction, setDirection] = useState('RIGHT');
    //posicion de la cabeza.
    const [snake, setSnake] = useState([{ x: randomInt(5, gameId - 5), y: randomInt(5, gameId - 5) }]);

    const [food, setFood] = useState([{x:randomInt(1, gameId), y:randomInt(1, gameId)}]);

    //cola de la serpiente.
    const [tail, setTail] = useState([]);

    const [flagActivated, setFlagActivated] = useState(false);

    const [time, setTime] = useState(tipo2);

    useEffect(() => {
    // Only set up the timer if tipo is '0'
      if (tipo === '0') {
          const timerInterval = setInterval(() => {
          setTime((prevTime) => {
              const newTime = prevTime - 1;
              if (newTime === 0 && tipo === '0') {
              clearInterval(timerInterval);
              setTipo2(0);
              }
              return newTime;
          });
          }, 1000);

          return () => {
          clearInterval(timerInterval);
          };
      }
    }, [tipo, tipo2]);

    const formatTime = (seconds) => {
      if (tipo === '0') {
        const minutes = Math.max(Math.floor(seconds / 60), 0); // Asegúrate de que los minutos no sean negativos
        const remainingSeconds = Math.max(seconds % 60, 0); // Asegúrate de que los segundos no sean negativos
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
      } else {
        return '0:00';
      }
    };


    //Conexcion de los sockets
    useEffect(() => {
      const head = { ...snake[0] };
      socket.on('connect', () => setIsConnected(true));
      socket.on('message', (data) => {

          if(data.juegoFinalizado) {
            handleGameOver(data.winner);

            if (save == false) {
              console.log(save);
              sendData(data.players);
              // Actualizar save
              setSave(true);
            }
          }
          const players_ = data.players;
          setPlayers(players_);
          

          const matrix_ = data.matrix
          //Si colisiona con otros jugadores.
          if (data.user === socket.id && data.flag === -1) {
            head.y = randomInt(5, gameId - 5);
            head.x = randomInt(5, gameId - 5);
            setTail([]);
            setSnake([head, ...snake.slice(0, snake.length - 1)]);
            sendMatrix(head, tail);
            return;
          }
          const food_ = { ...food[0] };
          //Aqui recibimos la matrix.
          for (let i = 0; i < matrix_.length; i++) {
            for (let j = 0; j < matrix_[i].length; j++) {
              if (matrix_[i][j] !== 0) {

                  changeCellColor(i,j, '#' + matrix_[i][j]);
                //changeCellColor(i,j, '#' + snakeColor);
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
      });
      socket.on('matrix', (data) => {});
    //Cerramos las peticiones.
    return () => {
        socket.off('connect');
        socket.off('message');
        socket.off('matrix');
        socket.off('guardarLista');
    }
    }, [food, save]);
    //funcion para enviar la matrix al servidor
    const sendMatrix = (head, tail) => {
      socket.emit('message', {
          usuario: socket.id,
          head_: head,
          tail_: tail,
          snakeColor_ : snakeColor,
          username_ : username,
          tipoP: tipo,
          size: tipo2
      });
    }

    const sendData = (lista) => {
      socket.emit('guardarLista', lista);
    };

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

    const handleKeyPress = (event) => {
      switch (event.key) {
        case 'ArrowUp':
          setDirection((prevDirection) => (prevDirection !== 'DOWN' ? 'UP' : prevDirection));
          break;
        case 'ArrowDown':
          setDirection((prevDirection) => (prevDirection !== 'UP' ? 'DOWN' : prevDirection));
          break;
        case 'ArrowLeft':
          setDirection((prevDirection) => (prevDirection !== 'RIGHT' ? 'LEFT' : prevDirection));
          break;
        case 'ArrowRight':
          setDirection((prevDirection) => (prevDirection !== 'LEFT' ? 'RIGHT' : prevDirection));
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
        const gameInterval = setInterval(moveSnake, 150);

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
            food_i.y = randomInt(1, gameId - 1);
            food_i.x = randomInt(1, gameId - 1);
            setFood([food_i, ...food.slice(0, food.length - 1)]);
        }

        //Colision con las pardes.
        if (head.x < 0 || head.x >= gameId || head.y < 0 || head.y >= gameId) {
            // ...
            head.y = randomInt(5, gameId - 5);
            head.x = randomInt(5, gameId - 5);
            setTail([]);
        }

        //colision consigo mismo.
        tail.forEach((tailElement, index) => {

            if(head.y === tailElement.y && head.x === tailElement.x && index !== 0) {
              head.y = randomInt(5, gameId - 5);
              head.x = randomInt(5, gameId - 5);
              setTail([]);
            }
        });

        setSnake([head, ...snake.slice(0, snake.length - 1)]);
        sendMatrix(head, tail);
    }, [snake, direction, gameId]);


     const handleStartClick = () => {
       setFlagActivated(true);
     };

     const handleGameOver = (playerName) => {
      setGameOver(true);
      setWinner(playerName);
    };
  

    return (
      <div className="board-container">
        {gameOver ? (
          <Winner tipo={tipo} nombreJugador={winner} tipo2={tipo2} />
        ) : (
          <>
              <div className="info-container">
                <h1>Codigo de partida: {code}</h1>
                <h2>Jugadores: {numPlayers / 10}</h2>
                {tipo === '0' ? (
                  <div className="countdown-container">
                    <FaRegClock size={30} />
                    <span>{formatTime(time)}</span>
                  </div>
                ) : (
                  <div>
                    <label>Largo</label>
                    <p>{tipo2}</p>
                  </div>
                )}
                <h2>Username: {username}</h2>
                {players.map((player, index) => (
                  <h2 key={index} style={{ backgroundColor: `#${player[1]}`, color: 'white' }}>
                  {player[0]} puntaje: {player[2]}
                  </h2>
                ))}
                {flagActivated ? (
                 <p></p>
                ) : (
                  <button onClick={handleStartClick}>Iniciar</button>
                )}
              </div>
              <div className="matrix-container">
                {matrix.map((row, rowIndex) => (
                  <div key={rowIndex} className="matrix-row">
                    {row.map((cell, colIndex) => (
                      <div
                        key={colIndex}
                        className="matrix-cell"
                        style={{ backgroundColor: cell.color }}
                      >
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </>
        )}
      </div>
    );
};

export default Board