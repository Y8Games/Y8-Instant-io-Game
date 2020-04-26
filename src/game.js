/*
* Connects the client side with socket.io to the server-side and displays the data to the user.
*/

import 'phaser'
import Preload from 'preloader'
import * as tf from '@tensorflow/tfjs';

export default class Game extends Phaser.Scene {

  constructor() {
    super({ key: 'game' });
  }

  preload() {
    this.outputCount = 4;
    this.trainingCount = 15;
    this.width = this.sys.game.canvas.width;
    this.height = this.sys.game.canvas.height;
    this.centerX = this.width / 2;
    this.centerY = this.height / 2;
    this.buttonSound = this.sound.add('bottom', {});
    this.name = Math.random().toString(36).substring(7);
  }

  create() {
    this.model = tf.sequential();
    this.model.add(tf.layers.conv2d({
      inputShape: [224, 224 , 3],
      kernelSize: 5,
      filters: 8,
      strides: 1,
      activation: 'relu',
      kernelInitializer: 'VarianceScaling',
      returnSequences: true,
    }));
    //this.model.add(tf.layers.simpleRNN({
    //  units: this.outputCount,
    //  returnSequences: true,
    //}));
    this.model.add(tf.layers.timeDistributed(
      {layer: tf.layers.dense({units: this.outputCount})}));
    this.model.add(tf.layers.activation({activation: 'softmax'}));
    this.model.compile({
      loss: 'categoricalCrossentropy',
      optimizer: 'sgd',
      metrics: ['accuracy']
    });

    const map = this.make.tilemap({ key: 'map' });
    var groundTiles = map.addTilesetImage('ground_1x1');
    var coinTiles = map.createFromObjects('gem');
    map.createDynamicLayer('Background Layer', groundTiles, 0, 0);
    var groundLayer = map.createDynamicLayer('Ground Layer', groundTiles, 0, 0);
    //var coinLayer = map.createDynamicLayer('Coin Layer', coinTiles, 0, 0);

    groundLayer.setCollisionBetween(1, 25);

    // This will set Tile ID 26 (the coin tile) to call the function "hitCoin" when collided with
    //coinLayer.setTileIndexCallback(26, hitCoin, this);

    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    this.ship = this.physics.add.sprite(this.centerX, this.centerY - 160, 'ship')
    this.ship.setBounce(0.1);
    this.ship.scale = 0.5 

    this.physics.add.collider(this.ship, groundLayer);
    //this.physics.add.overlap(this.ship, coinLayer);
    this.cameras.main.startFollow(this.ship);

    var debugGraphics = this.add.graphics();

    
    this.ship.setInteractive({ useHandCursor: true });
    this.input.setDraggable(this.ship);

    this.input.keyboard.on('keydown-UP', (event) => {
     this.ship.y -= 5;
    });
    this.input.keyboard.on('keydown-RIGHT', (event) => {
      this.ship.x += 5;
    });
    this.input.keyboard.on('keydown-DOWN', (event) => {
      this.ship.y += 5;
    });
    this.input.keyboard.on('keydown-LEFT',  (event) => {
      this.ship.x -= 5;
    });

    this.input.keyboard.on('keyup-M', (event) => {
      var machineCanvas = document.getElementById('machine-canvas');
      var humanCanvas = document.getElementById('phaser');

      if (window.getComputedStyle(machineCanvas).display === 'none') {
        machineCanvas.style.display = 'block';
        humanCanvas.style.display = 'none';
      } else {
        machineCanvas.style.display = 'none';
        humanCanvas.style.display = 'block';
      }
    }, this);

    this.input.keyboard.on('keyup-E', (event) => {
      this.evaluate();
    });

    this.input.keyboard.on('keyup-T', (event) => {
      for (var i = 1 ; i < this.trainingCount; i++) {
        console.log('train step ' + i);
        this.train(document.getElementById('replay').children[i]);
      }
    });

    setTimeout(() => {
      this.captureReplay();
    }, 1000)
  }

