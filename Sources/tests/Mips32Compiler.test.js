import tap from 'tap'
import { Mips32Compiler } from '../ASM/Mips32Compiler.js';
const { test } = tap;

test('Code compilation v1', (t) => {
  let mipsCompiler = new Mips32Compiler(`
    void main() {
      for(int i = 0, c = 10; i < c; i = i + 1) {
        printNumber(i * 2);
        printChar(32);
      }
    }
  `)
  mipsCompiler.compile();
  mipsCompiler.run();
  console.log(mipsCompiler.stdoutBuffer())
    
  t.end();
});
