import tap from 'tap'
const { test } = tap;
import { Cmp, Jz, Print, Register, Sete, Setge, Setle, Setne, Test } from '../ASM/Register.js';
import { Add, Div, Jmp, JmpTypes, Label, Mov, MovTypes, Mul, Pop, Prp, Push, RegisterBlock, Sub } from '../ASM/Register.js';
import Expression from '../AST/Expression.js';
import { ExpressionTree } from '../ASM/ExpressionTree.js';
import { RegisterMem } from '../ASM/RegisterMem.js';
import { RegisterStack } from '../ASM/RegisterStack.js';

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

test('Check Register compiler v6', (t) => {
  let block = new RegisterBlock();
  block.push(new Mov('4', '43252626', MovTypes.NUMBER_TO_REG))
  block.push(new Push('4'));
  block.push(new Mov('5', '4', MovTypes.STACK_TO_REG))
  block.run();
  t.equal(block.getRegValue(5), 43252626, 'returns');
  t.end();
});

test('Check Register compiler v7', (t) => {
  let block = new RegisterBlock();
  block.push(new Mov('4', '43252626', MovTypes.NUMBER_TO_REG))
  block.push(new Push('4'));
  block.push(new Mov('5', '4', MovTypes.STACK_TO_REG))
  block.run();
  t.equal(block.getRegValue(5), 43252626, 'returns');
  t.end();
});

test('Check Register compiler v8', (t) => {
  let block = new RegisterBlock();
  block.push(new Mov('1', '42342', MovTypes.NUMBER_TO_REG))
  block.push(new Mov('2', '999888', MovTypes.NUMBER_TO_REG))
  block.push(new Mov('3', '556677', MovTypes.NUMBER_TO_REG))
  block.push(new Push('1'));
  block.push(new Push('2'));
  block.push(new Push('3'));
  block.push(new Mov('9', '4', MovTypes.STACK_TO_REG))
  block.push(new Pop(4))
  block.push(new Mov('8', '4', MovTypes.STACK_TO_REG))
  block.push(new Pop(4))
  block.push(new Mov('7', '4', MovTypes.STACK_TO_REG))
  block.push(new Pop(4))
  block.run();
  t.equal(block.getRegValue(9), 556677, 'returns');
  t.equal(block.getRegValue(8), 999888, 'returns');
  t.equal(block.getRegValue(7), 42342, 'returns');
  t.end();
});

test('Check Register compiler v9', (t) => {
  let block = new RegisterBlock();
  block.push(new Mov('1', '42342', MovTypes.NUMBER_TO_REG))
  block.push(new Mov('2', '999888', MovTypes.NUMBER_TO_REG))
  block.push(new Jmp('_yolo'))
  block.push(new Label('_Assignation'));
  block.push(new Mov('3', '6744', MovTypes.NUMBER_TO_REG))
  block.push(new Label('_yolo'));
  block.push(new Mov('9', '116744', MovTypes.NUMBER_TO_REG))
  block.run();
  t.equal(block.getRegValue(9), 116744, 'returns');
  t.equal(block.getRegValue(3), 0, 'returns');
  t.end();
});

test('Check Register compiler v9', (t) => {
  let block = new RegisterBlock();
  block.push(new Mov('1', '42342', MovTypes.NUMBER_TO_REG))
  block.push(new Mov('2', '999888', MovTypes.NUMBER_TO_REG))
  block.push(new Mov('5', '4', MovTypes.NUMBER_TO_REG))
  block.push(new Jmp('5', JmpTypes.REGISTER));
  block.push(new Mov('3', '6744', MovTypes.NUMBER_TO_REG))
  block.push(new Mov('9', '116744', MovTypes.NUMBER_TO_REG))
  block.run();
  t.equal(block.getRegValue(9), 116744, 'returns');
  t.equal(block.getRegValue(3), 6744, 'returns');
  t.end();
});

