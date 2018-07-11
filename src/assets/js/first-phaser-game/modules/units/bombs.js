module.exports = ({ instance }) => {

  let bombs;

  return {
    preload,
    create,
    getBombs
  };

  const preload = () => {
    instance.load.image('bomb', 'assets/media/images/bomb.png');
  }

  const create = () => {
    bomb = bombs.create(x, 16, 'bomb');
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    bomb.allowGravity = false;
  }

  const getBombs = () => {
    return bombs;
  }
}