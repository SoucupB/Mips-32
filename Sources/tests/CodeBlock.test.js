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

test('Check CodeBlock checker v10', (t) => {
  let chomp = CodeBlock.chomp('{int a;b=3;}{f=3;}', 0);

  t.equal(chomp.isInvalid(), false, 'returns');
  t.equal(chomp.index, 12, 'returns');
  t.end();
});

test('Check CodeBlock checker v11', (t) => {
  let chomp = CodeBlock.chomp('{int c=0;while(c<10){for(int i=0;i<=5;i=i+1){for(int j=0;j<=5;j=j+1){c=i+j;}}}}', 0);

  t.equal(chomp.isInvalid(), false, 'returns');
  t.end();
});

test('Check CodeBlock checker v12', (t) => {
  let chomp = CodeBlock.chomp('{int c=0;while(c<10){for(int i=0;i<=4a;i=i+1){for(int j=0;j<=5;j=j+1){c=i+j;}}}}', 0);

  t.equal(chomp.isInvalid(), true, 'returns');
  t.end();
});

test('Check CodeBlock checker v13', (t) => {
  let chomp = CodeBlock.chomp('{int c=0;while(c<10){for(int i=0;i<=a;i=i+1){while(z>5){b=z+1;}for(int j=0;j<=5;j=j+1){c=i+j;}}}}', 0);

  t.equal(chomp.isInvalid(), false, 'returns');
  t.end();
});