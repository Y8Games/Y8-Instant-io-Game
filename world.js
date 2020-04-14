/*
* World holds all the server side global info and holds player classes.
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
    if (process.argv[2] == 'development') {
      console.log('new connection'.magenta)
    }

    var player = new Player(socket);

    socket.on('playerMove', (name, x, y) => {
      socket.broadcast.emit('playerMove', name, x, y);
      if (players[name]) {
        players[name].x = x;
        players[name].y = y;
      }
    });

    socket.on('playerJoin', (name) => {
      socket.emit('players', players)
      socket.playerName = name;
      players[name] = {
        x: 0, y: 0, name: name
      };
      socket.broadcast.emit('playerJoin', players[name]);
      if (process.argv[2] == 'development') {
        console.log('playerJoin'.magenta)
      }
    });

    socket.on('disconnect', () => {
      socket.broadcast.emit('playerLeave', socket.playerName);
      delete players[socket.playerName];
      if (process.argv[2] == 'development') {
        console.log('playerLeave'.magenta)
      }
    });
  });

};
