const http = require('http');
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
    //console.log('se ha conectado un cliente');
    //subscripcion para recibir los datos de los clientes.

    socket.on('message', (data) => {
        //console.log(players);

        usuario = data.usuario;
        head = data.head_;
        tail = data.tail_;
        //
        snakeColor_= data.snakeColor_;
        username_ = data.username_;
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
        tail.forEach((tailElement, index) => {
            //console.log(tailElement, " === ", head);
            if (index != tail.length - 1) {
              newMatrix[tailElement.y][tailElement.x] = 'x';
            }
        });
        //imprimirMatriz(newMatrix); 
        //         
        flag = soloMatrixToMultiplayer(newMatrix, snakeColor_);
        //if (flag == -1) {console.log("El jugador:", snakeColor_, " perdio");}

        //imprimirMatriz(matrix); 
        //Aqui reenviamos todos los datos ingresados a los demas clientes.
        io.emit('message',  {
          matrix: matrix,
          flag: flag,
          user: usuario,
          players: players
        });
        
    });
    
    //recibir el taamaño de la matriz.
    socket.on('matrix', (data) => {
        size = data.size;
        matrix = crearMatriz(data.size);
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


  
server.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});