import tap from 'tap'
const { test } = tap;
import { Mips32, MipsNoop } from '../ASM/Mips32.js';
import { Add, Cmp, Div, Jmp, JmpTypes, Jz, Label, Mov, MovTypes, Mul, Pop, Prp, Push, RegisterBlock, Setdor, Sete, Setge, Setle, Setne, Setnz, Sub, Test } from '../ASM/Register.js';
import { Program } from '../AST/Program.js';
import { Compiler } from '../ASM/Compiler.js';

// // test('Code translation v1', (t) => {
// //   let registerBlock = new RegisterBlock();
// //   registerBlock.push(new Mov(0, 1, MovTypes.REG_TO_REG))
// //   registerBlock.push(new Mov(3, 2242, MovTypes.NUMBER_TO_REG))
// //   registerBlock.push(new Mov(4, 8, MovTypes.STACK_TO_REG))
// //   registerBlock.push(new Mov(5, 8, MovTypes.REG_TO_STACK))
// //   registerBlock.push(new Mov(5, 9, MovTypes.REG_MEM_TO_REG))
// //   registerBlock.push(new Mov(2, 3, MovTypes.REG_TO_MEM_REG))
// //   registerBlock.push(new Push(2))
// //   registerBlock.push(new Add(2, 3, 4))
// //   registerBlock.push(new Pop(4))
// //   registerBlock.push(new Mul(1, 2, 3))
// //   registerBlock.push(new Div(1, 2))
// //   registerBlock.push(new Mov(1, 'LO', MovTypes.REG_TO_REG))
// //   registerBlock.push(new Mov(2, 'HI', MovTypes.REG_TO_REG))
// //   registerBlock.push(new Jmp(2, JmpTypes.REGISTER))
// //   registerBlock.push(new Cmp(5, 6))
// //   registerBlock.push(new Mov(9, 'CF', MovTypes.REG_TO_REG))
// //   registerBlock.push(new Mov(9, 'CT', MovTypes.REG_TO_REG))

// //   registerBlock.push(new Cmp(8, 9))
// //   registerBlock.push(new Setne(7))
// //   registerBlock.push(new Label('_yolo'));

// //   registerBlock.push(new Cmp(3, 4))
// //   registerBlock.push(new Sete(16))

// //   // $7 >= $8
// //   registerBlock.push(new Cmp(7, 8))
// //   registerBlock.push(new Setge(16))
// //   registerBlock.push(new MipsNoop())

// //   registerBlock.push(new Cmp(4, 8))
// //   registerBlock.push(new Setnz(12))

// //   registerBlock.push(new Cmp(3, 5))
// //   registerBlock.push(new Setdor(12))
// //   registerBlock.push(new Prp(5, 0))

// //   registerBlock.push(new Test(1, 2))
// //   registerBlock.push(new Jz('_yolo'))
// //   registerBlock.push(new Jmp('_yolo', JmpTypes.LABEL))
// //   const mips32 = new Mips32(registerBlock, 10, 100);
// //   // console.log(mips32.toString())
// //   // t.equal(Variable.isValid('test'), true, 'returns true');
// //   t.end();
// // });

test('Code translation v2', (t) => {
  const program = new Program(`
    void main() {
      int a = 10, b = 15;
      int c = a + b;
      int pointer = 2048;
      *pointer = c;
    }
  `, [], false)
  let chomp = program.chomp();
  t.equal(chomp.isInvalid(), false, 'returns');
  let programCompiler = new Compiler(null);
  let asmBlock = programCompiler.compileProgram(chomp);
  // console.log(asmBlock.toString(), '\n--------------------\n')

  const mips32 = new Mips32(asmBlock, 1024 * 2, 1024 * 4);
  mips32.run();
  // console.log(mips32.toString())
  // console.log(mips32.runner.printPointerBytes(32, 2048))
  // t.equal(Variable.isValid('test'), true, 'returns true');
  t.end();
});