test('Check Register compiler v10', (t) => {
  let block = new RegisterBlock();
  block.push(new Mov('1', '42342', MovTypes.NUMBER_TO_REG))
  block.push(new Mov('2', '999888', MovTypes.NUMBER_TO_REG))
  block.push(new Mov('5', '5', MovTypes.NUMBER_TO_REG))
  block.push(new Jmp('5', JmpTypes.REGISTER));
  block.push(new Mov('3', '6744', MovTypes.NUMBER_TO_REG))
  block.push(new Mov('9', '116744', MovTypes.NUMBER_TO_REG))
  block.run();
  t.equal(block.getRegValue(9), 116744, 'returns');
  t.equal(block.getRegValue(3), 0, 'returns');
  t.end();
});

test('Check Register compiler v11', (t) => {
  let block = new RegisterBlock();
  block.push(new Mov('1', '42342', MovTypes.NUMBER_TO_REG))
  block.push(new Mov('2', '999888', MovTypes.NUMBER_TO_REG))
  block.push(new Jmp('_Assignation'))
  block.push(new Label('_Assignation'));
  block.push(new Mov('3', '6744', MovTypes.NUMBER_TO_REG))
  block.push(new Label('_yolo'));
  block.push(new Mov('9', '116744', MovTypes.NUMBER_TO_REG))
  block.run();
  t.equal(block.getRegValue(9), 116744, 'returns');
  t.equal(block.getRegValue(3), 6744, 'returns');
  t.end();
});

test('Check Register compiler v12', (t) => {
  let block = new RegisterBlock();
  block.push(new Mov('1', '42342', MovTypes.NUMBER_TO_REG))
  block.push(new Mov('2', '999888', MovTypes.NUMBER_TO_REG))
  block.push(new Div('2', '1'))
  block.run();
  t.equal(block.getRegValue('HI'), 23, 'returns');
  t.equal(block.getRegValue('LO'), 26022, 'returns');
  t.end();
});

test('Check Register compiler v13', (t) => {
  let block = new RegisterBlock();
  block.push(new Mov('1', '42342', MovTypes.NUMBER_TO_REG))
  block.push(new Mov('2', '999888', MovTypes.NUMBER_TO_REG))
  block.push(new Div('2', '1'))
  block.run();
  t.equal(block.getRegValue('HI'), 23, 'returns');
  t.equal(block.getRegValue('LO'), 26022, 'returns');
  t.end();
});

test('Check Register compiler v14', (t) => {
  let block = new RegisterBlock();
  block.push(new Mov('1', '42342', MovTypes.NUMBER_TO_REG))
  block.push(new Mov('2', '999888', MovTypes.NUMBER_TO_REG))
  block.push(new Add('3', '2', '1'))
  block.run();
  t.equal(block.getRegValue('3'), 1042230, 'returns');
  t.end();
});

test('Check Register compiler v15', (t) => {
  let block = new RegisterBlock();
  block.push(new Mov('1', '42342', MovTypes.NUMBER_TO_REG))
  block.push(new Mov('2', '999888', MovTypes.NUMBER_TO_REG))
  block.push(new Sub('3', '2', '1'))
  block.push(new Mov('4', '5', MovTypes.NUMBER_TO_REG))
  block.push(new Mov('5', '3', MovTypes.NUMBER_TO_REG))
  block.push(new Mul('7', '4', '5'))
  block.run();
  t.equal(block.getRegValue('3'), 957546, 'returns');
  t.equal(block.getRegValue('7'), 15, 'returns');
  t.end();
});

test('Check Register compiler v16', (t) => {
  let block = new RegisterBlock();
  block.push(new Mov('1', '42342', MovTypes.NUMBER_TO_REG))
  block.push(new Mov('2', '999888', MovTypes.NUMBER_TO_REG))
  block.push(new Prp('3', 0))
  block.run();
  t.equal(block.getRegValue('3'), 2, 'returns');
  t.end();
});

