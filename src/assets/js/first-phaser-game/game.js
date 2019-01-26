
import Phaser from 'Phaser';
import scene from './scenes/scene';

const gameConfig = {
  type: Phaser.CANVAS,
  width: 800,
  height: 600,
  backgroundColor: '#1b1464',
  physics: {
    // we are using matter.js engine
    default: "matter",
    matter: {
      gravity: {
        y: 1
    },
    }
  },
  scene: [scene]
};

const game = new Phaser.Game(gameConfig);