test('Code translation v1', (t) => {
  let registerBlock = new RegisterBlock();
  registerBlock.push(new Mov(0, 25, MovTypes.NUMBER_TO_REG))
  registerBlock.push(new Push(0))
  const mips32 = new Mips32(registerBlock, 1024 * 2, 1024 * 4);
  mips32.run();
  t.equal(mips32.runner.printPointerBytes(32, 4096)[0], 25, 'returns true');
  t.end();
});

test('Code translation v2', (t) => {
  let registerBlock = new RegisterBlock();
  registerBlock.push(new Mov(0, 25, MovTypes.NUMBER_TO_REG))
  registerBlock.push(new Mov(1, 32, MovTypes.NUMBER_TO_REG))
  registerBlock.push(new Add(2, 0, 1))
  registerBlock.push(new Push(2))
  const mips32 = new Mips32(registerBlock, 1024 * 2, 1024 * 4);
  mips32.run();
  t.equal(mips32.runner.printPointerBytes(32, 4096)[0], 57, 'returns true');
  t.end();
});

test('Code translation v3', (t) => {
  let registerBlock = new RegisterBlock();
  registerBlock.push(new Mov(0, 25, MovTypes.NUMBER_TO_REG))
  registerBlock.push(new Mov(1, 32, MovTypes.NUMBER_TO_REG))
  registerBlock.push(new Sub(2, 1, 0))
  registerBlock.push(new Push(2))
  const mips32 = new Mips32(registerBlock, 1024 * 2, 1024 * 4);
  mips32.run();
  t.equal(mips32.runner.printPointerBytes(32, 4096)[0], 7, 'returns true');
  t.end();
});

test('Code translation v4', (t) => {
  let registerBlock = new RegisterBlock();
  registerBlock.push(new Mov(0, 25, MovTypes.NUMBER_TO_REG))
  registerBlock.push(new Mov(1, 1000, MovTypes.NUMBER_TO_REG))
  registerBlock.push(new Mov(1, 0, MovTypes.REG_TO_MEM_REG))
  registerBlock.push(new Mov(2, 1, MovTypes.REG_MEM_TO_REG))
  registerBlock.push(new Push(2))
  const mips32 = new Mips32(registerBlock, 1024 * 2, 1024 * 4);
  mips32.run();
  t.equal(mips32.runner.printPointerBytes(32, 4096)[0], 25, 'returns true');
  t.equal(mips32.runner.printPointerBytes(32, 1000)[0], 25, 'returns true');
  t.end();
});

test('Code translation v5', (t) => {
  let registerBlock = new RegisterBlock();
  registerBlock.push(new Mov(0, 31, MovTypes.NUMBER_TO_REG))
  registerBlock.push(new Mov(1, 1000, MovTypes.NUMBER_TO_REG))
  registerBlock.push(new Div(1, 0))
  registerBlock.push(new Push('LO'))
  registerBlock.push(new Push('HI'))
  const mips32 = new Mips32(registerBlock, 1024 * 2, 1024 * 4);
  mips32.run();
  t.equal(mips32.runner.printPointerBytes(32, 4096)[0], 32, 'returns true');
  t.equal(mips32.runner.printPointerBytes(32, 4100)[0], 8, 'returns true');
  t.end();
});