  async evaluate() {
    this.game.renderer.snapshot(async (image) => {
      var mc = document.getElementById('machine-canvas');
      var context = mc.getContext('2d');
      var scale = this.scaleImage(image.width, image.height, 224, 224, false);
      
      context.drawImage(
        image,
        scale.targetleft,
        scale.targettop,
        scale.width,
        scale.height
      );

      var newImg = new Image;
      newImg.onload = async () => {
        var tensor = tf.browser.fromPixels(newImg)
        tensor = tf.cast(tensor, "float32");

        var offset = tf.scalar(127.5);
        // Normalize the image from [0, 255] to [-1, 1].
        var normalized = tensor.sub(offset).div(offset);

        // Reshape to a single-element batch
        var batched = tensor.reshape([1, 224, 224, 3]);

        this.output = this.model.apply(batched);
        this.output.print();
      }
      newImg.src = mc.toDataURL();
    });
  }

  captureReplay() {
    var timer = this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.captureCanvas()
      },
      callbackScope: this,
      repeat: this.trainingCount - 1
    });
  }

  captureCanvas() {
    this.game.renderer.snapshot((image) => {
      console.log(' capturing new training image')
      var mc = document.getElementById('machine-canvas');
      var context = mc.getContext('2d');
      var scale = this.scaleImage(image.width, image.height, 224, 224, false);
      
      context.drawImage(
        image,
        scale.targetleft,
        scale.targettop,
        scale.width,
        scale.height
      );

      var newImg = new Image;
      newImg.onload = () => {
        document.getElementById('replay').appendChild(newImg);
      }
      newImg.src = mc.toDataURL();
    });
  }

  train(img) {
    var tensor = tf.browser.fromPixels(img)
    tensor = tf.cast(tensor, "float32");

    var offset = tf.scalar(127.5);
    // Normalize the image from [0, 255] to [-1, 1].
    var normalized = tensor.sub(offset).div(offset);

    // Reshape to a single-element batch
    var batched = tensor.reshape([1, 224, 224, 3]);

    var smaller = batched.squeeze([0]);

    console.log(smaller)
  
    this.output = this.model.apply(batched);

     

  }

  async train2(iterations, batchSize, numTestExamples) {
    this.trainXs // train data
    this.trainYs // test data
    for (let i = 0; i < iterations; ++i) {
      const history = await this.model.fit(this.trainXs, this.trainYs, {
        epochs: 1,
        batchSize,
        validationData: [this.testXs, this.testYs],
        yieldEvery: 'epoch'
      });
  }

  scaleImage(srcwidth, srcheight, targetwidth, targetheight, fLetterBox) {
    var result = { width: 0, height: 0, fScaleToTargetWidth: true };

    if ((srcwidth <= 0) || (srcheight <= 0) || (targetwidth <= 0) || (targetheight <= 0)) {
      return result;
    }

    // scale to the target width
    var scaleX1 = targetwidth;
    var scaleY1 = (srcheight * targetwidth) / srcwidth;

    // scale to the target height
    var scaleX2 = (srcwidth * targetheight) / srcheight;
    var scaleY2 = targetheight;

    // now figure out which one we should use
    var fScaleOnWidth = (scaleX2 > targetwidth);
    if (fScaleOnWidth) {
      fScaleOnWidth = fLetterBox;
    } else {
      fScaleOnWidth = !fLetterBox;
    }

    if (fScaleOnWidth) {
      result.width = Math.floor(scaleX1);
      result.height = Math.floor(scaleY1);
      result.fScaleToTargetWidth = true;
    } else {
      result.width = Math.floor(scaleX2);
      result.height = Math.floor(scaleY2);
      result.fScaleToTargetWidth = false;
    }
    result.targetleft = Math.floor((targetwidth - result.width) / 2);
    result.targettop = Math.floor((targetheight - result.height) / 2);

    return result;
  }
}
