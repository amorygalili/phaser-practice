
let platforms;

module.exports = {
  preload,
  create,
  getPlatforms
};

function preload() {
  Game.scene.load.image('ground', 'assets/media/images/platform.png');
  Game.scene.load.image('sky', 'assets/media/images/sky.png');
};

function create() {
  Game.scene.add.image(400, 300, 'sky');

  platforms = Game.scene.physics.add.staticGroup();
  platforms.create(400, 568, 'ground').setScale(2).refreshBody();
  platforms.create(600, 400, 'ground');
  platforms.create(50, 250, 'ground');
  platforms.create(750, 220, 'ground');
};

function getPlatforms() {
  return platforms;
}



