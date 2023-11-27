const http = require('http');
const fs = require('fs'); 
const PORT = process.env.PORT || 3005;

const server = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World!');
});



const io =  require('socket.io')(server, {
    cors: { origin: '*' }
});

size = 0;
matrix = [];
players = [];

io.on('connection', (socket) => {
    //subscripcion para recibir los datos de los clientes.
    socket.on('message', (data) => {
        //time or size
        tipoP = data.tipoP;
        score = data.size;
        //datos genericos.
        usuario = data.usuario;
        head = data.head_;
        tail = data.tail_;
        //
        snakeColor_= data.snakeColor_;
        username_ = data.username_;
        //max puntaje
        maxScore = verificarEstado(score);

        //aqui validamos si la partida sigue en pie.
        if ((tipoP == 0 && score == 0) ||  (maxScore ==-1 && tipoP == 1)) { 
          io.emit('message',  {
            matrix: matrix,
            flag: flag,
            user: usuario,
            players: players,
            juegoFinalizado: true,
            winner: username_

          });
        } else { 
          //puntajes, colores y nombre.
          flagExisteJugador = 1;

          players.forEach((gameUser, index) => {
            //si el jugador existe no se agrega.
            if (gameUser[0] == username_) {flagExisteJugador = 0;}
          });

          if(flagExisteJugador == 1) {
            players.push([username_, snakeColor_, 1, usuario]);
          }

          //actualizamos el puntaje del jugador:
          players.forEach((gameUser) => {
            //si el jugador existe no se agrega.
            if (gameUser[0] == username_) {gameUser[2] = tail.length;}
          });

          newMatrix = crearMatriz(size);
          newMatrix[head.y][head.x] = snakeColor_;
          //dibujamos la serpiente en la matriz local.
          tail.forEach((tailElement, index) => {
              if (index != tail.length - 1) {
                newMatrix[tailElement.y][tailElement.x] = 'x';
              }
          });
          //         
          flag = soloMatrixToMultiplayer(newMatrix, snakeColor_);
          //enviamos la repsuesta con los datos actualizados.
          io.emit('message',  {
            matrix: matrix,
            flag: flag,
            user: usuario,
            players: players,
            juegoFinalizado: false,
            winner: ''
          });
        }
        
    });
    
    //recibir el taamaño de la matriz.
    socket.on('matrix', (data) => {
        size = data.size;
        matrix = crearMatriz(data.size);
    });

    //recibe la instruccion de almacenar la partida.
    socket.on('guardarLista', (nuevaLista) => {
      // Puedes manejar la nueva lista como lo desees, por ejemplo, guardándola en un archivo JSON
      guardarListaEnJSON(nuevaLista);
      console.log('Lista guardada mediante el evento "guardarLista".');
    });
    
});
//se encarga de crear una matriz nxn.
function crearMatriz(n) {
    let matriz = [];
  
    for (let i = 0; i < n; i++) {
      let fila = [];
      for (let j = 0; j < n; j++) {
        fila.push(0);
      }
      matriz.push(fila);
    }
  
    return matriz;
}
//imprime una matrix nxn.
function imprimirMatriz(matriz) {
    for (let i = 0; i < matriz.length; i++) {
      for (let j = 0; j < matriz[i].length; j++) {
        process.stdout.write(matriz[i][j] + '\t');
      }
    }
  }


//imprime una matrix nxn.
function soloMatrixToMultiplayer(matriz, snakeColor_) {
  deleteSnake(snakeColor_);
  for (let i = 0; i < matriz.length; i++) {
    for (let j = 0; j < matriz[i].length; j++) {
      //Si la posicion actual de la matriz es una parte de la serpiente.
      if( matriz[i][j] != 0) {
        if(matrix[i][j] == 0) {
          matrix[i][j] = snakeColor_;
        } else {
          //si la posicion que colisiono es la cabeza.
          if (matriz[i][j] == snakeColor_) {
            return -1;
          }
        }
      }
    }
  }
  return 1;
}

//borrar jugador del tablero para actualizar su posicion.
function deleteSnake(usuario) {
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if( matrix[i][j] == usuario) {
        matrix[i][j] = 0;
      }
    }
  }
}

function verificarEstado(n) {
  for (let i = 0; i < players.length; i++) {
    if (players[i][2] == n) {
      return -1;
    }
  }
  return 0;
}


function guardarListaEnJSON(lista) {
  let contenidoActual;

  try {
    contenidoActual = fs.readFileSync('historial.json', 'utf8');
  } catch (error) {
    console.error('Error al leer el archivo JSON:', error);
    contenidoActual = '[]'; 
  }

  let listaExistente;
  try {
    listaExistente = JSON.parse(contenidoActual);
  } catch (error) {
    console.error('Error al analizar el contenido JSON existente:', error);
    listaExistente = [];
  }

  listaExistente = listaExistente.concat(lista);

  const jsonString = JSON.stringify(listaExistente);


  fs.writeFile('historial.json', jsonString, 'utf8', (err) => {
    if (err) {
      console.error('Error al guardar la lista en el archivo JSON:', err);
    } else {
      console.log('Lista agregada al archivo JSON correctamente.');
    }
  });
}
  
server.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});