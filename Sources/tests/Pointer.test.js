import tap from 'tap'
const { test } = tap;
import { Pointer } from '../AST/Pointer.js';

test('Pointer test v1', (t) => {
  t.equal(Pointer.chomp('test', 0).isInvalid(), true, 'returns true');
  t.end();
});

test('Pointer test v2', (t) => {
  t.equal(Pointer.chomp('*test', 0).isInvalid(), false, 'returns true');
  t.end();
});

test('Pointer test v3', (t) => {
  t.equal(Pointer.chomp('*43test', 0).isInvalid(), true, 'returns true');
  t.end();
});

test('Pointer test v4', (t) => {
  t.equal(Pointer.chomp('*(test)', 0).isInvalid(), false, 'returns true');
  t.end();
});

test('Pointer test v5', (t) => {
  const chomp = Pointer.chomp('*(test+23-2/3)', 0);
  t.equal(chomp.isInvalid(), false, 'returns true');
  t.equal(chomp.index, 14, 'returns true');
  t.end();
});

test('Pointer test v6', (t) => {
  const chomp = Pointer.chomp('*test+23-2/3', 0);
  t.equal(chomp.isInvalid(), false, 'returns true');
  t.equal(chomp.index, 5, 'returns true');
  t.end();
});