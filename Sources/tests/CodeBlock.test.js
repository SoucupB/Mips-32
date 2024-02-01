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
  console.log(JSON.stringify(chomp, null, 2))

  t.equal(chomp.isInvalid(), false, 'returns');
  t.end();
});