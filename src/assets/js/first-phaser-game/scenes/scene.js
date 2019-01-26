import Phaser from 'Phaser';
import _ from 'lodash';

const { Bodies, Body, Vertices } = Phaser.Physics.Matter.Matter;

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

    let block = this.createBlock(1, 11, 1, 18).setCollisionGroup(canDrag)  //top
    this.createBlock(1, 0, 1, 18).setCollisionGroup(canDrag)  //ground
    this.createBlock(1, 1, 10, 1).setCollisionGroup(canDrag) //left block
    this.createBlock(18, 1, 10, 1).setCollisionGroup(canDrag)  //right block

    //  Constraint on canDrag items
    this.matter.add.mouseSpring({ length: 1, stiffness: 0.6, angularStiffness: 0,  collisionFilter: { group: canDrag } });

    this.splitBlock(block);
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

    console.log('block:', block.x);

    let vertices = block.body.vertices;
    let boundsMin = block.body.bounds.min;
    let boundsMax = block.body.bounds.max;
    let width = boundsMax.x - boundsMin.y;
    let height = boundsMax.y - boundsMin.y;

    console.log('vertices:', block);

    let edgeCount = vertices.length;

    // top, right, bottom, left
    let edges = _.range(edgeCount);
    // randomly select first edge
    let edge1 = _.random(0, edgeCount - 1);
    // remove edge1 so we don't select it again
    edges.splice(edge1, 1);
    // randomly select second edge
    let edge2 = edges[_.random(0, edgeCount - 2)];

    // select random point on edges
    if (edge1 < edge2) {
      var splitPoint1 = this.getRandomPointOnLine(vertices[edge1], vertices[(edge1 + 1) % edgeCount]);
      var splitPoint2 = this.getRandomPointOnLine(vertices[edge2], vertices[(edge2 + 1) % edgeCount]);
    }
    else {
      var splitPoint1 = this.getRandomPointOnLine(vertices[edge2], vertices[(edge2 + 1) % edgeCount]);
      var splitPoint2 = this.getRandomPointOnLine(vertices[edge1], vertices[(edge1 + 1) % edgeCount]);
    }

    // create first shape
    //input: vertices, splitpoint
    //output: two new blocks
    
    let verticesWithSplitPoints = [...vertices];

    let splitPoint1Index = edge1 + 1;
    let splitPoint2Index = edge2 + 2;
    verticesWithSplitPoints.splice(splitPoint1Index, 0, splitPoint1);
    verticesWithSplitPoints.splice(splitPoint2Index, 0, splitPoint2);

    let shape1Vertices = [];
    let shape2Vertices = [];

    console.log('verticesWithSplitPoints:', verticesWithSplitPoints);

    for (let i = splitPoint1Index; i < splitPoint1Index + edgeCount + 3; i++) {
      if (i <= splitPoint2Index) {
        shape1Vertices.push({
          x: verticesWithSplitPoints[i].x - boundsMin.x - width / 2,
          y: verticesWithSplitPoints[i].y - boundsMin.y - height / 2,
        });
      }
      if (i >= splitPoint2Index) {
        shape2Vertices.push({
          x: verticesWithSplitPoints[i % verticesWithSplitPoints.length].x - boundsMin.x - width / 2,
          y: verticesWithSplitPoints[i % verticesWithSplitPoints.length].y - boundsMin.y - height / 2
        });
      }
    }

    console.log('this.matter', this.matter.add);


    //let sprite = this.add.tileSprite(0, 0, 200, 200, 'block2');

    /*
    let blah = this.matter.add.image(0, 0, 'block2', null, {
      vertices: Vertices.fromPath('40 0 40 20 100 20 100 80 40 80 40 100 0 50')
    });

    console.log('blah:', blah);

    */

    console.log('shape1Vertices:', shape1Vertices);
    console.log('verts:', Vertices.centre(shape1Vertices));

    let center = Vertices.centre(shape1Vertices);

    /*
    Vertices.translate(shape1Vertices, {
      x: center.x,
      y: center.y
    })
    */

    
    var poly = this.add.polygon(200, 0, vertices, 0xff0000, 1);
    this.matter.add.gameObject(poly, { shape: { type: 'fromVerts', verts: vertices, flagInternal: false } }).setStatic(true);



    //var poly2 = this.add.polygon(400, 300, shape2Vertices, 0xff0000, 1);
    //this.matter.add.gameObject(poly2, { shape: { type: 'fromVerts', verts: shape2Vertices, flagInternal: false } });


  }

  getRandomPointOnLine(point1, point2) {
    let rand = Math.random();
    return {
      x: point1.x + (point2.x - point1.x) * rand,
      y: point1.y + (point2.y - point1.y) * rand,
    };
  }


  setSize(image, aspectRatio, width, height) {

  }


  update() {
   
  }


}

export default new Scene();
