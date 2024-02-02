import tap from 'tap'
const { test } = tap;
import { Methods } from '../Checker/Methods.js';

test('Check Methods checker v1', (t) => {
  let chomp = Methods.chompDeclaration('int someMethod(int a,int b){int b=5;}', 0);

  t.equal(chomp.isInvalid(), false, 'returns');
  t.end();
});