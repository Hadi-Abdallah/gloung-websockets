const express = require('express');
const app = express();

const http = require('http');
const server = http.createServer(app);

const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }
});

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on('message', (message) => {
    console.log('WebSocket message:', message);
    if (['new reservation', 'available queues change', 'deleted reservation'].includes(message)) {
      io.emit('message', message);
    }
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  const address = server.address();
  console.log(`WebSocket server listening on ${address.address}:${address.port}`);
});
