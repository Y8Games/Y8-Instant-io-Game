/*
* Index is the start of Phaser. The chain goes like index, preloader, game.
*/

import 'phaser';
import pkg from 'phaser/package.json';
import Preloader from 'preloader';
import Game from 'game';

window.width = 1080;
window.height = 720;

const config = {
  width: window.width,
  height: window.height,
  transparent: false,
  parent: 'phaser',
  type: Phaser.AUTO,
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 100 } }
  },
  scene: [{ preload, create}, Preloader, Game ],
  autoCenter: 1,
  scaleMode: 3,
  backgroundColor: '38384d'
};

window.game = new Phaser.Game(config);

function preload() {
  // pre preload, so the preloader has art to show while loading
  this.load.image('progressBar', 'src/img/backscroll.png');
}

async function create() {
  this.scene.start('preloader');
}
