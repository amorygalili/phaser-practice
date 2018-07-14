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

function preload() {
  Game.scene.load.spritesheet('dude',
    'assets/media/images/dude.png',
    { frameWidth: 32, frameHeight: 48 }
  );
}

function create() {
  player = Game.scene.physics.add.sprite(100, 450, 'dude');
  player.setBounce(0.2);
  player.setCollideWorldBounds(true);

  Game.scene.anims.create({
    key: 'left',
    frames: Game.scene.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
  });

  Game.scene.anims.create({
    key: 'turn',
    frames: [{ key: 'dude', frame: 4 }],
    frameRate: 20
  });

  Game.scene.anims.create({
    key: 'right',
    frames: Game.scene.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1
  });
}

function moveLeft() {
  player.setVelocityX(-160);
  player.anims.play('left', true);
};

function moveRight() {
  player.setVelocityX(160);
  player.anims.play('right', true);
};

function jump() {
  player.setVelocityY(-330);
};

function stop() {
  player.setVelocityX(0);
  player.anims.play('turn');
}

function isTouchingGround() {
  return player.body.touching.down;
}

function getPlayer() {
  return player;
}