test('Code translation v6', (t) => {
  let registerBlock = new RegisterBlock();
  registerBlock.push(new Mov(0, 31, MovTypes.NUMBER_TO_REG))
  registerBlock.push(new Mov(1, 31, MovTypes.NUMBER_TO_REG))
  registerBlock.push(new Cmp(1, 0))
  registerBlock.push(new Sete(2))
  registerBlock.push(new Push(2))
  registerBlock.push(new Mov(3, 35, MovTypes.NUMBER_TO_REG))
  registerBlock.push(new Mov(4, 31, MovTypes.NUMBER_TO_REG))
  registerBlock.push(new Cmp(3, 4))

  registerBlock.push(new Setne(6))
  registerBlock.push(new Push(6))

  registerBlock.push(new Sete(7))
  registerBlock.push(new Push(7))

  registerBlock.push(new Setle(8))
  registerBlock.push(new Push(8))

  registerBlock.push(new Setge(9))
  registerBlock.push(new Push(9))
  
  const mips32 = new Mips32(registerBlock, 1024 * 2, 1024 * 4);
  mips32.run();
  t.equal(mips32.runner.printPointerBytes(32, 4096)[0], 1, 'returns true');
  t.equal(mips32.runner.printPointerBytes(32, 4100)[0], 1, 'returns true');
  t.equal(mips32.runner.printPointerBytes(32, 4104)[0], 0, 'returns true');
  t.equal(mips32.runner.printPointerBytes(32, 4108)[0], 0, 'returns true');
  t.equal(mips32.runner.printPointerBytes(32, 4112)[0], 1, 'returns true');
  t.end();
});

test('Code translation v7', (t) => {
  let registerBlock = new RegisterBlock();
  registerBlock.push(new Mov(0, 3, MovTypes.NUMBER_TO_REG))
  registerBlock.push(new Mov(1, 5, MovTypes.NUMBER_TO_REG))
  registerBlock.push(new Cmp(1, 0))
  registerBlock.push(new Setdor(2))
  registerBlock.push(new Push(2))

  registerBlock.push(new Setnz(3))
  registerBlock.push(new Push(3))

  registerBlock.push(new Mov(0, 0, MovTypes.NUMBER_TO_REG))
  registerBlock.push(new Mov(1, 5, MovTypes.NUMBER_TO_REG))
  registerBlock.push(new Cmp(1, 0))

  registerBlock.push(new Setdor(2))
  registerBlock.push(new Push(2))

  registerBlock.push(new Setnz(3))
  registerBlock.push(new Push(3))

  registerBlock.push(new Mov(0, 0, MovTypes.NUMBER_TO_REG))
  registerBlock.push(new Mov(1, 0, MovTypes.NUMBER_TO_REG))
  registerBlock.push(new Cmp(1, 0))

  registerBlock.push(new Setdor(2))
  registerBlock.push(new Push(2))
  
  const mips32 = new Mips32(registerBlock, 1024 * 2, 1024 * 4);
  mips32.run();
  t.equal(mips32.runner.printPointerBytes(32, 4096)[0], 1, 'returns true');
  t.equal(mips32.runner.printPointerBytes(32, 4100)[0], 1, 'returns true');
  t.equal(mips32.runner.printPointerBytes(32, 4104)[0], 1, 'returns true');
  t.equal(mips32.runner.printPointerBytes(32, 4108)[0], 0, 'returns true');
  t.equal(mips32.runner.printPointerBytes(32, 4112)[0], 0, 'returns true');
  t.end();
});

test('Code translation v7', (t) => {
  let registerBlock = new RegisterBlock();
  registerBlock.push(new Mov(0, 3, MovTypes.NUMBER_TO_REG))
  registerBlock.push(new Mov(1, 5, MovTypes.NUMBER_TO_REG))
  registerBlock.push(new Cmp(1, 0))
  registerBlock.push(new Setdor(2))
  registerBlock.push(new Push(2))

  registerBlock.push(new Setnz(3))
  registerBlock.push(new Push(3))

  registerBlock.push(new Mov(0, 0, MovTypes.NUMBER_TO_REG))
  registerBlock.push(new Mov(1, 5, MovTypes.NUMBER_TO_REG))
  registerBlock.push(new Cmp(1, 0))

  registerBlock.push(new Setdor(2))
  registerBlock.push(new Push(2))

  registerBlock.push(new Setnz(3))
  registerBlock.push(new Push(3))

  registerBlock.push(new Mov(0, 0, MovTypes.NUMBER_TO_REG))
  registerBlock.push(new Mov(1, 0, MovTypes.NUMBER_TO_REG))
  registerBlock.push(new Cmp(1, 0))

  registerBlock.push(new Setdor(2))
  registerBlock.push(new Push(2))
  
  const mips32 = new Mips32(registerBlock, 1024 * 2, 1024 * 4);
  mips32.run();
  // console.log(mips32.runner.printPointerBytes(32, 1000))
  // console.log(mips32.runner.printPointerBytes(32, 4096))
  // console.log(mips32.toString())
  t.equal(mips32.runner.printPointerBytes(32, 4096)[0], 1, 'returns true');
  t.equal(mips32.runner.printPointerBytes(32, 4100)[0], 1, 'returns true');
  t.equal(mips32.runner.printPointerBytes(32, 4104)[0], 1, 'returns true');
  t.equal(mips32.runner.printPointerBytes(32, 4108)[0], 0, 'returns true');
  t.equal(mips32.runner.printPointerBytes(32, 4112)[0], 0, 'returns true');
  t.end();
});