test('Check Register compiler v17', (t) => {
  let block = new RegisterBlock();
  block.push(new Mov('1', '42342', MovTypes.NUMBER_TO_REG))
  block.push(new Mov('2', '999888', MovTypes.NUMBER_TO_REG))
  block.push(new Prp('3', 1))
  block.push(new Mov('1', '42342', MovTypes.NUMBER_TO_REG))
  block.push(new Mov('2', '999888', MovTypes.NUMBER_TO_REG))
  block.run();
  t.equal(block.getRegValue('3'), 3, 'returns');
  t.end();
});

test('Check Register compiler compiler cmp v1', (t) => {
  let block = new RegisterBlock();
  block.push(new Mov('1', '5', MovTypes.NUMBER_TO_REG))
  block.push(new Mov('2', '6', MovTypes.NUMBER_TO_REG))
  block.push(new Cmp('1', '2'))
  block.run();
  t.equal(block.getRegValue('CF'), 1, 'returns');
  t.end();
});

test('Check Register compiler compiler cmp v2', (t) => {
  let block = new RegisterBlock();
  block.push(new Mov('1', '6', MovTypes.NUMBER_TO_REG))
  block.push(new Mov('2', '5', MovTypes.NUMBER_TO_REG))
  block.push(new Cmp('1', '2'))
  block.run();
  t.equal(block.getRegValue('CF'), 0, 'returns');
  t.end();
});

test('Check Register compiler compiler cmp v3', (t) => {
  let block = new RegisterBlock();
  block.push(new Mov('1', '6', MovTypes.NUMBER_TO_REG))
  block.push(new Mov('2', '5', MovTypes.NUMBER_TO_REG))
  block.push(new Cmp('1', '2'))
  block.push(new Setge('3'))
  block.run();
  t.equal(block.getRegValue('3'), 1, 'returns');
  t.end();
});

test('Check Register compiler compiler cmp v4', (t) => {
  let block = new RegisterBlock();
  block.push(new Mov('1', '5', MovTypes.NUMBER_TO_REG))
  block.push(new Mov('2', '5', MovTypes.NUMBER_TO_REG))
  block.push(new Cmp('1', '2'))
  block.push(new Setge('3'))
  block.run();
  t.equal(block.getRegValue('3'), 1, 'returns');
  t.end();
});

test('Check Register compiler compiler cmp v5', (t) => {
  let block = new RegisterBlock();
  block.push(new Mov('1', '4', MovTypes.NUMBER_TO_REG))
  block.push(new Mov('2', '5', MovTypes.NUMBER_TO_REG))
  block.push(new Cmp('1', '2'))
  block.push(new Setge('3'))
  block.run();
  t.equal(block.getRegValue('3'), 0, 'returns');
  t.end();
});

test('Check Register compiler compiler cmp v6', (t) => {
  let block = new RegisterBlock();
  block.push(new Mov('1', '4', MovTypes.NUMBER_TO_REG))
  block.push(new Mov('2', '5', MovTypes.NUMBER_TO_REG))
  block.push(new Cmp('1', '2'))
  block.push(new Sete('3'))
  block.run();
  t.equal(block.getRegValue('3'), 0, 'returns');
  t.end();
});

test('Check Register compiler compiler cmp v7', (t) => {
  let block = new RegisterBlock();
  block.push(new Mov('1', '5', MovTypes.NUMBER_TO_REG))
  block.push(new Mov('2', '5', MovTypes.NUMBER_TO_REG))
  block.push(new Cmp('1', '2'))
  block.push(new Sete('3'))
  block.run();
  t.equal(block.getRegValue('3'), 1, 'returns');
  t.end();
});

test('Check Register compiler compiler cmp v8', (t) => {
  let block = new RegisterBlock();
  block.push(new Mov('1', '5', MovTypes.NUMBER_TO_REG))
  block.push(new Mov('2', '5', MovTypes.NUMBER_TO_REG))
  block.push(new Cmp('1', '2'))
  block.push(new Setne('3'))
  block.run();
  t.equal(block.getRegValue('3'), 0, 'returns');
  t.end();
});

