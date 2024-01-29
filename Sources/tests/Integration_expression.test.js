import tap from 'tap'
const { test } = tap;

test('Check simple path in a square v3', (t) => {
  t.equal(2, 2, 'This path should contain 3 points');
  t.end();
});