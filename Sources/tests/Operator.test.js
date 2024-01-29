import tap from 'tap'
const { test } = tap;
import Operator from '../Checker/Operator.js';

test('Check operator is correct v1', (t) => {
  t.equal(Operator.isValid('+'), true, 'returns true');
  t.equal(Operator.isValid('-'), true, 'returns true');
  t.equal(Operator.isValid('*'), true, 'returns true');
  t.equal(Operator.isValid('/'), true, 'returns true');
  t.equal(Operator.isValid('|'), true, 'returns true');
  t.equal(Operator.isValid('||'), true, 'returns true');
  t.equal(Operator.isValid('&&'), true, 'returns true');
  t.equal(Operator.isValid('=='), true, 'returns true');
  t.end();
});