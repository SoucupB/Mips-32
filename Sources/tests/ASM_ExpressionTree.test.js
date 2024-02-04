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