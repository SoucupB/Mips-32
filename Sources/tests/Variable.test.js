import tap from 'tap'
const { test } = tap;
import Variable from '../Checker/Variable.js';

test('Check if variable is correct v1', (t) => {
  t.equal(Variable.isValid('test'), true, 'returns true');
  t.end();
});

test('Check if variable is correct v2', (t) => {
  t.equal(Variable.isValid('test_test'), true, 'returns true');
  t.end();
});

test('Check if variable is correct v3', (t) => {
  t.equal(Variable.isValid('test_te332st'), true, 'returns true');
  t.end();
});

test('Check if variable is correct v4', (t) => {
  t.equal(Variable.isValid('_spec_test'), true, 'returns true');
  t.end();
});

test('Check if variable is correct v5', (t) => {
  t.equal(Variable.isValid('_spAAec_tef433ffAst'), true, 'returns true');
  t.end();
});

test('Check if variable is correct v6', (t) => {
  t.equal(Variable.isValid('43dadaf'), false, 'returns false');
  t.end();
});

test('Check if variable is correct v6', (t) => {
  t.equal(Variable.isValid('#aaf'), false, 'returns false');
  t.end();
});

test('Check if variable is correct v6', (t) => {
  t.equal(Variable.isValid('aff2#aaf'), false, 'returns false');
  t.end();
});