import tap from 'tap'
const { test } = tap;
import { ConditionalBlocks } from '../Checker/ConditionalBlocks.js';

test('Check ConditionalBlocks checker v1', (t) => {
  let chomp = ConditionalBlocks.chomp('if(a<3){a=b+3;}', 0);

  t.equal(chomp.isInvalid(), false, 'returns');
  t.end();
});

test('Check ConditionalBlocks checker v2', (t) => {
  let chomp = ConditionalBlocks.chomp('if(a<3&&b>3||(c==9)){a=b+3;}', 0);

  t.equal(chomp.isInvalid(), false, 'returns');
  t.end();
});

test('Check ConditionalBlocks checker v3', (t) => {
  let chomp = ConditionalBlocks.chomp('if(a<3&&b>*3||(c==9)){a=b+3;}', 0);

  t.equal(chomp.isInvalid(), true, 'returns');
  t.end();
});

test('Check ConditionalBlocks checker v4', (t) => {
  let chomp = ConditionalBlocks.chomp('if(a<3&&b>3||(c==9)){for(int i=0;i<100;i=i+1){a=b+3;}}', 0);

  t.equal(chomp.isInvalid(), false, 'returns');
  t.equal(chomp.index, 54, 'returns');
  t.end();
});