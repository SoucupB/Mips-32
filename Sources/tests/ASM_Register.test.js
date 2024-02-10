import tap from 'tap'
const { test } = tap;
import { Mov, MovTypes, Register, RegisterBlock } from '../ASM/Register.js';

test('Check Register compiler v1', (t) => {
  let block = new RegisterBlock();
  block.push(new Mov('0', '1', MovTypes.NUMBER_TO_REG))
  block.push(new Mov('1', '2', MovTypes.NUMBER_TO_REG))
  block.run();
  t.equal(block.getRegValue(0), 1, 'returns');
  t.equal(block.getRegValue(1), 2, 'returns');
  t.end();
});

test('Check Register compiler v2', (t) => {
  let block = new RegisterBlock();
  block.push(new Mov('0', '1', MovTypes.NUMBER_TO_REG))
  block.push(new Mov('2', '0', MovTypes.REG_TO_REG))
  block.run();
  t.equal(block.getRegValue(0), 1, 'returns');
  t.equal(block.getRegValue(2), 1, 'returns');
  t.end();
});

test('Check Register compiler v3', (t) => {
  let block = new RegisterBlock();
  block.push(new Mov('0', '133', MovTypes.NUMBER_TO_REG))
  block.push(new Mov('2', '0', MovTypes.REG_TO_REG))
  block.push(new Mov('3', '0', MovTypes.REG_TO_REG))
  block.push(new Mov('4', '2', MovTypes.REG_TO_REG))
  block.run();
  t.equal(block.getRegValue(0), 133, 'returns');
  t.equal(block.getRegValue(2), 133, 'returns');
  t.equal(block.getRegValue(3), 133, 'returns');
  t.equal(block.getRegValue(4), 133, 'returns');
  t.end();
});

test('Check Register compiler v4', (t) => {
  let block = new RegisterBlock();
  block.push(new Mov('0', '133', MovTypes.NUMBER_TO_REG))
  block.push(new Mov('100', '0', MovTypes.REG_TO_MEM))
  block.push(new Mov('5', '100', MovTypes.MEM_TO_REG))
  block.run();
  t.equal(block.getRegValue(5), 133, 'returns');
  t.end();
});

test('Check Register compiler v5', (t) => {
  let block = new RegisterBlock();
  block.push(new Mov('4', '43252626', MovTypes.NUMBER_TO_REG))
  block.push(new Mov('5666', '4', MovTypes.REG_TO_MEM))
  block.push(new Mov('5', '5666', MovTypes.MEM_TO_REG))
  block.run();
  t.equal(block.getRegValue(5), 43252626, 'returns');
  t.end();
});