import Phaser from 'Phaser';

import {player, bombs, stars} from 'game-modules/units';
import level from 'game-modules/level';
import score from 'game-modules/score';


class Scene extends Phaser.Scene {

  initialize() {
    // calling the scene, assigning it "PlayGame" key
    Phaser.Scene.call(this, {key: "PlayGame"});
  }

  preload() {
    player.preload(this);
    bombs.preload(this);
    stars.preload(this);
    level.preload(this);
  }

  create() {
    level.create(this);
    score.create(this);
    player.create(this);
    stars.create(this);
    //bombs.init(this);
    //this.physics.add.collider(player.get(), level.getPlatforms());
    //this.physics.add.collider(stars.get(), level.getPlatforms());
    //this.physics.add.collider(bombs.get(), level.getPlatforms())
    //this.physics.add.overlap(player.get(), stars.get(), collectStar, null, this);
    //this.physics.add.overlap(player.get(), bombs.get(), hitBomb, null, this);
  }

  update() {
    let cursors = this.input.keyboard.createCursorKeys();
    if (cursors.left.isDown) {
      player.moveLeft();
    }
    else if (cursors.right.isDown) {
      player.moveRight();
    }
    else {
      player.stop();
    }

    if (cursors.up.isDown && player.isTouchingGround(this)) {
      player.jump();
    }
  }


}

export default new Scene();

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

