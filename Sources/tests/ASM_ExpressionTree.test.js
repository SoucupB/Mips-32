import tap from 'tap'
const { test } = tap;
import { ExpressionNode, ExpressionTree } from '../ASM/ExpressionTree.js';
import Expression from '../AST/Expression.js';
import { RegisterMem } from '../ASM/RegisterMem.js';
import { RegisterStack } from '../ASM/RegisterStack.js';
import { RegisterBlock } from '../ASM/Register.js';

test('Check Expression true v1', (t) => {
  let chomp = Expression.chomp('3+4+5+6+7', 0); 
  let expressionTree = new ExpressionTree(chomp);
  expressionTree.build();
  t.equal(expressionTree.toString(), '((((3+4)+5)+6)+7)', 'returns');
  t.end();
});

test('Check Expression true v2', (t) => {
  let chomp = Expression.chomp('3+4*5', 0); 
  let expressionTree = new ExpressionTree(chomp);
  expressionTree.build();
  t.equal(expressionTree.toString(), '(3+(4*5))', 'returns');
  t.end();
});

test('Check Expression true v3', (t) => {
  let chomp = Expression.chomp('3+4*5/6', 0); 
  let expressionTree = new ExpressionTree(chomp);
  expressionTree.build();
  t.equal(expressionTree.toString(), '(3+((4*5)/6))', 'returns');
  t.end();
});

test('Check Expression true v4', (t) => {
  let chomp = Expression.chomp('3+4*5+2/6', 0); 
  let expressionTree = new ExpressionTree(chomp);
  expressionTree.build();
  t.equal(expressionTree.toString(), '((3+(4*5))+(2/6))', 'returns');
  t.end();
});

test('Check Expression true v5', (t) => {
  let chomp = Expression.chomp('3+4-5+6-7', 0); 
  let expressionTree = new ExpressionTree(chomp);
  expressionTree.build();
  t.equal(expressionTree.toString(), '((((3+4)-5)+6)-7)', 'returns');
  t.end();
});

test('Check Expression true v6', (t) => {
  let chomp = Expression.chomp('3+5==7-2', 0); 
  let expressionTree = new ExpressionTree(chomp);
  expressionTree.build();
  t.equal(expressionTree.toString(), '((3+5)==(7-2))', 'returns');
  t.end();
});

test('Check Expression true v7', (t) => {
  let chomp = Expression.chomp('2*3+5==7/4-2', 0); 
  let expressionTree = new ExpressionTree(chomp);
  expressionTree.build();
  t.equal(expressionTree.toString(), '(((2*3)+5)==((7/4)-2))', 'returns');
  t.end();
});

test('Check Expression true v8', (t) => {
  let chomp = Expression.chomp('2*3+5<7/4-2&&2==a', 0); 
  let expressionTree = new ExpressionTree(chomp);
  expressionTree.build();
  t.equal(expressionTree.toString(), '((((2*3)+5)<((7/4)-2))&&(2==a))', 'returns');
  t.end();
});

test('Check Expression true v9', (t) => {
  let chomp = Expression.chomp('a', 0); 
  let expressionTree = new ExpressionTree(chomp);
  expressionTree.build();
  t.equal(expressionTree.toString(), 'a', 'returns');
  t.end();
});

test('Check Expression true v10', (t) => {
  let chomp = Expression.chomp('(2+3)*8', 0); 
  let expressionTree = new ExpressionTree(chomp);
  expressionTree.build();
  t.equal(expressionTree.toString(), '((2+3)*8)', 'returns');
  t.end();
});

test('Check Expression true v11', (t) => {
  let chomp = Expression.chomp('2/((2+3)*8)', 0); 
  let expressionTree = new ExpressionTree(chomp);
  expressionTree.build();
  t.equal(expressionTree.toString(), '(2/((2+3)*8))', 'returns');
  t.end();
});

test('Check Expression true v12', (t) => {
  let chomp = Expression.chomp('3+4==6+7', 0); 
  let expressionTree = new ExpressionTree(chomp);
  expressionTree.build();
  t.equal(expressionTree.toString(), '((3+4)==(6+7))', 'returns');
  t.end();
});

