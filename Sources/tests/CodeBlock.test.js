import tap from 'tap'
const { test } = tap;
import { CodeBlock } from '../Checker/CodeBlock.js';

test('Check CodeBlock checker v1', (t) => {
  let chomp = CodeBlock.chomp('{a=b+3;}', 0);

  t.equal(chomp.isInvalid(), false, 'returns');
  t.end();
});

test('Check CodeBlock checker v2', (t) => {
  let chomp = CodeBlock.chomp('{a=b+3;int pen=3+b-3/2;}', 0);
  t.equal(chomp.isInvalid(), false, 'returns');
  t.end();
});

test('Check CodeBlock checker v3', (t) => {
  let chomp = CodeBlock.chomp('{a=b+3;int pen=3+b-3/2;{b=3;c=5+2;}}', 0);

  t.equal(chomp.isInvalid(), false, 'returns');
  t.end();
});

test('Check CodeBlock checker v4', (t) => {
  let chomp = CodeBlock.chomp('{a=b+3;int }pen=3+b-3/2;{b=3;c=5+2;}}', 0);

  t.equal(chomp.isInvalid(), true, 'returns');
  t.end();
});

test('Check CodeBlock checker v5', (t) => {
  let chomp = CodeBlock.chomp('{a=b+3;int pen=3+b-3/2;{b=3;c=5+2;}}}', 0);

  t.equal(chomp.isInvalid(), false, 'returns');
  t.end();
});

test('Check CodeBlock checker v6', (t) => {
  let chomp = CodeBlock.chomp('{a=b+3;int pe}n=3+b-3/2;{b=3;c=5+2;}}', 0);

  t.equal(chomp.isInvalid(), true, 'returns');
  t.end();
});

test('Check CodeBlock checker v7', (t) => {
  let chomp = CodeBlock.chomp('{int a;b=3;}', 0);

  t.equal(chomp.isInvalid(), false, 'returns');
  t.end();
});

test('Check CodeBlock checker v8', (t) => {
  let chomp = CodeBlock.chomp('{int a;b=3;', 0);

  t.equal(chomp.isInvalid(), true, 'returns');
  t.end();
});

test('Check CodeBlock checker v9', (t) => {
  let chomp = CodeBlock.chomp('int a;b=3;}', 0);

  t.equal(chomp.isInvalid(), true, 'returns');
  t.end();
});