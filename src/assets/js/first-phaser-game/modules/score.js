

let score = 0;
let scoreText;

module.exports = {
  create,
  add
};

function create() {
  scoreText = Game.scene.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
};

function add(points) {
  score += points;
  scoreText.setText('Score: ' + score);
};