test('Check Register compiler compiler cmp v9', (t) => {
  let block = new RegisterBlock();
  block.push(new Mov('1', '2', MovTypes.NUMBER_TO_REG))
  block.push(new Mov('2', '5', MovTypes.NUMBER_TO_REG))
  block.push(new Cmp('1', '2'))
  block.push(new Setle('3'))
  block.run();
  t.equal(block.getRegValue('3'), 1, 'returns');
  t.end();
});

test('Check Register compiler compiler cmp v10', (t) => {
  let block = new RegisterBlock();
  block.push(new Mov('1', '5', MovTypes.NUMBER_TO_REG))
  block.push(new Mov('2', '5', MovTypes.NUMBER_TO_REG))
  block.push(new Cmp('1', '2'))
  block.push(new Setle('3'))
  block.run();
  t.equal(block.getRegValue('3'), 1, 'returns');
  t.end();
});

test('Check Register compiler compiler cmp v11', (t) => {
  let block = new RegisterBlock();
  block.push(new Mov('1', '6', MovTypes.NUMBER_TO_REG))
  block.push(new Mov('2', '5', MovTypes.NUMBER_TO_REG))
  block.push(new Cmp('1', '2'))
  block.push(new Setle('3'))
  block.run();
  t.equal(block.getRegValue('3'), 0, 'returns');
  t.end();
});

test('Check Register compiler compiler cmp v12', (t) => {
  let block = new RegisterBlock();
  block.push(new Mov('1', '5', MovTypes.NUMBER_TO_REG))
  block.push(new Mov('2', '5', MovTypes.NUMBER_TO_REG))
  block.push(new Test('1', '2'))
  block.push(new Jz('_SomeLabel'));
  block.push(new Mov('3', '57', MovTypes.NUMBER_TO_REG))
  block.push(new Label('_SomeLabel'))
  block.run();
  t.equal(block.getRegValue('3'), 57, 'returns');
  t.end();
});

test('Check Register compiler compiler cmp v13', (t) => {
  let block = new RegisterBlock();
  block.push(new Mov('1', '0', MovTypes.NUMBER_TO_REG))
  block.push(new Mov('2', '5', MovTypes.NUMBER_TO_REG))
  block.push(new Test('1', '2'))
  block.push(new Jz('_SomeLabel'));
  block.push(new Mov('3', '57', MovTypes.NUMBER_TO_REG))
  block.push(new Label('_SomeLabel'))
  block.run();
  t.equal(block.getRegValue('3'), 0, 'returns');
  t.end();
});

test('Check Register compiler compiler cmp v14', (t) => {
  let block = new RegisterBlock();
  block.push(new Mov('1', '4', MovTypes.NUMBER_TO_REG))
  block.push(new Mov('2', '5', MovTypes.NUMBER_TO_REG))
  block.push(new Add('3', '1', '2'))
  block.push(new Print('3'))
  block.run();
  t.equal(block.getOutputBuffer(), '9', 'returns');
  t.end();
});

test('Check Register compiler compiler Expression v1', (t) => {
  let chomp = Expression.chomp('3+4+5', 0); 
  let expressionTree = new ExpressionTree(chomp);
  expressionTree.build();
  let registerMem = new RegisterMem();
  let registerStack = new RegisterStack();
  let asmBlock = new RegisterBlock(); 

  expressionTree.addInstructionToBlock(asmBlock, registerMem, registerStack);
  asmBlock.push(new Print(expressionTree.getRegister(registerMem)))
  asmBlock.run();
  t.equal(asmBlock.getOutputBuffer(), '12', 'returns');

  t.end();
});

