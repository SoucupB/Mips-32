import tap from 'tap'
const { test } = tap;
import { Mips32 } from '../ASM/Mips32.js';
import { Add, Cmp, Div, Jmp, JmpTypes, Mov, MovTypes, Mul, Pop, Push, RegisterBlock, Sete, Setge, Setne } from '../ASM/Register.js';

test('Prepare header', (t) => {
  let registerBlock = new RegisterBlock();
  registerBlock.push(new Mov(0, 1, MovTypes.REG_TO_REG))
  registerBlock.push(new Mov(3, 2242, MovTypes.NUMBER_TO_REG))
  registerBlock.push(new Mov(4, 8, MovTypes.STACK_TO_REG))
  registerBlock.push(new Mov(5, 8, MovTypes.REG_TO_STACK))
  registerBlock.push(new Mov(5, 9, MovTypes.REG_MEM_TO_REG))
  registerBlock.push(new Mov(2, 3, MovTypes.REG_TO_MEM_REG))
  registerBlock.push(new Push(2))
  registerBlock.push(new Add(2, 3, 4))
  registerBlock.push(new Pop(4))
  registerBlock.push(new Mul(1, 2, 3))
  registerBlock.push(new Div(1, 2))
  registerBlock.push(new Mov(1, 'LO', MovTypes.REG_TO_REG))
  registerBlock.push(new Mov(2, 'HI', MovTypes.REG_TO_REG))
  registerBlock.push(new Jmp(2, JmpTypes.REGISTER))
  registerBlock.push(new Cmp(5, 6))
  registerBlock.push(new Mov(9, 'CF', MovTypes.REG_TO_REG))
  registerBlock.push(new Mov(9, 'CT', MovTypes.REG_TO_REG))

  registerBlock.push(new Cmp(8, 9))
  registerBlock.push(new Setne(7))

  registerBlock.push(new Cmp(3, 4))
  registerBlock.push(new Sete(16))

  // $7 >= $8
  registerBlock.push(new Cmp(7, 8))
  registerBlock.push(new Setge(16))
  const mips32 = new Mips32(registerBlock, 10, 100);
  console.log(mips32.toString())
  // t.equal(Variable.isValid('test'), true, 'returns true');
  t.end();
});