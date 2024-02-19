import tap from 'tap'
const { test } = tap;
import { ExpressionNode, ExpressionTree } from '../ASM/ExpressionTree.js';
import Expression from '../AST/Expression.js';
import { RegisterMem } from '../ASM/RegisterMem.js';
import { RegisterStack } from '../ASM/RegisterStack.js';
import { Mov, MovTypes, Print, PrintTypes, Push, RegisterBlock } from '../ASM/Register.js';
import { Compiler } from '../ASM/Compiler.js';
import { Runner } from '../ASM/Runner.js';

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
  asmBlock.push(new Print(expressionTree.getRegister(registerMem)))
  let runner = new Runner(asmBlock.flatten().block);
  runner.run();

  t.equal(runner.getOutputBuffer(), '48', 'returns');
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
  asmBlock.push(new Print(expressionTree.getRegister(registerMem)))
  let runner = new Runner(asmBlock.flatten().block);
  runner.run();

  t.equal(runner.getOutputBuffer(), '12', 'returns');
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
  asmBlock.push(new Print(expressionTree.getRegister(registerMem)))
  let runner = new Runner(asmBlock.flatten().block);
  runner.run();

  t.equal(runner.getOutputBuffer(), '33', 'returns');
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
  asmBlock.push(new Print(expressionTree.getRegister(registerMem)))
  let runner = new Runner(asmBlock.flatten().block);
  runner.run();

  t.equal(runner.getOutputBuffer(), '23', 'returns');
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
  asmBlock.push(new Print(expressionTree.getRegister(registerMem)))
  let runner = new Runner(asmBlock.flatten().block);
  runner.run();

  t.equal(runner.getOutputBuffer(), '35', 'returns');

  t.end();
});

test('Check Expression true ASM v5', (t) => {
  let chomp = Expression.chomp('(3+4)*5+5*(6+7)', 0); 
  let expressionTree = new ExpressionTree(chomp);
  expressionTree.build();
  let registerMem = new RegisterMem();
  let registerStack = new RegisterStack();
  let asmBlock = new RegisterBlock(); 

  expressionTree.addInstructionToBlock(asmBlock, registerMem, registerStack)
  asmBlock.push(new Print(expressionTree.getRegister(registerMem)))
  let runner = new Runner(asmBlock.flatten().block);
  runner.run();

  t.equal(runner.getOutputBuffer(), '100', 'returns');
  t.end();
});

test('Check Expression true ASM v6', (t) => {
  let chomp = Expression.chomp('a+b', 0); 
  let expressionTree = new ExpressionTree(chomp);
  expressionTree.build();
  let registerMem = new RegisterMem();
  let registerStack = new RegisterStack();
  let asmBlock = new RegisterBlock(); 

  registerStack.push('a', 4);
  registerStack.push('b', 4);
  asmBlock.push(new Mov(0, 4, MovTypes.NUMBER_TO_REG));
  asmBlock.push(new Push(0));
  asmBlock.push(new Mov(0, 4, MovTypes.NUMBER_TO_REG));
  asmBlock.push(new Push(0));
  expressionTree.addInstructionToBlock(asmBlock, registerMem, registerStack);
  asmBlock.push(new Print(expressionTree.getRegister(registerMem)))
  let runner = new Runner(asmBlock.flatten().block);
  runner.run();

  t.equal(runner.getOutputBuffer(), '8', 'returns');

  t.end();
});

test('Check Expression true ASM v7', (t) => {
  let chomp = Expression.chomp('(a+b)*2+(b+c)*3', 0); 
  let expressionTree = new ExpressionTree(chomp);
  expressionTree.build();
  let registerMem = new RegisterMem();
  let registerStack = new RegisterStack();
  let asmBlock = new RegisterBlock(); 

  registerStack.push('a', 4);
  registerStack.push('b', 4);
  registerStack.push('c', 4);

  
  asmBlock.push(new Mov(0, 4, MovTypes.NUMBER_TO_REG));
  asmBlock.push(new Push(0));
  asmBlock.push(new Mov(0, 4, MovTypes.NUMBER_TO_REG));
  asmBlock.push(new Push(0));
  asmBlock.push(new Mov(0, 4, MovTypes.NUMBER_TO_REG));
  asmBlock.push(new Push(0));

  expressionTree.addInstructionToBlock(asmBlock, registerMem, registerStack)
  asmBlock.push(new Print(expressionTree.getRegister(registerMem)))
  let runner = new Runner(asmBlock.flatten().block);
  runner.run();

  t.equal(runner.getOutputBuffer(), '40', 'returns');

  t.end();
});

