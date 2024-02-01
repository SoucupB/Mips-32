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
  let chomp = LoopBlocks.chomp('while(1){a=b+3;}while(1){a=b+3;}', 0);

  t.equal(chomp.isInvalid(), false, 'returns');
  t.equal(chomp.index, 16, 'returns');
  t.end();
});

test('Check LoopBlocks checker v7', (t) => {
  let chomp = LoopBlocks.chomp('while(1){a=b+3;while(2){a=3+2-(c-s);}}', 0);

  t.equal(chomp.isInvalid(), false, 'returns');
  t.end();
});

test('Check LoopBlocks checker v8', (t) => {
  let chomp = LoopBlocks.chomp('while(1){a=b+3;while(2){a=3+2-(c-s-);}}', 0);

  t.equal(chomp.isInvalid(), true, 'returns');
  t.end();
});

test('Check LoopBlocks checker v9', (t) => {
  let chomp = LoopBlocks.chomp('while(1){a=b+3;whire(2){a=3+2-(c-s);}}', 0);

  t.equal(chomp.isInvalid(), true, 'returns');
  t.end();
});

test('Check LoopBlocks checker v10', (t) => {
  let chomp = LoopBlocks.chomp('for(int i=0;i<=5;i=i+1){a=b+3;}', 0);

  t.equal(chomp.isInvalid(), false, 'returns');
  t.end();
});

test('Check LoopBlocks checker v11', (t) => {
  let chomp = LoopBlocks.chomp('for(int i=0;i<=5;i=i+1;c=3){a=b+3;}', 0);

  t.equal(chomp.isInvalid(), true, 'returns');
  t.end();
});

test('Check LoopBlocks checker v12', (t) => {
  let chomp = LoopBlocks.chomp('for(int i=0;i<=5;i=i+1){for(int j=0;j<=5;j=j+1){c=i+j;}}', 0);

  t.equal(chomp.isInvalid(), false, 'returns');
  t.equal(chomp.index, 56, 'returns');
  t.end();
});

test('Check LoopBlocks checker v13', (t) => {
  let chomp = LoopBlocks.chomp('while(c<10){for(int i=0;i<=5;i=i+1){for(int j=0;j<=5;j=j+1){c=i+j;}}}', 0);

  t.equal(chomp.isInvalid(), false, 'returns');
  t.end();
});