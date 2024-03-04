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

test('Code compilation v4', (t) => {
  let mipsCompiler = new Mips32Compiler(`
    int fibbo(int n, int memoizator) {
      if(n < 2) {
        return 1;
      }
      int currentElement = getElement(memoizator, n);
      if(currentElement) {
        return currentElement;
      }

      int first = fibbo(n - 1, memoizator);
      int second = fibbo(n - 2, memoizator);

      setElement(memoizator, n, first + second);
      return (first + second) % 7919;
    }

    void main() {
      int memoizator = 1024;
      printNumber(fibbo(7500, memoizator));
    }
  `, {
    stdout: 1024 * 512,
    stackPointer: 1024 * 1024,
    memorySize: 1024 * 1024 * 4
  });
  mipsCompiler.compile();
  mipsCompiler.run();
  t.equal(mipsCompiler.stdoutBuffer(), '581', 'returns true');
    
  t.end();
});

test('Code compilation v4', (t) => {
  let mipsCompiler = new Mips32Compiler(`
    void test(int pointer) {
      *pointer = 100;
    }

    void main() {
      int pointer = 1024;
      *pointer = 5;
      test(pointer);
      printNumber(*pointer);
    }
  `, {
    stdout: 1024 * 512,
    stackPointer: 1024 * 1024,
    memorySize: 1024 * 1024 * 4
  });
  mipsCompiler.compile();
  mipsCompiler.run();
  t.equal(mipsCompiler.stdoutBuffer(), '100', 'returns true');
    
  t.end();
});

test('Code compilation v5', (t) => {
  let mipsCompiler = new Mips32Compiler(`
    void test(int pointer, int n) {
      if(n >= 10) {
        return ;
      }
      *pointer = 100;
    }

    void main() {
      int pointer = 1024;
      *pointer = 5;
      test(pointer, 5);
      printNumber(*pointer);
    }
  `, {
    stdout: 1024 * 512,
    stackPointer: 1024 * 1024,
    memorySize: 1024 * 1024 * 4
  });
  mipsCompiler.compile();
  mipsCompiler.run();
  t.equal(mipsCompiler.stdoutBuffer(), '100', 'returns true');
    
  t.end();
});

test('Code compilation v6', (t) => {
  let mipsCompiler = new Mips32Compiler(`
    void test(int pointer, int n) {
      if(n >= 10) {
        return ;
      }
      *pointer = 100;
    }

    void main() {
      int pointer = 1024;
      *pointer = 5;
      test(pointer, 10);
      printNumber(*pointer);
    }
  `, {
    stdout: 1024 * 512,
    stackPointer: 1024 * 1024,
    memorySize: 1024 * 1024 * 4
  });
  mipsCompiler.compile();
  mipsCompiler.run();
  t.equal(mipsCompiler.stdoutBuffer(), '5', 'returns true');
    
  t.end();
});

test('Code compilation v7', (t) => {
  let mipsCompiler = new Mips32Compiler(`
    void permutations(int n, int k, int displayBuffer, int checker) {
      if(k >= n) {
        for(int i = 0; i < n; i = i + 1) {
          printNumber(getElement(displayBuffer, i));
          printChar(32);
        }
        printChar(10);
        return ;
      }

      for(int i = 1; i <= n; i = i + 1) {
        if(getElement(checker, i) == 0) {
          setElement(checker, i, 1);
          setElement(displayBuffer, k, i);
          permutations(n, k + 1, displayBuffer, checker);
          setElement(checker, i, 0);
        }
      }
    }

    void main() {
      int buffer = 1050, n = 3, checker = 2000;
      int responseBuffer = 504;
      permutations(n, 0, responseBuffer, checker);
    }
  `, {
    stdout: 1024 * 512,
    stackPointer: 1024 * 1024,
    memorySize: 1024 * 1024 * 4
  });
  mipsCompiler.compile();
  mipsCompiler.run();
  t.equal(mipsCompiler.stdoutBuffer(), '1 2 3 \n1 3 2 \n2 1 3 \n2 3 1 \n3 1 2 \n3 2 1 \n', 'returns true');
    
  t.end();
});

test('Code compilation v8', (t) => {
  let mipsCompiler = new Mips32Compiler(`
    int test(int pointer) {
      return 10;
      return 5;
      return 2;
      return 1;
    }

    void main() {
      int pointer = 1024;
      printNumber(test(pointer));
    }
  `, {
    stdout: 1024 * 512,
    stackPointer: 1024 * 1024,
    memorySize: 1024 * 1024 * 4
  });
  mipsCompiler.compile();
  mipsCompiler.run();
  t.equal(mipsCompiler.stdoutBuffer(), '10', 'returns true');
    
  t.end();
});

test('Code compilation v9', (t) => {
  let mipsCompiler = new Mips32Compiler(`
    void test(int pointer) {
      *pointer = 100;
      return ;
      *pointer = 150;
    }

    void main() {
      int pointer = 1024;
      test(pointer);
      printNumber(*pointer);
    }
  `, {
    stdout: 1024 * 512,
    stackPointer: 1024 * 1024,
    memorySize: 1024 * 1024 * 4
  });
  mipsCompiler.compile();
  mipsCompiler.run();
  t.equal(mipsCompiler.stdoutBuffer(), '100', 'returns true');
    
  t.end();
});

