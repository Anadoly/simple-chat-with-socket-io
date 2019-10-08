const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

const users = [];
const connections = [];

server.listen(process.env.PORT || 3000);

console.log('server running...');

app.get('/', (req, res) => {
  res.sendFile(__dirname+ '/index.html');
})

io.sockets.on('connection', socket => {
  connections.push(socket);
  console.log(`Connented: %s socket connented`, connections.length);

  socket.on('disconnect', data => {
    // if(!socket.username) return;
    users.splice(users.indexOf(socket), 1);
    updateUsername();
    connections.splice(connections.indexOf(socket), 1);
    console.log(`Disconnected: %s socket connented`, connections.length);
  })

  socket.on('send message', data => {
    io.sockets.emit('new message', {msg: data, user: socket.username});
  })

  socket.on('new user', (data, callback) => {
    callback(true);
    socket.username = data;
    users.push(socket.username);
    updateUsername();
  })

  const updateUsername = () => {
    io.sockets.emit('get users', users)
  }
})