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
    //142 x 127 bricks
    this.load.image('bricks', 'assets/media/images/bricks.png');
    //298 × 500 tv
    this.load.image('tv', 'assets/media/images/tv.png');
    //400 × 32 platform
    this.load.image('platform', 'assets/media/images/platform.png');
    this.load.image('cabinet', 'assets/media/images/cabinet.png');
    this.load.spritesheet('dude', 'assets/media/images/dude.png', { frameWidth: 32, frameHeight: 48 });
  }

  create() {

    /* ========== WORLD BOUNDARY ========== */
    this.matter.world.setBounds(0, 0, 800, 600, 32, true, true, false, true);

    /* ========== DRAGGABLE ITEMS ========== */
    const canDrag = this.matter.world.nextGroup();

    let block = this.createBlock(1, 11, 1, 18).setCollisionGroup(canDrag) //top
    this.createBlock(1, 0, 1, 18).setCollisionGroup(canDrag)  //ground
    this.createBlock(1, 1, 10, 1).setCollisionGroup(canDrag) //left block
    this.createBlock(18, 1, 10, 1).setCollisionGroup(canDrag)  //right block

    //BRICKS
    //2nd floor middle:
    this.matter.add.image(400, 350, 'bricks', null, { chamfer: 16 }).setScale(0.3).setBounce(0.1).setCollisionGroup(canDrag);
    this.matter.add.image(400, 350, 'cabinet', null, { chamfer: 16 }).setScale(0.07).setBounce(0.1).setCollisionGroup(canDrag);
    this.matter.add.image(400, 350, 'cabinet', null, { chamfer: 16 }).setScale(0.07).setBounce(0.1).setCollisionGroup(canDrag);
    
    console.log('block:', block, block.setTexture, block.renderTarget);
    
    //1st floor 
    this.matter.add.image(200, 600-40, 'bricks', null, { chamfer: 16 }).setScale(0.3).setBounce(0.1).setCollisionGroup(canDrag);
    this.matter.add.image(300, 600-40, 'bricks', null, { chamfer: 16 }).setScale(0.3).setBounce(0.1).setCollisionGroup(canDrag);

    //FURNITURE
    this.matter.add.image(600, 600-40, 'tv', null, { chamfer: 16 }).setScale(0.2).setBounce(0.1).setCollisionGroup(canDrag);

    //STATIC FLOOR
    this.matter.add.image(400, 400, 'platform', null, { isStatic: true }).setScale(0.174); //second floor

    //PERSON
    let person = this.matter.add.sprite(400, 450, 'dude').setScale(2);

    //  Constraint on canDrag items
    this.matter.add.mouseSpring({ length: 1, stiffness: 0.6, angularStiffness: 0,  collisionFilter: { group: canDrag } });        

    this.addMask(block);
  }

  addMask(gameObject) {
    var graphics = this.make.graphics(0, 0);

    console.log('graphics:', graphics);

    //	Shapes drawn to the Graphics object must be filled.
    //graphics.lineStyle(5, 0xFF00FF, 1.0);

    //	Here we'll draw a circle
    //graphics.drawCircle(100, 100, 100);

    // You need to change this bit to suit the shape you're trying to mask.
    graphics.lineStyle(5, 0xFF00FF, 1.0);
    graphics.strokeRect(0, 0, 50, 50);
    graphics.beginPath();
    graphics.moveTo(50, 50);
    graphics.lineTo(100, 100);
    graphics.closePath();
    graphics.strokePath();

    var mask = graphics.createGeometryMask();
    gameObject.setMask(mask);
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

    let vertices = block.body.vertices;
    let boundsMin = block.body.bounds.min;

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

    if (edge1 < edge2) {
      var splitPoint1Index = edge1 + 1;
      var splitPoint2Index = edge2 + 2;
    }
    else {
      var splitPoint1Index = edge2 + 1;
      var splitPoint2Index = edge1 + 2;
    }

    verticesWithSplitPoints.splice(splitPoint1Index, 0, splitPoint1);
    verticesWithSplitPoints.splice(splitPoint2Index, 0, splitPoint2);

    let shape1Vertices = [];
    let shape2Vertices = [];

    for (let i = splitPoint1Index; i < splitPoint1Index + edgeCount + 3; i++) {
      if (i <= splitPoint2Index) {
        shape1Vertices.push({
          x: verticesWithSplitPoints[i].x,
          y: verticesWithSplitPoints[i].y,
        });
      }
      if (i >= splitPoint2Index) {
        shape2Vertices.push({
          x: verticesWithSplitPoints[i % verticesWithSplitPoints.length].x,
          y: verticesWithSplitPoints[i % verticesWithSplitPoints.length].y
        });
      }
    }

    let dimensions1 = this.getDimensions(shape1Vertices);
    let dimensions2 = this.getDimensions(shape2Vertices);

    let centerShape1 = Vertices.centre(shape1Vertices);
    let centerShape2 = Vertices.centre(shape2Vertices)
    
    Vertices.translate(shape1Vertices, {
      x: -boundsMin.x + (boundsMin.x - dimensions1.x),
      y: -boundsMin.y + (boundsMin.y - dimensions1.y),
    });

    Vertices.translate(shape2Vertices, {
      x: -boundsMin.x + (boundsMin.x - dimensions2.x),
      y: -boundsMin.y + (boundsMin.y - dimensions2.y),
    });

    var poly = this.add.polygon(centerShape1.x, centerShape1.y, shape1Vertices, 0x000000, .5);
    let split1 = this.matter.add.gameObject(poly, { 
      shape: { 
        type: 'fromVerts', 
        verts: shape1Vertices, 
        flagInternal: true 
      } 
    })
      .setFrictionAir(0.01)
      .setFriction(.4)
      .setFrictionStatic(2)
      .setBounce(0);
  
    var poly2 = this.add.polygon(centerShape2.x, centerShape2.y, shape2Vertices, 0x000000, .5);
    
    console.log('poly2:', poly2);
    
    let split2 = this.matter.add.gameObject(poly2, { shape: { type: 'fromVerts', verts: shape2Vertices, flagInternal: true } })
      .setFrictionAir(0.01)
      .setFriction(.4)
      .setFrictionStatic(2)
      .setBounce(0)

    split2.body.render.sprite.texture = 'dude';

    console.log('split2:', split2.texture);

    block.destroy();

    return [split1, split2];
  }

  getRandomPointOnLine(point1, point2) {
    let rand = Math.random();
    return {
      x: point2.x + (point1.x - point2.x) * rand,
      y: point2.y + (point1.y - point2.y) * rand,
    };
  }

  getDimensions(points) {
    let minX = points[0].x;
    let minY = points[0].y;

    let maxX = points[0].x;
    let maxY = points[0].y;

    points.forEach((point) => {
      if (point.x < minX) {
        minX = point.x;
      }
      else if (point.x > maxX) {
        maxX = point.x;
      }


      if (point.y < minY) {
        minY = point.y;
      }
      else if (point.y > maxY) {
        maxY = point.y;
      }
    });

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  }


  setSize(image, aspectRatio, width, height) {

  }


  update() {
   
  }


}

export default new Scene();