test('Code translation v8', (t) => {
  let registerBlock = new RegisterBlock();
  registerBlock.push(new Mov(0, 3, MovTypes.NUMBER_TO_REG))
  registerBlock.push(new Mov(1, 5, MovTypes.NUMBER_TO_REG))
  registerBlock.push(new Cmp(0, 1))
  registerBlock.push(new Mov(3, 'CF', MovTypes.REG_TO_REG))
  registerBlock.push(new Mov(4, 'CT', MovTypes.REG_TO_REG))
  registerBlock.push(new Push(3))
  registerBlock.push(new Push(4))
  
  const mips32 = new Mips32(registerBlock, 1024 * 2, 1024 * 4);
  mips32.run();
  t.equal(mips32.runner.printPointerBytes(32, 4096)[0], 1, 'returns true');
  t.equal(mips32.runner.printPointerBytes(32, 4100)[0], 0, 'returns true');
  t.end();
});

test('Code translation v8', (t) => {
  let registerBlock = new RegisterBlock();
  registerBlock.push(new Mov(0, 5, MovTypes.NUMBER_TO_REG))
  registerBlock.push(new Mov(1, 5, MovTypes.NUMBER_TO_REG))
  registerBlock.push(new Cmp(0, 1))
  registerBlock.push(new Mov(3, 'CF', MovTypes.REG_TO_REG))
  registerBlock.push(new Mov(4, 'CT', MovTypes.REG_TO_REG))
  registerBlock.push(new Push(3))
  registerBlock.push(new Push(4))
  
  const mips32 = new Mips32(registerBlock, 1024 * 2, 1024 * 4);
  mips32.run();
  t.equal(mips32.runner.printPointerBytes(32, 4096)[0], 0, 'returns true');
  t.equal(mips32.runner.printPointerBytes(32, 4100)[0], 0, 'returns true');
  t.end();
});

test('Code translation v9', (t) => {
  let registerBlock = new RegisterBlock();
  registerBlock.push(new Mov(0, 9, MovTypes.NUMBER_TO_REG))
  registerBlock.push(new Mov(1, 5, MovTypes.NUMBER_TO_REG))
  registerBlock.push(new Cmp(0, 1))
  registerBlock.push(new Mov(3, 'CF', MovTypes.REG_TO_REG))
  registerBlock.push(new Mov(4, 'CT', MovTypes.REG_TO_REG))
  registerBlock.push(new Push(3))
  registerBlock.push(new Push(4))
  
  const mips32 = new Mips32(registerBlock, 1024 * 2, 1024 * 4);
  mips32.run();
  t.equal(mips32.runner.printPointerBytes(32, 4096)[0], 0, 'returns true');
  t.equal(mips32.runner.printPointerBytes(32, 4100)[0], 1, 'returns true');
  t.end();
});

