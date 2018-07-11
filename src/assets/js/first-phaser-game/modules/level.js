module.exports = ({ instance }) => {

  return {
    preload,
    create
  };

  const preload = () => {
    instance.load.image('ground', 'assets/media/images/platform.png');
    instance.load.image('sky', 'assets/media/images/sky.png');
  };

  const create = () => {
    instance.add.image(400, 300, 'sky');

    let platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');
  };
};



