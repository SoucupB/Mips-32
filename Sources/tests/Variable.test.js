import tap from 'tap'
const { test } = tap;
import { Variable } from '../AST/Variable.js';

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

test('Chomp v1', (t) => {
  const chompResponse = Variable.chomp('yyy aaa daf', 0);

  t.equal(chompResponse.index, 3, 'returns index');
  t.equal(chompResponse.buffer, 'yyy', 'returns chomp buffer');
  t.equal(chompResponse.isInvalid(), false, 'chomp is valid');
  t.end();
});

test('Chomp v2', (t) => {
  const chompResponse = Variable.chomp('yyy43 aaa daf', 0);

  t.equal(chompResponse.index, 5, 'returns index');
  t.equal(chompResponse.buffer, 'yyy43', 'returns chomp buffer');
  t.equal(chompResponse.isInvalid(), false, 'chomp is valid');
  t.end();
});

test('Chomp v3', (t) => {
  const chompResponse = Variable.chomp('yyy aaa daf', 4);

  t.equal(chompResponse.index, 7, 'returns index');
  t.equal(chompResponse.buffer, 'aaa', 'returns chomp buffer');
  t.equal(chompResponse.isInvalid(), false, 'chomp is valid');
  t.end();
});

test('Chomp v4', (t) => {
  const chompResponse = Variable.chomp('_yyy aaa daf', 0);

  t.equal(chompResponse.index, 4, 'returns index');
  t.equal(chompResponse.buffer, '_yyy', 'returns chomp buffer');
  t.equal(chompResponse.isInvalid(), false, 'chomp is valid');
  t.end();
});

test('Chomp v5', (t) => {
  const chompResponse = Variable.chomp('43_yyy aaa daf', 0);

  t.equal(chompResponse.isInvalid(), true, 'chomp is invalid');
  t.end();
});

test('Chomp v6', (t) => {
  const chompResponse = Variable.chomp('$a_yyy aaa daf', 0);

  t.equal(chompResponse.isInvalid(), true, 'chomp is invalid');
  t.end();
});

test('Chomp empty spaces v1', (t) => {
  const chompResponse = Variable.chomp('     _yyy aaa daf', 0);

  t.equal(chompResponse.index, 9, 'returns index');
  t.equal(chompResponse.buffer, '_yyy', 'returns chomp buffer');
  t.equal(chompResponse.isInvalid(), false, 'chomp is valid');
  t.end();
});

test('Chomp empty spaces v2', (t) => {
  const chompResponse = Variable.chomp(' \n\n  _yyy aaa daf', 0);

  t.equal(chompResponse.index, 9, 'returns index');
  t.equal(chompResponse.buffer, '_yyy', 'returns chomp buffer');
  t.equal(chompResponse.isInvalid(), false, 'chomp is valid');
  t.end();
});

test('Chomp empty spaces v3', (t) => {
  const chompResponse = Variable.chomp(' \n\n  _yyy     aaa daf', 9);

  t.equal(chompResponse.index, 17, 'returns index');
  t.equal(chompResponse.buffer, 'aaa', 'returns chomp buffer');
  t.equal(chompResponse.isInvalid(), false, 'chomp is valid');
  t.end();
});

test('Chomp empty spaces v4', (t) => {
  const chompResponse = Variable.chomp(`
  _yyy     aaa daf`, 0);

  t.equal(chompResponse.index, 7, 'returns index');
  t.equal(chompResponse.buffer, '_yyy', 'returns chomp buffer');
  t.equal(chompResponse.isInvalid(), false, 'chomp is valid');
  t.end();
});