test('Code translation v10', (t) => {
  const program = new Program(`
    void main() {
      int a = 0, i = 11, j = 1;
      while(j < i) {
        a = a + j;
        j = j + 1;
      }
      int pointer = 2048;
      *pointer = a;
    }
  `, [], false)
  let chomp = program.chomp();
  t.equal(chomp.isInvalid(), false, 'returns');
  let programCompiler = new Compiler(null);
  let asmBlock = programCompiler.compileProgram(chomp);
  const mips32 = new Mips32(asmBlock, 1024 * 2, 1024 * 4);
  mips32.run();
  t.equal(mips32.runner.printPointerBytes(32, 2048)[0], 55, 'returns true');
  t.end();
});

test('Code translation v11', (t) => {
  const program = new Program(`
    void main() {
      int a = 0;
      for(int i = 0; i < 15; i = i + 1) {
        a = a + i;
      }
      *(2048) = a;
    }
  `, [], false)
  let chomp = program.chomp();
  t.equal(chomp.isInvalid(), false, 'returns');
  let programCompiler = new Compiler(null);
  let asmBlock = programCompiler.compileProgram(chomp);
  const mips32 = new Mips32(asmBlock, 1024 * 2, 1024 * 4);
  mips32.run();
  t.equal(mips32.runner.printPointerBytes(32, 2048)[0], 105, 'returns true');
  t.end();
});

test('Code translation v12', (t) => {
  const program = new Program(`
    void main() {
      int a = 0, b = 1;
      for(int i = 0; i < 5; i = i + 1) {
        int c = a + b;
        a = b;
        b = c;
      }
      *(2048) = b;
    }
  `)
  let chomp = program.chomp();
  t.equal(chomp.isInvalid(), false, 'returns');
  let programCompiler = new Compiler(null);
  let asmBlock = programCompiler.compileProgram(chomp);
  // console.log(asmBlock.toString(), '\n--------------------\n')

  const mips32 = new Mips32(asmBlock, 1024 * 2, 1024 * 4);
  mips32.run();
  t.equal(mips32.runner.printPointerBytes(32, 2048)[0], 8, 'returns true');
  t.end();
});

test('Code translation v13', (t) => {
  const program = new Program(`
    void main() {
      int a = 0, b = 1;
      for(int i = 0; i < 9; i = i + 1) {
        int c = a + b;
        a = b;
        b = c;
      }
      *(2048) = b;
    }
  `)
  let chomp = program.chomp();
  t.equal(chomp.isInvalid(), false, 'returns');
  let programCompiler = new Compiler(null);
  let asmBlock = programCompiler.compileProgram(chomp);
  // console.log(asmBlock.toString(), '\n--------------------\n')

  const mips32 = new Mips32(asmBlock, 1024 * 2, 1024 * 4);
  mips32.run();
  // console.log(mips32.runner.printPointerBytes(32, 2048))
  // console.log(`-----`)
  // console.log(mips32.toString(true))
  // console.log(mips32.runner.printPointerBytes(32, 2048))
  t.equal(mips32.runner.printPointerBytes(32, 2048)[0], 55, 'returns true');
  // t.equal(Variable.isValid('test'), true, 'returns true');
  t.end();
});

test('Code translation v14', (t) => {
  const program = new Program(`
    int fibbo(int n) {
      int a = 0, b = 1;
      for(int i = 0; i < n; i = i + 1) {
        int c = a + b;
        a = b;
        b = c;
      }
      return b;
    }

    void main() {
      *(2048) = fibbo(9);
    }
  `, [], false)
  let chomp = program.chomp();
  t.equal(chomp.isInvalid(), false, 'returns');
  let programCompiler = new Compiler(null);
  let asmBlock = programCompiler.compileProgram(chomp);
  // console.log(asmBlock.toString(), '\n--------------------\n')

  const mips32 = new Mips32(asmBlock, 1024 * 2, 1024 * 4);
  mips32.run();
  // console.log(mips32.runner.printPointerBytes(32, 2048))
  // console.log(`-----`)
  // console.log(mips32.toString(true))
  console.log(mips32.runner.printPointerBytes(32, 2048))
  // t.equal(mips32.runner.printPointerBytes(32, 2048)[0], 55, 'returns true');
  // t.equal(Variable.isValid('test'), true, 'returns true');
  t.end();
});