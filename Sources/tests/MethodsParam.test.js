import tap from 'tap'
const { test } = tap;
import { MethodsParams } from '../AST/MethodsParam.js';

test('Check MethodsParams checker v1', (t) => {
  let chomp = MethodsParams.chomp('int _yolo', 0);

  t.equal(chomp.isInvalid(), false, 'returns');
  t.end();
});

test('Check MethodsParams checker v2', (t) => {
  let chomp = MethodsParams.chomp('char _yolo', 0);

  t.equal(chomp.isInvalid(), false, 'returns');
  t.end();
});

test('Check MethodsParams checker v3', (t) => {
  let chomp = MethodsParams.chomp('char 4_yolo', 0);

  t.equal(chomp.isInvalid(), true, 'returns');
  t.end();
});

test('Check MethodsParams checker v4', (t) => {
  let chomp = MethodsParams.chomp('zig _yolo', 0);

  t.equal(chomp.isInvalid(), true, 'returns');
  t.end();
});

test('Check MethodsParams checker v5', (t) => {
  let chomp = MethodsParams.chomp(',', 0);

  t.equal(chomp.isInvalid(), true, 'returns');
  t.end();
});

test('Check MethodsParams checker v6', (t) => {
  let chomp = MethodsParams.chomp(')', 0);

  t.equal(chomp.isInvalid(), true, 'returns');
  t.end();
});

test('Check MethodsParams checker v7', (t) => {
  let chomp = MethodsParams.chomp('int _someVariable32', 0);

  t.equal(chomp.isInvalid(), false, 'returns');
  t.equal(chomp.index, 19, 'returns');
  t.end();
});

test('Check MethodsParams checker v8', (t) => {
  let chomp = MethodsParams.chomp('int _someVariable32;', 0);

  t.equal(chomp.isInvalid(), false, 'returns');
  t.equal(chomp.index, 19, 'returns');
  t.end();
});