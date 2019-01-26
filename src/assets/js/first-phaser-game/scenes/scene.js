import Phaser from 'Phaser';
import _ from 'lodash';

class Scene extends Phaser.Scene {

  initialize() {
    // calling the scene, assigning it "PlayGame" key
    Phaser.Scene.call(this, {key: "PlayGame"});
  }

  preload() {
    // 700 x 380
    this.load.image('block', 'assets/media/images/block.png');
    // 124 x 126
    this.load.image('block2', 'assets/media/images/block2.png');
  }

  create() {

    //World boundary
    this.matter.world.setBounds(0, 0, 800, 600, 32, true, true, false, true);

    const canDrag = this.matter.world.nextGroup();

    console.log(this.createBlock(1, 11, 1, 18).setCollisionGroup(canDrag))  //top
    this.createBlock(1, 0, 1, 18).setCollisionGroup(canDrag)  //ground
    this.createBlock(1, 1, 10, 1).setCollisionGroup(canDrag) //left block
    this.createBlock(18, 1, 10, 1).setCollisionGroup(canDrag)  //right block

    //  Constraint on canDrag items
    this.matter.add.mouseSpring({ length: 1, stiffness: 0.6, angularStiffness: 0,  collisionFilter: { group: canDrag } });


    this.splitBlock();
  }

  createBlock(x, y, rows, cols) {
    // 40x40 px
    let width = 40 * cols;
    let height = 40 * rows;

    x = x * 40 + width / 2;
    y = 600 - y * 40 - height / 2;

    let sprite = this.add.tileSprite(x, y, 124 * cols, 124 * rows, 'block2');
    return this.matter.add.gameObject(sprite)
      .setFrictionAir(0.01)
      .setFriction(.4)
      .setFrictionStatic(2)
      .setBounce(0)
      .setScale(.32258);
  }

  //input: block
  //output: 2 new blocks
  splitBlock(block) {
    // top, right, bottom, left
    let edges = _.range(4);

    // randomly select first edge
    let edge1 = _.random(0, 3);

    // remove edge1 so we don't select it again
    edges.splice(edge1, 1);

    let edge2 = edges[_.random(0, 2)];

    console.log('edges:', edge1, edge2);

  }


  setSize(image, aspectRatio, width, height) {

  }


  update() {
   
  }


}

export default new Scene();
