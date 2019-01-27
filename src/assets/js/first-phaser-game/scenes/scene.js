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
    this.load.image('bomb', 'assets/media/images/bomb.png');
    this.load.image('lamp', 'assets/media/images/lamp.png');
    this.load.image('microwave', 'assets/media/images/microwave.png');
    this.load.image('bookcase', 'assets/media/images/bookcase.png');
  }

  create() {
    //let gameOver = false;
    /* ========== WORLD BOUNDARY ========== */
    this.matter.world.setBounds(0, 0, 800, 600, 32, true, true, false, true);

    /* ========== DRAGGABLE ITEMS ========== */
    const canDrag = this.matter.world.nextGroup();

    let ceiling = this.createBlock(1, 11, 1, 18).setCollisionGroup(canDrag) //top
   const groundFloor = this.createBlock(1, 0, 1, 18).setCollisionGroup(canDrag)  //ground
    const leftWall = this.createBlock(1, 1, 10, 1).setCollisionGroup(canDrag) //left block
   const rightWall = this.createBlock(18, 1, 10, 1).setCollisionGroup(canDrag)  //right block

    //FURNITURE
    const tv = this.matter.add.image(600, 600-40, 'tv', null, { chamfer: 16 }).setScale(0.2).setBounce(0.1).setCollisionGroup(canDrag);

    //1st floor 
    const microwave = this.matter.add.image(200, 600-40, 'microwave', null, { chamfer: 16 }).setScale(0.2).setBounce(0.1).setCollisionGroup(canDrag);
    const cabinet1 =this.matter.add.image(300, 600-40, 'cabinet', null, { chamfer: 16 }).setScale(0.07).setBounce(0.1).setCollisionGroup(canDrag); 

    //2nd floor middle:
    const bookcase = this.matter.add.image(200, 350, 'bookcase', null, { chamfer: 16 }).setScale(0.27).setBounce(0.1).setCollisionGroup(canDrag);
    const cabinet2 = this.matter.add.image(400, 350, 'cabinet', null, { chamfer: 16 }).setScale(0.07).setBounce(0.1).setCollisionGroup(canDrag);
    const lamp = this.matter.add.image(700, 350, 'lamp', null, { chamfer: 16 }).setScale(0.2).setBounce(0.1).setCollisionGroup(canDrag);

    //STATIC FLOOR
    const staticFloor = this.matter.add.image(400, 400, 'platform', null, { isStatic: true }).setScale(0.174); //second floor

    //PERSON and settings
    const person = this.matter.add.sprite(400, 450, 'dude', null, {
      isPerson: true
    }).setScale(2);
    const bomb = this.matter.add.image(100, 450, 'bomb').setScale(1).setBounce(1).setFriction(0);

    console.log('person:', person);

    /* ========== COLLISIONS ========== */

    const cat1 = this.matter.world.nextCategory();
   
    person.setCollisionCategory(cat1);
   
    //const cat2 = this.matter.world.nextCategory();
 
    // staticFloor.setCollisionCategory(cat2);
    // person.setCollisionCategory(cat2);
    // lamp.setCollisionCategory(cat2);
    //cabinet1.setCollisionCategory(cat2);
    //cabinet2.setCollisionCategory(cat2);
    // tv.setCollisionCategory(cat2);
    // bookcase.setCollisionCategory(cat2);
    // leftWall.setCollisionCategory(cat2);
    // right.setCollisionCategory(cat2);

    ceiling.setCollidesWith([cat1]); //staticFloor collides with person (cat1)

    // bomb.setVelocityX(25);

    this.matter.world.on('collisionstart', function (event) {      
      if (event.pairs[0].bodyA.gameObject === person) {
        if (event.pairs[0].bodyA.gameObject.scaleY !== .5) {
          event.pairs[0].bodyA.gameObject.scaleY = 0.5;
        }
      }
      else if (event.pairs[0].bodyB.gameObject === person) {
        if (event.pairs[0].bodyB.gameObject.scaleY !== .5) {
          event.pairs[0].bodyB.gameObject.scaleY = 0.5;
        }
      }
    });
  
    //  Constraint on canDrag items
    this.matter.add.mouseSpring({ length: 1, stiffness: 0.6, angularStiffness: 0,  collisionFilter: { group: canDrag } });        
    //let splits = this.splitBlock(block);
    let splits = this.splitBlock(ceiling); //split the secondFloor to test the collision
    splits.forEach(split => {
      split.setCollisionGroup(canDrag);
    })
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
    
    //console.log('poly2:', poly2);
    
    let split2 = this.matter.add.gameObject(poly2, { shape: { type: 'fromVerts', verts: shape2Vertices, flagInternal: true } })
      .setFrictionAir(0.01)
      .setFriction(.4)
      .setFrictionStatic(2)
      .setBounce(0)

    split2.body.render.sprite.texture = 'dude';

    //console.log('split2:', split2.setTexture);

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

  // setSize(image, aspectRatio, width, height) {

  // }


  // update() {
   
  // }


}

export default new Scene();