test('Check Expression order v1', (t) => {
  let chomp = Expression.chomp('3+4*5', 0); 
  let expressionTree = new ExpressionTree(chomp);
  expressionTree.build();
  let registerMem = new RegisterMem();
  let registerStack = new RegisterStack();
  let asmBlock = new RegisterBlock(); 
  
  expressionTree.addInstructionToBlockWithOrder(asmBlock, registerMem, registerStack)
  asmBlock.push(new Print(expressionTree.getRegister(registerMem)))
  let runner = new Runner(asmBlock.flatten().block);
  runner.run();

  t.equal(runner.getOutputBuffer(), '23', 'returns');
  t.end();
});

test('Check Expression order v3', (t) => {
  let chomp = Expression.chomp('3+4*5*(((19+3)/2)-7)', 0); 
  let expressionTree = new ExpressionTree(chomp);
  expressionTree.build();
  let registerMem = new RegisterMem();
  let registerStack = new RegisterStack();
  let asmBlock = new RegisterBlock(); 
  
  expressionTree.addInstructionToBlockWithOrder(asmBlock, registerMem, registerStack)
  asmBlock.push(new Print(expressionTree.getRegister(registerMem)))
  let runner = new Runner(asmBlock.flatten().block);
  runner.run();
  t.equal(runner.getOutputBuffer(), '83', 'returns');
  t.end();
});

// does not work with negatives
test('Check Expression order v4', (t) => {
  let chomp = Expression.chomp('3+4*5*(((100+4)/2)-7)+(43*(5/5)-2+(9*(9+9)))', 0); 
  let expressionTree = new ExpressionTree(chomp);
  expressionTree.build();
  let registerMem = new RegisterMem();
  let registerStack = new RegisterStack();
  let asmBlock = new RegisterBlock(); 
  
  expressionTree.addInstructionToBlockWithOrder(asmBlock, registerMem, registerStack)
  asmBlock.push(new Print(expressionTree.getRegister(registerMem)))
  let runner = new Runner(asmBlock.flatten().block);
  runner.run();
  t.equal(runner.getOutputBuffer(), '1106', 'returns');
  t.end();
});

test('Check Expression order v5', (t) => {
  let chomp = Expression.chomp('3+4*5+5/5-3+7*7', 0); 
  let expressionTree = new ExpressionTree(chomp);
  expressionTree.build();
  let registerMem = new RegisterMem();
  let registerStack = new RegisterStack();
  let asmBlock = new RegisterBlock(); 
  
  expressionTree.addInstructionToBlockWithOrder(asmBlock, registerMem, registerStack);
  asmBlock.push(new Print(expressionTree.getRegister(registerMem)))
  let runner = new Runner(asmBlock.flatten().block);
  runner.run();
  t.equal(runner.getOutputBuffer(), '70', 'returns');
  t.end();
});

test('Check Expression order v6', (t) => {
  let chomp = Expression.chomp('45+32>32+44', 0); 
  let expressionTree = new ExpressionTree(chomp);
  expressionTree.build();
  let registerMem = new RegisterMem();
  let registerStack = new RegisterStack();
  let asmBlock = new RegisterBlock(); 
  
  expressionTree.addInstructionToBlockWithOrder(asmBlock, registerMem, registerStack)
  asmBlock.push(new Print(expressionTree.getRegister(registerMem)))
  let runner = new Runner(asmBlock.flatten().block);
  runner.run();
  t.equal(runner.getOutputBuffer(), '1', 'returns');
  t.end();
});

test('Check Expression order v7', (t) => {
  let chomp = Expression.chomp('45+32>35+44', 0); 
  let expressionTree = new ExpressionTree(chomp);
  expressionTree.build();
  let registerMem = new RegisterMem();
  let registerStack = new RegisterStack();
  let asmBlock = new RegisterBlock(); 
  
  expressionTree.addInstructionToBlockWithOrder(asmBlock, registerMem, registerStack)
  asmBlock.push(new Print(expressionTree.getRegister(registerMem)))
  let runner = new Runner(asmBlock.flatten().block);
  runner.run();
  t.equal(runner.getOutputBuffer(), '0', 'returns');
  t.end();
});

