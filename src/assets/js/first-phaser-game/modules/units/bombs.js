

let bombs;

module.exports = {
  preload,
  init,
  add,
  get: getBombs
};

function preload(scene) {
  scene.load.image('bomb', 'assets/media/images/bomb.png');
}

function init(scene) {
  bombs = scene.physics.add.group();
}

function add(x) {
  let bomb = bombs.create(x, 16, 'bomb');
  bomb.setBounce(1);
  bomb.setCollideWorldBounds(true);
  bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
  bomb.allowGravity = false;
}

function getBombs() {
  return bombs;
}