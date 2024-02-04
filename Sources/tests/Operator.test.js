import tap from 'tap'
const { test } = tap;
import Operator from '../AST/Operator.js';

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

test('Check operator is false v1', (t) => {
  t.equal(Operator.isValid('a'), false, 'returns false');
  t.equal(Operator.isValid('_'), false, 'returns false');
  t.equal(Operator.isValid('dafafa'), false, 'returns false');
  t.end();
});

test('Chomp operator v1', (t) => {
  let chomp = Operator.chomp('+ dafa', 0);

  t.equal(chomp.index, 1, 'returns index');
  t.equal(chomp.buffer, '+', 'returns buffer');
  t.end();
});

test('Chomp operator v2', (t) => {
  let chomp = Operator.chomp('- dafa', 0);

  t.equal(chomp.index, 1, 'returns index');
  t.equal(chomp.buffer, '-', 'returns buffer');
  t.end();
});

test('Chomp operator v3', (t) => {
  let chomp = Operator.chomp('-- dafa', 0);

  t.equal(chomp.index, 1, 'returns index');
  t.equal(chomp.buffer, '-', 'returns buffer');
  t.end();
});

test('Chomp operator v4', (t) => {
  let chomp = Operator.chomp('&& dafa', 0);

  t.equal(chomp.index, 2, 'returns index');
  t.equal(chomp.buffer, '&&', 'returns buffer');
  t.end();
});

test('Chomp operator v5', (t) => {
  let chomp = Operator.chomp('|| dafa', 0);

  t.equal(chomp.index, 2, 'returns index');
  t.equal(chomp.buffer, '||', 'returns buffer');
  t.end();
});

test('Chomp operator v6', (t) => {
  let chomp = Operator.chomp('&', 0);

  t.equal(chomp.index, 1, 'returns index');
  t.equal(chomp.buffer, '&', 'returns buffer');
  t.end();
});

test('Chomp operator v7', (t) => {
  let chomp = Operator.chomp('a', 0);

  t.equal(chomp.isInvalid(), true, 'chomp is invalid');
  t.end();
});

test('Chomp operator v8', (t) => {
  let chomp = Operator.chomp('', 0);

  t.equal(chomp.isInvalid(), true, 'chomp is invalid');
  t.end();
});