test('Check Expression true v13', (t) => {
  let chomp = Expression.chomp('3+(4==6)+7', 0); 
  let expressionTree = new ExpressionTree(chomp);
  expressionTree.build();
  t.equal(expressionTree.toString(), '((3+(4==6))+7)', 'returns');
  t.end();
});

test('Check Expression true ASM v1', (t) => {
  let chomp = Expression.chomp('3+45', 0); 
  let expressionTree = new ExpressionTree(chomp);
  expressionTree.build();
  let registerMem = new RegisterMem();
  let registerStack = new RegisterStack();
  let asmBlock = new RegisterBlock(); 

  expressionTree.addInstructionToBlock(asmBlock, registerMem, registerStack)

  t.equal(asmBlock.toStringArray().toString(), [ 'MOV $0 3', 'MOV $1 45', 'ADD $2 $0 $1' ].toString(), 'returns');
  t.end();
});

test('Check Expression true ASM v2', (t) => {
  let chomp = Expression.chomp('3+4+5', 0); 
  let expressionTree = new ExpressionTree(chomp);
  expressionTree.build();
  let registerMem = new RegisterMem();
  let registerStack = new RegisterStack();
  let asmBlock = new RegisterBlock(); 

  expressionTree.addInstructionToBlock(asmBlock, registerMem, registerStack)

  t.equal(asmBlock.toStringArray().toString(), [ 'MOV $0 3', 'MOV $1 4', 'ADD $2 $0 $1', 'MOV $0 5', 'ADD $1 $2 $0' ].toString(), 'returns');
  t.end();
});

test('Check Expression true ASM v2', (t) => {
  let chomp = Expression.chomp('3+4+5+6+7+8', 0); 
  let expressionTree = new ExpressionTree(chomp);
  expressionTree.build();
  let registerMem = new RegisterMem();
  let registerStack = new RegisterStack();
  let asmBlock = new RegisterBlock(); 

  expressionTree.addInstructionToBlock(asmBlock, registerMem, registerStack)

  // console.log(asmBlock.toStringArray())
  t.equal(asmBlock.toStringArray().toString(), [
    'MOV $0 3',     'MOV $1 4',
    'ADD $2 $0 $1', 'MOV $0 5',
    'ADD $1 $2 $0', 'MOV $0 6',
    'ADD $2 $1 $0', 'MOV $0 7',
    'ADD $1 $2 $0', 'MOV $0 8',
    'ADD $2 $1 $0'
  ].toString(), 'returns');
  t.end();
});

test('Check Expression true ASM v3', (t) => {
  let chomp = Expression.chomp('3+4*5', 0); 
  let expressionTree = new ExpressionTree(chomp);
  expressionTree.build();
  let registerMem = new RegisterMem();
  let registerStack = new RegisterStack();
  let asmBlock = new RegisterBlock(); 

  expressionTree.addInstructionToBlock(asmBlock, registerMem, registerStack)

  t.equal(asmBlock.toStringArray().toString(), [ 'MOV $0 4', 'MOV $1 5', 'MUL $2 $0 $1', 'MOV $0 3', 'ADD $1 $0 $2' ].toString(), 'returns');
  // console.log(asmBlock.toStringArray())
  t.end();
});

test('Check Expression true ASM v4', (t) => {
  let chomp = Expression.chomp('(3+4)*5', 0); 
  let expressionTree = new ExpressionTree(chomp);
  expressionTree.build();
  let registerMem = new RegisterMem();
  let registerStack = new RegisterStack();
  let asmBlock = new RegisterBlock(); 

  expressionTree.addInstructionToBlock(asmBlock, registerMem, registerStack)

  t.equal(asmBlock.toStringArray().toString(), [ 'MOV $0 3', 'MOV $1 4', 'ADD $2 $0 $1', 'MOV $0 5', 'MUL $1 $2 $0' ].toString(), 'returns');
  t.end();
});