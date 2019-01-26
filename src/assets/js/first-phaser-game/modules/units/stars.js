
import {Physics} from 'Phaser'
const { Bodies, Body, World, Composites } = Physics.Matter.Matter;

let stars;

module.exports = {
  preload,
  create,
  collect,
  allCollected,
  respawn,
  get: getStars
}

function preload(scene) {
  scene.load.image('star', 'assets/media/images/star.png');
};

function create(scene) {
  console.log('mattter', scene.matter);

  let stars = Composites.stack(12, 0, 11, 1, 70, 0, function(x, y) {
    let star = scene.matter.add.image(x, y, 'star', null, {
      tags: ['star']
    });
    star.setBounce(Phaser.Math.FloatBetween(0.4, 0.8));
    return star.body;
  });
}

function collect(star) {
  star.disableBody(true, true);
};

function allCollected() {
  return stars.countActive(true) === 0;
};

function respawn() {
  stars.children.iterate(function (child) {
    child.enableBody(true, child.x, 0, true, true);
  });
};

function getStars() {
  return stars;
};
