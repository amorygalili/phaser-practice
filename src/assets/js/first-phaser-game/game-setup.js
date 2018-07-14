global.Game = require('./Game');
const config = require('./game-config');

import {player, bombs, stars} from 'game-modules/units';
import level from 'game-modules/level';
import score from 'game-modules/score';

Game.init(config, {
  preload: () => {
    player.preload();
    bombs.preload();
    stars.preload();
    level.preload();
  },
  create: () => {
    level.create();
    score.create();
    player.create();
    stars.create();
    bombs.init();
    Game.scene.physics.add.collider(player.get(), level.getPlatforms());
    Game.scene.physics.add.collider(stars.get(), level.getPlatforms());
    Game.scene.physics.add.collider(bombs.get(), level.getPlatforms())
    Game.scene.physics.add.overlap(player.get(), stars.get(), collectStar, null, Game.scene);
    Game.scene.physics.add.overlap(player.get(), bombs.get(), hitBomb, null, Game.scene);
  },
  update: () => {
    let cursors = Game.scene.input.keyboard.createCursorKeys();
    if (cursors.left.isDown) {
      player.moveLeft();
    }
    else if (cursors.right.isDown) {
      player.moveRight();
    }
    else {
      player.stop();
    }

    if (cursors.up.isDown && player.isTouchingGround()) {
      player.jump();
    }
  }
});

function collectStar(player, star) {
  stars.collect(star);
  score.add(10);

  if (stars.allCollected()) {
    stars.respawn();
    var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
    bombs.add(x);
  }
}

function hitBomb(player, bomb) {
  this.physics.pause();
  player.setTint(0xff0000);
  player.anims.play('turn');
}

