/*
* Index is the start of Phaser. The chain goes like index, preloader, map, game. 
*/

import 'phaser';
import pkg from 'phaser/package.json';
import Preloader from 'preloader';
import Game from 'game';

const width = 1080;
const height = 720;
window.width = width;
window.height = height;

const config = {
  width,
  height,
  transparent: false,
  parent: 'phaser',
  type: Phaser.AUTO,
  scene: [{ preload, create}, Preloader, Game ],
  autoCenter: 1,
  scaleMode: 3,
  backgroundColor: '38384d'
};

const game = new Phaser.Game(config);
window.game = game;

function preload() {
  // pre preload, so the preloader has art to show
  this.load.image('progressBar', 'src/img/backscroll.png');
}

async function create() {
  this.scene.start('preloader');
}
