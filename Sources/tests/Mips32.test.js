import tap from 'tap'
const { test } = tap;
import { Mips32 } from '../ASM/Mips32.js';
import { RegisterBlock } from '../ASM/Register.js';

test('Prepare header', (t) => {
  const mips32 = new Mips32(new RegisterBlock(), 10, 100);
  console.log(mips32.toString())
  // t.equal(Variable.isValid('test'), true, 'returns true');
  t.end();
});