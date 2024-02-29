import tap from 'tap'
const { test } = tap;
import { Mips32 } from '../ASM/Mips32.js';
import { Add, Mov, MovTypes, Mul, Pop, Push, RegisterBlock } from '../ASM/Register.js';

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
  const mips32 = new Mips32(registerBlock, 10, 100);
  console.log(mips32.toString())
  // t.equal(Variable.isValid('test'), true, 'returns true');
  t.end();
});