test('Check Register compiler compiler Expression v2', (t) => {
  let chomp = Expression.chomp('3+4*5', 0); 
  let expressionTree = new ExpressionTree(chomp);
  expressionTree.build();
  let registerMem = new RegisterMem();
  let registerStack = new RegisterStack();
  let asmBlock = new RegisterBlock(); 

  expressionTree.addInstructionToBlock(asmBlock, registerMem, registerStack);
  asmBlock.push(new Print(expressionTree.getRegister(registerMem)))
  asmBlock.run();
  t.equal(asmBlock.getOutputBuffer(), '23', 'returns');

  t.end();
});

test('Check Register compiler compiler Expression v3', (t) => {
  let chomp = Expression.chomp('(3+4)*5+5*(6+7)', 0); 
  let expressionTree = new ExpressionTree(chomp);
  expressionTree.build();
  let registerMem = new RegisterMem();
  let registerStack = new RegisterStack();
  let asmBlock = new RegisterBlock(); 

  expressionTree.addInstructionToBlock(asmBlock, registerMem, registerStack);
  asmBlock.push(new Print(expressionTree.getRegister(registerMem)))
  asmBlock.run();
  t.equal(asmBlock.getOutputBuffer(), '100', 'returns');

  t.end();
});

test('Check Register compiler compiler Expression v4', (t) => {
  let chomp = Expression.chomp('3<5', 0); 
  let expressionTree = new ExpressionTree(chomp);
  expressionTree.build();
  let registerMem = new RegisterMem();
  let registerStack = new RegisterStack();
  let asmBlock = new RegisterBlock(); 

  expressionTree.addInstructionToBlock(asmBlock, registerMem, registerStack);
  asmBlock.push(new Print(expressionTree.getRegister(registerMem)))
  asmBlock.run();
  t.equal(asmBlock.getOutputBuffer(), '1', 'returns');

  t.end();
});

test('Check Register compiler compiler Expression v5', (t) => {
  let chomp = Expression.chomp('7<5', 0); 
  let expressionTree = new ExpressionTree(chomp);
  expressionTree.build();
  let registerMem = new RegisterMem();
  let registerStack = new RegisterStack();
  let asmBlock = new RegisterBlock(); 

  expressionTree.addInstructionToBlock(asmBlock, registerMem, registerStack);
  asmBlock.push(new Print(expressionTree.getRegister(registerMem)))
  asmBlock.run();
  t.equal(asmBlock.getOutputBuffer(), '0', 'returns');

  t.end();
});

test('Check Register compiler compiler Expression v5', (t) => {
  let chomp = Expression.chomp('(7<5)+(5<7)', 0); 
  let expressionTree = new ExpressionTree(chomp);
  expressionTree.build();
  let registerMem = new RegisterMem();
  let registerStack = new RegisterStack();
  let asmBlock = new RegisterBlock(); 

  expressionTree.addInstructionToBlock(asmBlock, registerMem, registerStack);
  asmBlock.push(new Print(expressionTree.getRegister(registerMem)))
  asmBlock.run();
  t.equal(asmBlock.getOutputBuffer(), '1', 'returns');

  t.end();
});

test('Check Register compiler compiler Expression v6', (t) => {
  let chomp = Expression.chomp('1+4+5>=5+6', 0); 
  let expressionTree = new ExpressionTree(chomp);
  expressionTree.build();
  let registerMem = new RegisterMem();
  let registerStack = new RegisterStack();
  let asmBlock = new RegisterBlock(); 

  expressionTree.addInstructionToBlock(asmBlock, registerMem, registerStack);
  asmBlock.push(new Print(expressionTree.getRegister(registerMem)))
  asmBlock.run();
  t.equal(asmBlock.getOutputBuffer(), '0', 'returns');

  t.end();
});

test('Check Register compiler compiler Expression v7', (t) => {
  let chomp = Expression.chomp('1+4+(5>=5)+6', 0); 
  let expressionTree = new ExpressionTree(chomp);
  expressionTree.build();
  let registerMem = new RegisterMem();
  let registerStack = new RegisterStack();
  let asmBlock = new RegisterBlock(); 

  expressionTree.addInstructionToBlock(asmBlock, registerMem, registerStack);
  asmBlock.push(new Print(expressionTree.getRegister(registerMem)))
  asmBlock.run();
  t.equal(asmBlock.getOutputBuffer(), '12', 'returns');

  t.end();
});

