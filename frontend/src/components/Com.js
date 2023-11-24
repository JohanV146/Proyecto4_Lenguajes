import React, { useState, useEffect } from 'react';
import {io} from 'socket.io-client';
const socket = io('http://localhost:3005');

const Com = () => {

    const [isConnected, setIsConnected] = useState(false);
    useEffect(() => {
        socket.on('connect', () => setIsConnected(true));
        socket.on('message', (data) => {
            console.log(data);
    });

    return () => {
        socket.off('connect');
        socket.off('message');
    }
    }, []);


    const sendMessage = (texto) => {
    socket.emit('message', {
        usuario: socket.id,
        matrix: [[1,1,1],[2,2,2],[3,3,3]]
    });
    }


  return (
    <div>
      <label> datos nuevos, hola
      </label>
      <button onClick= {sendMessage("hola")}> btn1
      </button>
      
    </div>
  )
}
export default Com;
