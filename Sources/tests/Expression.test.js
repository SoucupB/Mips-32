import tap from 'tap'
const { test } = tap;
import Expression from '../Checker/Expression.js';

test('Check expression v1', (t) => {
  t.equal(Expression.isValid('a'), true, 'returns');
  t.end();
});

test('Check expression v2', (t) => {
  t.equal(Expression.isValid('A'), true, 'returns');
  t.end();
});

test('Check expression v3', (t) => {
  t.equal(Expression.isValid('Ada23_da'), true, 'returns');
  t.end();
});

test('Check expression v4', (t) => {
  t.equal(Expression.isValid('32Ada23_da'), false, 'returns');
  t.end();
});

test('Check expression v5', (t) => {
  t.equal(Expression.isValid('a+b'), true, 'returns');
  t.end();
});

test('Check expression v6', (t) => {
  t.equal(Expression.isValid('a+3b'), false, 'returns');
  t.end();
});

test('Check expression v7', (t) => {
  t.equal(Expression.isValid('a+_b'), true, 'returns');
  t.end();
});

test('Check expression v8', (t) => {
  t.equal(Expression.isValid('a+_b/2*4||2+1'), true, 'returns');
  t.end();
});

test('Check expression v9', (t) => {
  t.equal(Expression.isValid('a+_b/2*4|||2+1'), false, 'returns');
  t.end();
});

test('Check expression v10', (t) => {
  t.equal(Expression.isValid('a+_b/2+*4||2+1'), false, 'returns');
  t.end();
});

test('Check expression v11', (t) => {
  t.equal(Expression.isValid('a+_b/2*4||2+1/3/4+2+1-3*8&&3-9+0==1+4'), true, 'returns');
  t.end();
});

test('Check expression v12', (t) => {
  t.equal(Expression.isValid('a+_b/2*4||2+1/3/4+2+1-3*8&&3-&9+0==1+4'), false, 'returns');
  t.end();
});