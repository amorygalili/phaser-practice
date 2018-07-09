import Phaser from 'Phaser';

var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: {
      preload: preload,
      create: create,
      update: update
  }
};

var game = new Phaser.Game(config);

function preload () {
  this.load.image('sky', 'assets/media/images/sky.png');
  this.load.image('ground', 'assets/media/images/platform.png');
  this.load.image('star', 'assets/media/images/star.png');
  this.load.image('bomb', 'assets/media/images/bomb.png');
  this.load.spritesheet('dude', 
      'assets/media/images/dude.png',
      { frameWidth: 32, frameHeight: 48 }
  );
}

function create ()
{
}

function update ()
{
}