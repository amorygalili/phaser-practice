module.exports = ({ instance }) => {

  let stars;

  return {
    preload,
    create,
    collect,
    allCollected,
    respawn,
    getStars
  }

  const preload = () => {
    instance.load.image('star', 'assets/media/images/star.png');
  };

  const create = () => {
    stars = instance.physics.add.group({
      key: 'star',
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 }
    });

    stars.children.iterate(function (child) {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });
  }

  const collect = (star) => {
    star.disableBody(true, true);
  };

  const allCollected = () => {
    return stars.countActive(true) === 0;
  };

  const respawn = () => {
    stars.children.iterate(function (child) {
      child.enableBody(true, child.x, 0, true, true);
    });
  };

  const getStars = () => {
    return stars;
  };
};
