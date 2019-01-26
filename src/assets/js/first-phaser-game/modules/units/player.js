import * as utils from '../../utils';
import {Physics} from 'Phaser'
const { Bodies, Body, World, Composite } = Physics.Matter.Matter;

let player;

module.exports = {
  preload,
  create,
  moveLeft,
  moveRight,
  jump,
  stop,
  isTouchingGround,
  get: getPlayer
};

function preload(scene) {
  scene.load.spritesheet('dude',
    'assets/media/images/dude.png',
    { frameWidth: 32, frameHeight: 48 }
  );
}

function create(scene) {
  player = scene.matter.add.sprite(100, 450, 'dude', 0, {
     tags: ['player']
  });
  player.setBounce(0.2);

  scene.anims.create({
    key: 'left',
    frames: scene.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
  });

  scene.anims.create({
    key: 'turn',
    frames: [{ key: 'dude', frame: 4 }],
    frameRate: 20
  });

  scene.anims.create({
    key: 'right',
    frames: scene.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1
  });
}

function moveLeft() {
  player.setVelocityX(-5);
  player.anims.play('left', true);
};

function moveRight() {
  player.setVelocityX(5);
  player.anims.play('right', true);
};

function jump() {
  player.setVelocityY(-12);
};

function stop() {
  player.setVelocityX(0);
  player.anims.play('turn');
}

function isTouchingGround(scene) {
  let collisions = utils.getCollisions(scene, player.body, 'ground');
  return collisions.length > 0;
}

function getPlayer() {
  return player;
}