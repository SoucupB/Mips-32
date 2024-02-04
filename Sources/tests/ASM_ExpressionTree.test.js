import tap from 'tap'
const { test } = tap;
import { ExpressionNode, ExpressionTree } from '../ASM/ExpressionTree.js';
import Expression from '../AST/Expression.js';

test('Check Program checker (method return) v6', (t) => {
  let chomp = Expression.chomp('3+4', 0); 
  let expressionTree = new ExpressionTree(chomp);
  expressionTree.build();
  console.log(expressionTree.root)
  
  t.end();
});