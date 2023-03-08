
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors())
const http = require('http');
const WebSocket = require('ws');
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (socket) => {
    console.log('WebSocket connected:', socket._socket.remoteAddress);
  
    socket.on('message', (message) => {
        console.log('WebSocket message:', message);
        const { event, data } = JSON.parse(message);
        if (['new reservation', 'available queues change', 'deleted reservation'].includes(event)) {
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({ event, data }));
            }
          });
        }
      });

  
    socket.on('close', () => {
      console.log('WebSocket closed');
    });
  });

server.listen(8000, "0.0.0.0", () => {
    const address = server.address();
    console.log(`WebSocket server listening on ${address.address}:${address.port}`);
  });