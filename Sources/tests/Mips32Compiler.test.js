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
  t.equal(mipsCompiler.stdoutBuffer(), '0 2 4 6 8 10 12 14 16 18 ', 'returns true');
    
  t.end();
});

test('Code compilation v2', (t) => {
  let mipsCompiler = new Mips32Compiler(`
    int cmmdc(int a, int b) {
      if(b == 0) {
        return a;
      }
      return cmmdc(b, a % b);
    }

    void main() {
      printNumber(cmmdc(12, 16));
    }
  `)
  mipsCompiler.compile();
  mipsCompiler.run();
  t.equal(mipsCompiler.stdoutBuffer(), '4', 'returns true');
    
  t.end();
});

test('Code compilation v3', (t) => {
  let mipsCompiler = new Mips32Compiler(`
    int cmmdc(int a, int b) {
      if(b == 0) {
        return a;
      }
      return cmmdc(b, a % b);
    }

    void main() {
      printNumber(cmmdc(3556, 8382));
    }
  `)
  mipsCompiler.compile();
  mipsCompiler.run();
  t.equal(mipsCompiler.stdoutBuffer(), '254', 'returns true');
    
  t.end();
});