test('Check Expression order v8', (t) => {
  let chomp = Expression.chomp('5', 0); 
  let expressionTree = new ExpressionTree(chomp);
  expressionTree.build();
  let registerMem = new RegisterMem();
  let registerStack = new RegisterStack();
  let asmBlock = new RegisterBlock(); 
  
  expressionTree.addInstructionToBlockWithOrder(asmBlock, registerMem, registerStack)
  asmBlock.push(new Print(expressionTree.getRegister(registerMem)))
  let runner = new Runner(asmBlock.flatten().block);
  runner.run();
  t.equal(runner.getOutputBuffer(), '5', 'returns');
  t.end();
});

test('Check Expression order v8', (t) => {
  let chomp = Expression.chomp('1||2', 0); 
  let expressionTree = new ExpressionTree(chomp);
  expressionTree.build();
  let registerMem = new RegisterMem();
  let registerStack = new RegisterStack();
  let asmBlock = new RegisterBlock(); 
  
  expressionTree.addInstructionToBlockWithOrder(asmBlock, registerMem, registerStack)
  asmBlock.push(new Print(expressionTree.getRegister(registerMem)))
  let runner = new Runner(asmBlock.flatten().block);
  runner.run();
  t.equal(runner.getOutputBuffer(), '1', 'returns');
  t.end();
});

test('Check Expression order v9', (t) => {
  let chomp = Expression.chomp('0||2', 0); 
  let expressionTree = new ExpressionTree(chomp);
  expressionTree.build();
  let registerMem = new RegisterMem();
  let registerStack = new RegisterStack();
  let asmBlock = new RegisterBlock(); 
  
  expressionTree.addInstructionToBlockWithOrder(asmBlock, registerMem, registerStack)
  asmBlock.push(new Print(expressionTree.getRegister(registerMem)))
  let runner = new Runner(asmBlock.flatten().block);
  runner.run();
  t.equal(runner.getOutputBuffer(), '1', 'returns');
  t.end();
});

test('Check Expression order v10', (t) => {
  let chomp = Expression.chomp('1||0', 0); 
  let expressionTree = new ExpressionTree(chomp);
  expressionTree.build();
  let registerMem = new RegisterMem();
  let registerStack = new RegisterStack();
  let asmBlock = new RegisterBlock(); 
  
  expressionTree.addInstructionToBlockWithOrder(asmBlock, registerMem, registerStack)
  asmBlock.push(new Print(expressionTree.getRegister(registerMem)))
  let runner = new Runner(asmBlock.flatten().block);
  runner.run();
  t.equal(runner.getOutputBuffer(), '1', 'returns');
  t.end();
});

test('Check Expression order v11', (t) => {
  let chomp = Expression.chomp('0||0', 0); 
  let expressionTree = new ExpressionTree(chomp);
  expressionTree.build();
  let registerMem = new RegisterMem();
  let registerStack = new RegisterStack();
  let asmBlock = new RegisterBlock(); 
  
  expressionTree.addInstructionToBlockWithOrder(asmBlock, registerMem, registerStack)
  // console.log(asmBlock.toString())
  asmBlock.push(new Print(expressionTree.getRegister(registerMem)))
  let runner = new Runner(asmBlock.flatten().block);
  runner.run();
  t.equal(runner.getOutputBuffer(), '0', 'returns');
  t.end();
});

test('Check Expression order v12', (t) => {
  let chomp = Expression.chomp('0==1||0==0', 0); 
  let expressionTree = new ExpressionTree(chomp);
  expressionTree.build();
  let registerMem = new RegisterMem();
  let registerStack = new RegisterStack();
  let asmBlock = new RegisterBlock(); 
  
  expressionTree.addInstructionToBlockWithOrder(asmBlock, registerMem, registerStack)
  asmBlock.push(new Print(expressionTree.getRegister(registerMem)))
  let runner = new Runner(asmBlock.flatten().block);
  runner.run();
  t.equal(runner.getOutputBuffer(), '1', 'returns');
  t.end();
});

test('Check Expression order v13', (t) => {
  let chomp = Expression.chomp('0==1||0==1', 0); 
  let expressionTree = new ExpressionTree(chomp);
  expressionTree.build();
  let registerMem = new RegisterMem();
  let registerStack = new RegisterStack();
  let asmBlock = new RegisterBlock(); 
  
  expressionTree.addInstructionToBlockWithOrder(asmBlock, registerMem, registerStack)
  asmBlock.push(new Print(expressionTree.getRegister(registerMem)))
  let runner = new Runner(asmBlock.flatten().block);
  runner.run();
  t.equal(runner.getOutputBuffer(), '0', 'returns');
  t.end();
});
