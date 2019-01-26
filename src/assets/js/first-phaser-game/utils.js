
import {Physics} from 'Phaser'
import _ from 'lodash';

const { Bodies, Body, World, Composite, Query, Bounds, SAT } = Physics.Matter.Matter;


export const hasCollided = (scene, body, tags) => {
  return getCollisions(scene, body, tags).length > 0;
};

export const getCollisions = (scene, body, tags) => {
  const bodies = getBodiesWtihTags(scene, tags);
  return queryCollides(body, bodies);
};

export const getBodiesWtihTags = (scene, tags) => {

  if (!tags) {
    tags = [];
  }
  else if (_.isString(tags)) {
    tags = [tags];
  }

  const bodies = Composite.allBodies(getEngineWorld(scene));

  return bodies.filter((body) => {
    const bodyTags = body.tags || [];
    for (let i = 0; i < bodyTags.length; i++) {
      if (tags.indexOf(bodyTags[i]) > -1) {
        return true;
      }
    }
    return false;
  });
}

export const getEngineWorld = (scene) => {
  return scene.matter.world.engine.world;
}



/**
 * Returns a list of collisions between `body` and `bodies`.
 * @method collides
 * @param {body} body
 * @param {body[]} bodies
 * @return {object[]} Collisions
 */
export const queryCollides = function(body, bodies) {
  var collisions = [];

  for (var i = 0; i < bodies.length; i++) {
    var bodyA = bodies[i];
    
    if (Bounds.overlaps(bodyA.bounds, body.bounds)) {
      for (var j = bodyA.parts.length === 1 ? 0 : 1; j < bodyA.parts.length; j++) {
        var part = bodyA.parts[j];

        if (Bounds.overlaps(part.bounds, body.bounds)) {
          var collision = SAT.collides(part, body);

          if (collision.collided) {
            collisions.push(collision);
            break;
          }
        }
      }
    }
  }

  return collisions;
};