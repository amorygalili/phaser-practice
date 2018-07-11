module.exports = ({ instance }) => {

  let score = 0;
  let scoreText;

  return {
    create,
    add
  };

  const create = () => {
    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
  };

  const add = (points) => {
    score += points;
    scoreText.setText('Score: ' + score);
  };
};