test('Check Register compiler compiler Expression v8', (t) => {
  let chomp = Expression.chomp('1+4+(3<5)+6', 0); 
  let expressionTree = new ExpressionTree(chomp);
  expressionTree.build();
  let registerMem = new RegisterMem();
  let registerStack = new RegisterStack();
  let asmBlock = new RegisterBlock(); 

  expressionTree.addInstructionToBlock(asmBlock, registerMem, registerStack);
  asmBlock.push(new Print(expressionTree.getRegister(registerMem)))
  asmBlock.run();

  t.equal(asmBlock.getOutputBuffer(), '12', 'returns');

  t.end();
});

test('Check Register compiler compiler Expression v9', (t) => {
  let chomp = Expression.chomp('1+4+(7<5)+6', 0); 
  let expressionTree = new ExpressionTree(chomp);
  expressionTree.build();
  let registerMem = new RegisterMem();
  let registerStack = new RegisterStack();
  let asmBlock = new RegisterBlock(); 

  expressionTree.addInstructionToBlock(asmBlock, registerMem, registerStack);
  asmBlock.push(new Print(expressionTree.getRegister(registerMem)))
  asmBlock.run();

  t.equal(asmBlock.getOutputBuffer(), '11', 'returns');

  t.end();
});

test('Check Register compiler compiler Expression v10', (t) => {
  let chomp = Expression.chomp('1+4+(7>5)+6', 0); 
  let expressionTree = new ExpressionTree(chomp);
  expressionTree.build();
  let registerMem = new RegisterMem();
  let registerStack = new RegisterStack();
  let asmBlock = new RegisterBlock(); 

  expressionTree.addInstructionToBlock(asmBlock, registerMem, registerStack);
  asmBlock.push(new Print(expressionTree.getRegister(registerMem)))
  asmBlock.run();

  t.equal(asmBlock.getOutputBuffer(), '12', 'returns');

  t.end();
});

test('Check Register compiler compiler Expression v11', (t) => {
  let chomp = Expression.chomp('1+4+(3>5)+6', 0); 
  let expressionTree = new ExpressionTree(chomp);
  expressionTree.build();
  let registerMem = new RegisterMem();
  let registerStack = new RegisterStack();
  let asmBlock = new RegisterBlock(); 

  expressionTree.addInstructionToBlock(asmBlock, registerMem, registerStack);
  asmBlock.push(new Print(expressionTree.getRegister(registerMem)))
  asmBlock.run();

  t.equal(asmBlock.getOutputBuffer(), '11', 'returns');

  t.end();
});

test('Check Register compiler compiler Expression v12', (t) => {
  let chomp = Expression.chomp('1+4+(5>5)+6', 0); 
  let expressionTree = new ExpressionTree(chomp);
  expressionTree.build();
  let registerMem = new RegisterMem();
  let registerStack = new RegisterStack();
  let asmBlock = new RegisterBlock(); 

  expressionTree.addInstructionToBlock(asmBlock, registerMem, registerStack);
  asmBlock.push(new Print(expressionTree.getRegister(registerMem)))
  asmBlock.run();

  t.equal(asmBlock.getOutputBuffer(), '11', 'returns');

  t.end();
});

test('Check Register compiler compiler Expression v13', (t) => {
  let chomp = Expression.chomp('1+4+(5>=5)+6', 0); 
  let expressionTree = new ExpressionTree(chomp);
  expressionTree.build();
  let registerMem = new RegisterMem();
  let registerStack = new RegisterStack();
  let asmBlock = new RegisterBlock(); 

  expressionTree.addInstructionToBlock(asmBlock, registerMem, registerStack);
  asmBlock.push(new Print(expressionTree.getRegister(registerMem)))
  asmBlock.run();

  t.equal(asmBlock.getOutputBuffer(), '12', 'returns');

  t.end();
});

