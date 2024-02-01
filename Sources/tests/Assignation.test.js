import tap from 'tap'
const { test } = tap;
import { Assignation } from '../Checker/Assignation.js';

test('Check Initialization checker v1', (t) => {
  let chomp = Assignation.chomp('a=b+3;', 0);

  t.equal(chomp.isInvalid(), false, 'returns');
  t.equal(chomp.index, 6, 'returns');
  t.end();
});

test('Check Initialization checker v2', (t) => {
  let chomp = Assignation.chomp('a=3*(b+3+(9+2-bada));', 0);

  t.equal(chomp.isInvalid(), false, 'returns');
  t.end();
});

test('Check Initialization checker v3', (t) => {
  let chomp = Assignation.chomp('a=3*(b+3+(9+2-bada)+3r);', 0);

  t.equal(chomp.isInvalid(), true, 'returns');
  t.end();
});

test('Check Initialization checker v4', (t) => {
  let chomp = Assignation.chomp('a=3*(b+3+(9+2-bada)+r)-da+da*3;', 0);

  t.equal(chomp.isInvalid(), false, 'returns');
  t.end();
});