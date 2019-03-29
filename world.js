/*
* World holds all the server side global info
*/

const db = require('./database.js');
const fs = require('fs');
const Player = require('./player.js');
const io = require('socket.io');


if (process.argv[2] == 'development') {
  
} else {
  
}

var players = {};
module.exports = async function(io) {
  io.on('connection', (socket) => {
    console.log('new connection'.magenta)
    var player = new Player(socket);

    socket.on('playerMove', (name, x, y) => {
      socket.broadcast.emit('playerMove', name, x, y);
      if (players[name]) {
        players[name].x = x;
        players[name].y = y;
      }
    })
    socket.on('playerJoin', (name) => {
      console.log('playerJoin'.magenta)
      socket.emit('players', players)
      socket.playerName = name;
      players[name] = {
        x: 0, y: 0, name: name
      };
      socket.broadcast.emit('playerJoin', players[name]);
    })
    socket.on('disconnect', () => {
      console.log('playerLeave'.magenta)
      socket.broadcast.emit('playerLeave', socket.playerName);
      delete players[socket.playerName];
    })
  });

};
