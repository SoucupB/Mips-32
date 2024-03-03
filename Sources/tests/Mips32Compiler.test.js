import tap from 'tap'
import { Mips32Compiler } from '../ASM/Mips32Compiler.js';
const { test } = tap;

test('Code compilation v1', (t) => {
  let mipsCompiler = new Mips32Compiler(`
    void main() {
      for(int i = 0; i < 10; i = i + 1) {
        printNumber(i);
        printChar(32);
      }
    }
  `)
  mipsCompiler.compile();
  mipsCompiler.run();
  console.log(mipsCompiler.stdoutBuffer())
    
  t.end();
});
