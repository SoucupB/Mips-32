import tap from 'tap'
const { test } = tap;
import { Initialization, Keyword } from '../Checker/Initialization.js';

test('Check Initialization checker v1', (t) => {
  t.equal(Initialization.isValid('a'), false, 'returns');
  t.end();
});

test('Check Initialization checker v2', (t) => {
  t.equal(Initialization.isValid('dafa'), false, 'returns');
  t.end();
});

test('Check Initialization checker v3', (t) => {
  t.equal(Initialization.isValid('int a=0;'), true, 'returns');
  t.end();
});

test('Check Initialization checker v4', (t) => {
  t.equal(Initialization.isValid('int a=b+3-3+4;'), true, 'returns');
  t.end();
});

test('Check Initialization checker v5', (t) => {
  t.equal(Initialization.isValid('cata a=b+3-3+4;'), false, 'returns');
  t.end();
});