import tap from 'tap'
const { test } = tap;
import { LoopBlocks } from '../Checker/LoopBlocks.js';

test('Check LoopBlocks checker v1', (t) => {
  let chomp = LoopBlocks.chomp('{a=b+3;}', 0);

  t.equal(chomp.isInvalid(), true, 'returns');
  t.end();
});

test('Check LoopBlocks checker v2', (t) => {
  let chomp = LoopBlocks.chomp('while(a<2){a=b+3;}', 0);

  t.equal(chomp.isInvalid(), false, 'returns');
  t.end();
});

test('Check LoopBlocks checker v3', (t) => {
  let chomp = LoopBlocks.chomp('while(a>2){a=b+3;}', 0);

  t.equal(chomp.isInvalid(), false, 'returns');
  t.end();
});

test('Check LoopBlocks checker v4', (t) => {
  let chomp = LoopBlocks.chomp('whilea>2){a=b+3;}', 0);

  t.equal(chomp.isInvalid(), true, 'returns');
  t.end();
});

test('Check LoopBlocks checker v5', (t) => {
  let chomp = LoopBlocks.chomp('while(){a=b+3;}', 0);

  t.equal(chomp.isInvalid(), true, 'returns');
  t.end();
});

test('Check LoopBlocks checker v6', (t) => {
  let chomp = LoopBlocks.chomp('while(1){a=b+3;}', 0);

  t.equal(chomp.isInvalid(), false, 'returns');
  t.end();
});