test('Check Register compiler compiler Expression v14', (t) => {
  let chomp = Expression.chomp('1+4+(5<=5)+6', 0); 
  let expressionTree = new ExpressionTree(chomp);
  expressionTree.build();
  let registerMem = new RegisterMem();
  let registerStack = new RegisterStack();
  let asmBlock = new RegisterBlock(); 

  expressionTree.addInstructionToBlock(asmBlock, registerMem, registerStack);
  asmBlock.push(new Print(expressionTree.getRegister(registerMem)))
  asmBlock.run();

  t.equal(asmBlock.getOutputBuffer(), '12', 'returns');

  t.end();
});

test('Check Register compiler compiler Expression v15', (t) => {
  let chomp = Expression.chomp('1+4+(5==5)+6', 0); 
  let expressionTree = new ExpressionTree(chomp);
  expressionTree.build();
  let registerMem = new RegisterMem();
  let registerStack = new RegisterStack();
  let asmBlock = new RegisterBlock(); 

  expressionTree.addInstructionToBlock(asmBlock, registerMem, registerStack);
  asmBlock.push(new Print(expressionTree.getRegister(registerMem)))
  asmBlock.run();

  t.equal(asmBlock.getOutputBuffer(), '12', 'returns');

  t.end();
});

test('Check Register compiler compiler Expression v16', (t) => {
  let chomp = Expression.chomp('1+4+(7==5)+6', 0); 
  let expressionTree = new ExpressionTree(chomp);
  expressionTree.build();
  let registerMem = new RegisterMem();
  let registerStack = new RegisterStack();
  let asmBlock = new RegisterBlock(); 

  expressionTree.addInstructionToBlock(asmBlock, registerMem, registerStack);
  asmBlock.push(new Print(expressionTree.getRegister(registerMem)))
  asmBlock.run();

  t.equal(asmBlock.getOutputBuffer(), '11', 'returns');

  t.end();
});

test('Check Register compiler compiler Expression v17', (t) => {
  let chomp = Expression.chomp('1+4+(7!=5)+6', 0); 
  let expressionTree = new ExpressionTree(chomp);
  expressionTree.build();
  let registerMem = new RegisterMem();
  let registerStack = new RegisterStack();
  let asmBlock = new RegisterBlock(); 

  expressionTree.addInstructionToBlock(asmBlock, registerMem, registerStack);
  asmBlock.push(new Print(expressionTree.getRegister(registerMem)))
  asmBlock.run();

  t.equal(asmBlock.getOutputBuffer(), '12', 'returns');

  t.end();
});

test('Check Register compiler compiler Expression v18', (t) => {
  let chomp = Expression.chomp('1+4+(7!=7)+6', 0); 
  let expressionTree = new ExpressionTree(chomp);
  expressionTree.build();
  let registerMem = new RegisterMem();
  let registerStack = new RegisterStack();
  let asmBlock = new RegisterBlock(); 

  expressionTree.addInstructionToBlock(asmBlock, registerMem, registerStack);
  asmBlock.push(new Print(expressionTree.getRegister(registerMem)))
  asmBlock.run();

  t.equal(asmBlock.getOutputBuffer(), '11', 'returns');

  t.end();
});

test('Check Register compiler compiler Expression v19', (t) => {
  let chomp = Expression.chomp('1+4+7!=7+6', 0); 
  let expressionTree = new ExpressionTree(chomp);
  expressionTree.build();
  let registerMem = new RegisterMem();
  let registerStack = new RegisterStack();
  let asmBlock = new RegisterBlock(); 

  expressionTree.addInstructionToBlock(asmBlock, registerMem, registerStack);
  asmBlock.push(new Print(expressionTree.getRegister(registerMem)))
  asmBlock.run();

  t.equal(asmBlock.getOutputBuffer(), '1', 'returns');

  t.end();
});