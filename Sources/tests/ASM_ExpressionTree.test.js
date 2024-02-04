import tap from 'tap'
const { test } = tap;
import { ExpressionNode, ExpressionTree } from '../ASM/ExpressionTree.js';
import Expression from '../AST/Expression.js';

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