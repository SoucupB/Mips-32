import tap from 'tap'
const { test } = tap;
import { StackDeclarations } from '../AST/StackDeclarations.js';

test('Stack spec v1', (t) => {
  let stack = new StackDeclarations();
  stack.push(5)
  stack.push(6)
  stack.push(7)
  stack.push(8)

  t.equal(stack.top(), 8, 'returns');
  t.end();
});

test('Stack spec v2', (t) => {
  let stack = new StackDeclarations();
  stack.push(5)
  stack.push(6)
  stack.freeze();
  stack.push(7)
  stack.push(8)
  stack.pop();

  t.equal(stack.top(), 6, 'returns');
  t.end();
});

test('Stack spec v3', (t) => {
  let stack = new StackDeclarations();
  stack.push(5)
  stack.freeze();
  stack.push(6)
  stack.push(7)
  stack.push(8)
  stack.pop();

  t.equal(stack.top(), 5, 'returns');
  t.end();
});

test('Stack spec v4', (t) => {
  let stack = new StackDeclarations();
  stack.push(5)
  stack.freeze();
  stack.push(6)
  stack.push(7)
  stack.freeze();
  stack.push(8)
  stack.pop();

  t.equal(stack.top(), 7, 'returns');
  stack.pop();
  t.equal(stack.top(), 5, 'returns');
  t.end();
});