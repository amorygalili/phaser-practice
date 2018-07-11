module.exports = ({ instance }) => {

  let player;

  return {
    preload,
    create,
    moveLeft,
    moveRight,
    jump,
    stop,
    getPlayer
  };

  const preload = () => {
    instance.load.spritesheet('dude',
      'assets/media/images/dude.png',
      { frameWidth: 32, frameHeight: 48 }
    );
  }

  const create = () => {
    player = this.physics.add.sprite(100, 450, 'dude');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    instance.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });

    instance.anims.create({
      key: 'turn',
      frames: [{ key: 'dude', frame: 4 }],
      frameRate: 20
    });

    instance.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
    });
  }

  const moveLeft = () => {
    player.setVelocityX(-160);
    player.anims.play('left', true);
  };

  const moveRight = () => {
    player.setVelocityX(160);
    player.anims.play('right', true);
  };

  const jump = () => {
    player.setVelocityY(-330);
  };

  const stop = () => {
    player.setVelocityX(0);
    player.anims.play('turn');
  }

  const getPlayer = () => {
    return player;
  }
}