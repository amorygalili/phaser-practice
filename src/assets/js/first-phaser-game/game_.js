import Phaser from 'Phaser';
import { player, bombs, stars } from './units';
import level from './level';
import score from './score';

var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: {
    preload: preload,
    create: create,
    update: update
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
};

var game = new Phaser.Game(config);


function preload() {

}

function create() {

}

/*

function preload() {

}

function create({ bombs, score, stars }) {
  this.physics.add.collider(player, platforms);
  this.physics.add.collider(stars, platforms);
  this.physics.add.overlap(player, stars, collectStar, null, this);



  function collectStar (player, star)
  {
    stars.disable(star);
    score.update.add(10);

    if (stars.allCollected())
    {
      stars.children.iterate(function (child) {

          child.enableBody(true, child.x, 0, true, true);

      });

      var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
      bombs.create(x);
    }
  }

  scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });


  bombs = this.physics.add.group();

  this.physics.add.collider(bombs, platforms);

  this.physics.add.collider(player, bombs, hitBomb, null, this);

  function hitBomb (player, bomb)
  {
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play('turn');

    gameOver = true;
  }
}

function update() {

}

*/