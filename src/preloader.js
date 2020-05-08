/*
* Preload all assets at the start and show the progress.
*/

import 'phaser'

export default class Preloader extends Phaser.Scene {

  constructor () {
    super({ key: 'preloader' });
  }

  preload () {
    this.width = this.sys.game.canvas.width;
    this.height = this.sys.game.canvas.height;
    this.centerX = this.width / 2;
    this.centerY = this.height / 2;
    this.progressBar = this.add.image(this.centerX, this.centerY, 'progressBar')

    // Loading
    this.load.image('playBtn', 'src/img/play.png');
    this.load.image('gem', 'src/img/gem.png');
    this.load.spritesheet('coin', 'src/img/coin.png', { frameWidth: 32, frameHeight: 32 });
    this.load.image('ship', 'src/img/ship.png');
    //this.load.atlas('flood', 'src/atlas/blobs.png', 'src/atlas/blobs.json');
    this.load.audio('button', ['src/sound/button.mp3']);
    this.load.image('ground_1x1', 'src/img/ground_1x1.png');
    this.load.tilemapTiledJSON('map', 'src/tile-collision-test.json');

    this.loadingText = this.add.text(this.centerX, this.centerY, 'Loading... ', { fontFamily: '"Roboto Condensed"' });
    this.load.on('progress', (value) => {
      this.loadingText.setText('loading.. ' + parseInt(value * 100) + '%');
      this.progressBar.displayWidth = parseInt(value * 720)
    });

    this.load.on('complete', () => {
      this.loadingText.destroy();
      //this.progressBar.destroy();
      this.playBtn = this.add.image(this.centerX, this.centerY + 200, 'playBtn');
      this.playBtn.setScale(0.4)
      this.playBtn.setInteractive({ useHandCursor: true })
      this.playBtn.name = 'play';
    });
  }

  create() {
    this.input.on('gameobjectdown', this.handleClicks, this);
  }

  handleClicks(pointer, object) {
    if (object.name == 'play') {
      this.scene.start('game');
    }
  }
}
