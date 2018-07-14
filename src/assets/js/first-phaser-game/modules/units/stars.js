
let stars;

module.exports = {
  preload,
  create,
  collect,
  allCollected,
  respawn,
  get: getStars
}

function preload() {
  Game.scene.load.image('star', 'assets/media/images/star.png');
};

function create() {
  stars = Game.scene.physics.add.group({
    key: 'star',
    repeat: 11,
    setXY: { x: 12, y: 0, stepX: 70 }
  });

  stars.children.iterate(function (child) {
    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
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
