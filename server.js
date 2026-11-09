const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: { origin: "*" }
});

let jugadores = {};

io.on('connection', (socket) => {
  console.log('Jugador conectado:', socket.id);

  jugadores[socket.id] = {
    x: Math.floor(Math.random() * 400),
    y: Math.floor(Math.random() * 400),
    id: socket.id
  };

  socket.emit('actualizar_jugadores', jugadores);
  socket.broadcast.emit('nuevo_jugador', jugadores[socket.id]);

  socket.on('mover', (datosMovimiento) => {
    if (jugadores[socket.id]) {
      jugadores[socket.id].x = datosMovimiento.x;
      jugadores[socket.id].y = datosMovimiento.y;
      io.emit('jugador_movido', jugadores[socket.id]);
    }
  });

  socket.on('disconnect', () => {
    console.log('Jugador desconectado:', socket.id);
    delete jugadores[socket.id];
    io.emit('jugador_desconectado', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Servidor en puerto ${PORT}`);
});
