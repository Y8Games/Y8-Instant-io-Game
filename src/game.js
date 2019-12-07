/*
* Connects the client side with socket.io to the server-side and displays the data to the user.
*/

import 'phaser'
import Preload from 'preloader'

export default class Game extends Phaser.Scene {

  constructor() {
    super({ key: 'game' });
  }

  preload() {
    this.width = this.sys.game.canvas.width;
    this.height = this.sys.game.canvas.height;
    this.centerX = this.width / 2;
    this.centerY = this.height / 2;
    this.buttonSound = this.sound.add('bottom', {});
    this.name = Math.random().toString(36).substring(7);
  }

  create() {
    this.ship = this.add.image(this.centerX, this.centerY, 'ship');
    
    this.ship.setInteractive({ useHandCursor: true });
    this.input.setDraggable(this.ship);
    this.players = {};

    this.socket = io(window.location.href, {
      reconnect: false
    });

    this.socket.on('connect', async () => {
      console.log('Connected, starting game')
      this.socket.emit('playerJoin', this.name)

      this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
        gameObject.x = dragX;
        gameObject.y = dragY;
        this.socket.emit('playerMove',this.name, dragX, dragY)
      });
    });

    this.socket.on('players', (players) => {
      console.log('players', players)
      for (var name in players) {
        var player = players[name];
        this.players[player.name] = player;
        var playerSprite = this.add.image(this.centerX, this.centerY, 'ship')
        playerSprite.name = player.name;
        this.players[player.name].sprite = playerSprite;
        this.players[player.name].sprite.x = player.x;
        this.players[player.name].sprite.y = player.y;
      }
    });

    this.socket.on('playerMove', (name, x, y) => {
      if (!this.players[name]) { return; }
      console.log('move', name)
      this.players[name].x = x;
      this.players[name].y = y;
      this.players[name].sprite.x = x;
      this.players[name].sprite.y = y;
    });

    this.socket.on('playerJoin', (player) => {
      console.log('playerJoin', player)
      this.players[player.name] = player
      var playerSprite = this.add.image(this.centerX, this.centerY, 'ship')
      playerSprite.name = player.name;
      this.players[player.name].sprite = playerSprite;
    });

    this.socket.on('playerLeave', (name) => {
      console.log('playerLeave')
      this.players[name].sprite.destroy()
      delete this.players[name]
    });
  }
}
