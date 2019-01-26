import {Physics} from 'Phaser'

const { Bodies, Body } = Physics.Matter.Matter;

let platforms;

module.exports = {
  preload,
  create,
  getPlatforms
};

function preload(scene) {
  scene.load.image('ground', 'assets/media/images/platform.png');
  scene.load.image('sky', 'assets/media/images/sky.png');
};

function create(scene) {
  
  scene.matter.world.setBounds(0, 0, 800, 600, 32, true, true, false, true);
  
  // background
  scene.add.image(400, 300, 'sky');

  let groundOptions = {
    isStatic: true,
    tags: ['ground']
  };

  scene.matter.world.add([
    scene.matter.add.image(400, 568, 'ground', null, groundOptions).setScale(2),
    scene.matter.add.image(600, 400, 'ground', null, groundOptions),
    scene.matter.add.image(50, 250, 'ground', null, groundOptions),
    scene.matter.add.image(750, 220, 'ground', null, groundOptions)
  ]);
};

function getPlatforms() {
  return platforms;
}



