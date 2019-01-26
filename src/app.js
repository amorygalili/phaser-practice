// https://phaser.io/tutorials/getting-started-phaser3/part5https://phaser.io/tutorials/getting-started-phaser3/part5

import './assets/scss/app.scss';
import './assets/js/first-phaser-game/game';

import {Physics} from 'Phaser'
const Matter = Physics.Matter.Matter;


Matter.use('matter-collision-events');