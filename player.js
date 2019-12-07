/*
* Player holds all the server side code related to player interaction and data
*/
const db = require('./database.js');
const fs = require('fs');

module.exports = class Player {
  constructor(socket) {
    this.socket = socket;
  
    this.socket.on('somethingSpecial', (id) => { this.somethingSpecial(id) })
  }

  async somethingSpecial(id) { // example of receiving and sending data
    this.socket.emit('somethingElse', 'somedata')
  }
}
