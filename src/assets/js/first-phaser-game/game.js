import Phaser from 'Phaser';
const path = require('path');

let game, scene;

module.exports = {
  get game() {
    return game;
  },
  get scene() {
    return scene;
  },
  init: (config, sceneConfig) => {
    game = new Phaser.Game(Object.assign({}, config, {
      scene: {
        preload: function() {
          scene = this;
          sceneConfig.preload();
        },
        create: function() {
          sceneConfig.create();
        },
        update: function() {
          sceneConfig.update();
        }
      }
    }));
  }
};