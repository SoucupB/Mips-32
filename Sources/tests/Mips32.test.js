import tap from 'tap'
const { test } = tap;
import { Mips32, MipsNoop } from '../ASM/Mips32.js';
import { Add, Cmp, Div, Jmp, JmpTypes, Jz, Label, Mov, MovTypes, Mul, Or, Pop, Prp, Push, RegisterBlock, Setdor, Sete, Setge, Setle, Setne, Setnz, Sub, Test } from '../ASM/Register.js';
import { Program } from '../AST/Program.js';
import { Compiler } from '../ASM/Compiler.js';

// test('Code translation v1', (t) => {
//   let registerBlock = new RegisterBlock();
//   registerBlock.push(new Mov(0, 25, MovTypes.NUMBER_TO_REG))
//   registerBlock.push(new Push(0))
//   const mips32 = new Mips32(registerBlock, 1024 * 2, 1024 * 4);
//   mips32.run();
//   t.equal(mips32.runner.printPointerBytes(32, 4096)[0], 25, 'returns true');
//   t.end();
// });

// test('Code translation v2', (t) => {
//   let registerBlock = new RegisterBlock();
//   registerBlock.push(new Mov(0, 25, MovTypes.NUMBER_TO_REG))
//   registerBlock.push(new Mov(1, 32, MovTypes.NUMBER_TO_REG))
//   registerBlock.push(new Add(2, 0, 1))
//   registerBlock.push(new Push(2))
//   const mips32 = new Mips32(registerBlock, 1024 * 2, 1024 * 4);
//   mips32.run();
//   t.equal(mips32.runner.printPointerBytes(32, 4096)[0], 57, 'returns true');
//   t.end();
// });

// test('Code translation v3', (t) => {
//   let registerBlock = new RegisterBlock();
//   registerBlock.push(new Mov(0, 25, MovTypes.NUMBER_TO_REG))
//   registerBlock.push(new Mov(1, 32, MovTypes.NUMBER_TO_REG))
//   registerBlock.push(new Sub(2, 1, 0))
//   registerBlock.push(new Push(2))
//   const mips32 = new Mips32(registerBlock, 1024 * 2, 1024 * 4);
//   mips32.run();
//   t.equal(mips32.runner.printPointerBytes(32, 4096)[0], 7, 'returns true');
//   t.end();
// });

// test('Code translation v4', (t) => {
//   let registerBlock = new RegisterBlock();
//   registerBlock.push(new Mov(0, 25, MovTypes.NUMBER_TO_REG))
//   registerBlock.push(new Mov(1, 1000, MovTypes.NUMBER_TO_REG))
//   registerBlock.push(new Mov(1, 0, MovTypes.REG_TO_MEM_REG))
//   registerBlock.push(new Mov(2, 1, MovTypes.REG_MEM_TO_REG))
//   registerBlock.push(new Push(2))
//   const mips32 = new Mips32(registerBlock, 1024 * 2, 1024 * 4);
//   mips32.run();
//   t.equal(mips32.runner.printPointerBytes(32, 4096)[0], 25, 'returns true');
//   t.equal(mips32.runner.printPointerBytes(32, 1000)[0], 25, 'returns true');
//   t.end();
// });

// test('Code translation v5', (t) => {
//   let registerBlock = new RegisterBlock();
//   registerBlock.push(new Mov(0, 31, MovTypes.NUMBER_TO_REG))
//   registerBlock.push(new Mov(1, 1000, MovTypes.NUMBER_TO_REG))
//   registerBlock.push(new Div(1, 0))
//   registerBlock.push(new Push('LO'))
//   registerBlock.push(new Push('HI'))
//   const mips32 = new Mips32(registerBlock, 1024 * 2, 1024 * 4);
//   mips32.run();
//   t.equal(mips32.runner.printPointerBytes(32, 4096)[0], 32, 'returns true');
//   t.equal(mips32.runner.printPointerBytes(32, 4100)[0], 8, 'returns true');
//   t.end();
// });

// test('Code translation v6', (t) => {
//   let registerBlock = new RegisterBlock();
//   registerBlock.push(new Mov(0, 31, MovTypes.NUMBER_TO_REG))
//   registerBlock.push(new Mov(1, 31, MovTypes.NUMBER_TO_REG))
//   registerBlock.push(new Cmp(1, 0))
//   registerBlock.push(new Sete(2))
//   registerBlock.push(new Push(2))
//   registerBlock.push(new Mov(3, 35, MovTypes.NUMBER_TO_REG))
//   registerBlock.push(new Mov(4, 31, MovTypes.NUMBER_TO_REG))
//   registerBlock.push(new Cmp(3, 4))

//   registerBlock.push(new Setne(6))
//   registerBlock.push(new Push(6))

//   registerBlock.push(new Sete(7))
//   registerBlock.push(new Push(7))

//   registerBlock.push(new Setle(8))
//   registerBlock.push(new Push(8))

//   registerBlock.push(new Setge(9))
//   registerBlock.push(new Push(9))
  
//   const mips32 = new Mips32(registerBlock, 1024 * 2, 1024 * 4);
//   mips32.run();
//   t.equal(mips32.runner.printPointerBytes(32, 4096)[0], 1, 'returns true');
//   t.equal(mips32.runner.printPointerBytes(32, 4100)[0], 1, 'returns true');
//   t.equal(mips32.runner.printPointerBytes(32, 4104)[0], 0, 'returns true');
//   t.equal(mips32.runner.printPointerBytes(32, 4108)[0], 0, 'returns true');
//   t.equal(mips32.runner.printPointerBytes(32, 4112)[0], 1, 'returns true');
//   t.end();
// });

// test('Code translation v7', (t) => {
//   let registerBlock = new RegisterBlock();
//   registerBlock.push(new Mov(0, 3, MovTypes.NUMBER_TO_REG))
//   registerBlock.push(new Mov(1, 5, MovTypes.NUMBER_TO_REG))
//   registerBlock.push(new Cmp(1, 0))
//   registerBlock.push(new Or(1, 0))
//   registerBlock.push(new Setdor(2))
//   registerBlock.push(new Push(2))

//   registerBlock.push(new Setnz(3))
//   registerBlock.push(new Push(3))

//   registerBlock.push(new Mov(0, 0, MovTypes.NUMBER_TO_REG))
//   registerBlock.push(new Mov(1, 5, MovTypes.NUMBER_TO_REG))
//   registerBlock.push(new Cmp(1, 0))
//   registerBlock.push(new Or(1, 0))

//   registerBlock.push(new Setdor(2))
//   registerBlock.push(new Push(2))

//   registerBlock.push(new Setnz(3))
//   registerBlock.push(new Push(3))

//   registerBlock.push(new Mov(0, 0, MovTypes.NUMBER_TO_REG))
//   registerBlock.push(new Mov(1, 0, MovTypes.NUMBER_TO_REG))
//   registerBlock.push(new Cmp(1, 0))
//   registerBlock.push(new Or(1, 0))

//   registerBlock.push(new Setdor(2))
//   registerBlock.push(new Push(2))
  
//   const mips32 = new Mips32(registerBlock, 1024 * 2, 1024 * 4);
//   mips32.run();
//   t.equal(mips32.runner.printPointerBytes(32, 4096)[0], 1, 'returns true');
//   t.equal(mips32.runner.printPointerBytes(32, 4100)[0], 1, 'returns true');
//   t.equal(mips32.runner.printPointerBytes(32, 4104)[0], 1, 'returns true');
//   t.equal(mips32.runner.printPointerBytes(32, 4108)[0], 0, 'returns true');
//   t.equal(mips32.runner.printPointerBytes(32, 4112)[0], 0, 'returns true');
//   t.end();
// });

// test('Code translation v7', (t) => {
//   let registerBlock = new RegisterBlock();
//   registerBlock.push(new Mov(0, 3, MovTypes.NUMBER_TO_REG))
//   registerBlock.push(new Mov(1, 5, MovTypes.NUMBER_TO_REG))
//   registerBlock.push(new Cmp(1, 0))
//   registerBlock.push(new Or(1, 0))
//   registerBlock.push(new Setdor(2))
//   registerBlock.push(new Push(2))

//   registerBlock.push(new Setnz(3))
//   registerBlock.push(new Push(3))

//   registerBlock.push(new Mov(0, 0, MovTypes.NUMBER_TO_REG))
//   registerBlock.push(new Mov(1, 5, MovTypes.NUMBER_TO_REG))
//   registerBlock.push(new Cmp(1, 0))
//   registerBlock.push(new Or(1, 0))

//   registerBlock.push(new Setdor(2))
//   registerBlock.push(new Push(2))

//   registerBlock.push(new Setnz(3))
//   registerBlock.push(new Push(3))

//   registerBlock.push(new Mov(0, 0, MovTypes.NUMBER_TO_REG))
//   registerBlock.push(new Mov(1, 0, MovTypes.NUMBER_TO_REG))
//   registerBlock.push(new Or(1, 0))

//   registerBlock.push(new Setdor(2))
//   registerBlock.push(new Push(2))
  
//   const mips32 = new Mips32(registerBlock, 1024 * 2, 1024 * 4);
//   mips32.run();
//   t.equal(mips32.runner.printPointerBytes(32, 4096)[0], 1, 'returns true');
//   t.equal(mips32.runner.printPointerBytes(32, 4100)[0], 1, 'returns true');
//   t.equal(mips32.runner.printPointerBytes(32, 4104)[0], 1, 'returns true');
//   t.equal(mips32.runner.printPointerBytes(32, 4108)[0], 0, 'returns true');
//   t.equal(mips32.runner.printPointerBytes(32, 4112)[0], 0, 'returns true');
//   t.end();
// });

// test('Code translation v8', (t) => {
//   let registerBlock = new RegisterBlock();
//   registerBlock.push(new Mov(0, 3, MovTypes.NUMBER_TO_REG))
//   registerBlock.push(new Mov(1, 5, MovTypes.NUMBER_TO_REG))
//   registerBlock.push(new Cmp(0, 1))
//   registerBlock.push(new Mov(3, 'CF', MovTypes.REG_TO_REG))
//   registerBlock.push(new Mov(4, 'CT', MovTypes.REG_TO_REG))
//   registerBlock.push(new Push(3))
//   registerBlock.push(new Push(4))
  
//   const mips32 = new Mips32(registerBlock, 1024 * 2, 1024 * 4);
//   mips32.run();
//   t.equal(mips32.runner.printPointerBytes(32, 4096)[0], 1, 'returns true');
//   t.equal(mips32.runner.printPointerBytes(32, 4100)[0], 0, 'returns true');
//   t.end();
// });

// test('Code translation v8', (t) => {
//   let registerBlock = new RegisterBlock();
//   registerBlock.push(new Mov(0, 5, MovTypes.NUMBER_TO_REG))
//   registerBlock.push(new Mov(1, 5, MovTypes.NUMBER_TO_REG))
//   registerBlock.push(new Cmp(0, 1))
//   registerBlock.push(new Mov(3, 'CF', MovTypes.REG_TO_REG))
//   registerBlock.push(new Mov(4, 'CT', MovTypes.REG_TO_REG))
//   registerBlock.push(new Push(3))
//   registerBlock.push(new Push(4))
  
//   const mips32 = new Mips32(registerBlock, 1024 * 2, 1024 * 4);
//   mips32.run();
//   t.equal(mips32.runner.printPointerBytes(32, 4096)[0], 0, 'returns true');
//   t.equal(mips32.runner.printPointerBytes(32, 4100)[0], 0, 'returns true');
//   t.end();
// });

// test('Code translation v9', (t) => {
//   let registerBlock = new RegisterBlock();
//   registerBlock.push(new Mov(0, 9, MovTypes.NUMBER_TO_REG))
//   registerBlock.push(new Mov(1, 5, MovTypes.NUMBER_TO_REG))
//   registerBlock.push(new Cmp(0, 1))
//   registerBlock.push(new Mov(3, 'CF', MovTypes.REG_TO_REG))
//   registerBlock.push(new Mov(4, 'CT', MovTypes.REG_TO_REG))
//   registerBlock.push(new Push(3))
//   registerBlock.push(new Push(4))
  
//   const mips32 = new Mips32(registerBlock, 1024 * 2, 1024 * 4);
//   mips32.run();
//   t.equal(mips32.runner.printPointerBytes(32, 4096)[0], 0, 'returns true');
//   t.equal(mips32.runner.printPointerBytes(32, 4100)[0], 1, 'returns true');
//   t.end();
// });

// test('Code translation v10', (t) => {
//   const program = new Program(`
//     void main() {
//       int a = 0, i = 11, j = 1;
//       while(j < i) {
//         a = a + j;
//         j = j + 1;
//       }
//       int pointer = 2048;
//       *pointer = a;
//     }
//   `, [], false)
//   let chomp = program.chomp();
//   t.equal(chomp.isInvalid(), false, 'returns');
//   let programCompiler = new Compiler(null);
//   let asmBlock = programCompiler.compileProgram(chomp);
//   const mips32 = new Mips32(asmBlock, 1024 * 2, 1024 * 4);
//   mips32.run();
//   t.equal(mips32.runner.printPointerBytes(32, 2048)[0], 55, 'returns true');
//   t.equal(mips32.runner.getStackPointer(), 2048, 'returns true');
//   t.end();
// });

// test('Code translation v11', (t) => {
//   const program = new Program(`
//     void main() {
//       int a = 0;
//       for(int i = 0; i < 15; i = i + 1) {
//         a = a + i;
//       }
//       *(2048) = a;
//     }
//   `, [], false)
//   let chomp = program.chomp();
//   t.equal(chomp.isInvalid(), false, 'returns');
//   let programCompiler = new Compiler(null);
//   let asmBlock = programCompiler.compileProgram(chomp);
//   const mips32 = new Mips32(asmBlock, 1024 * 2, 1024 * 4);
//   mips32.run();
//   t.equal(mips32.runner.printPointerBytes(32, 2048)[0], 105, 'returns true');
//   t.equal(mips32.runner.getStackPointer(), 2048, 'returns true');
//   t.end();
// });

// test('Code translation v12', (t) => {
//   const program = new Program(`
//     void main() {
//       int a = 0, b = 1;
//       for(int i = 0; i < 5; i = i + 1) {
//         int c = a + b;
//         a = b;
//         b = c;
//       }
//       *(2048) = b;
//     }
//   `)
//   let chomp = program.chomp();
//   t.equal(chomp.isInvalid(), false, 'returns');
//   let programCompiler = new Compiler(null);
//   let asmBlock = programCompiler.compileProgram(chomp);

//   const mips32 = new Mips32(asmBlock, 1024 * 2, 1024 * 4);
//   mips32.run();
//   t.equal(mips32.runner.printPointerBytes(32, 2048)[0], 8, 'returns true');
//   t.equal(mips32.runner.getStackPointer(), 2048, 'returns true');
//   t.end();
// });

// test('Code translation v13', (t) => {
//   const program = new Program(`
//     void main() {
//       int a = 0, b = 1;
//       for(int i = 0; i < 9; i = i + 1) {
//         int c = a + b;
//         a = b;
//         b = c;
//       }
//       *(2048) = b;
//     }
//   `)
//   let chomp = program.chomp();
//   t.equal(chomp.isInvalid(), false, 'returns');
//   let programCompiler = new Compiler(null);
//   let asmBlock = programCompiler.compileProgram(chomp);

//   const mips32 = new Mips32(asmBlock, 1024 * 2, 1024 * 4);
//   mips32.run();
//   t.equal(mips32.runner.printPointerBytes(32, 2048)[0], 55, 'returns true');
//   t.equal(mips32.runner.getStackPointer(), 2048, 'returns true');
//   t.end();
// });

// test('Code translation v14', (t) => {
//   const program = new Program(`
//     int fibbo(int n) {
//       int a = 0, b = 1;
//       for(int i = 0; i < n; i = i + 1) {
//         int c = a + b;
//         a = b;
//         b = c;
//       }
//       return b;
//     }

//     void main() {
//       *(2048) = fibbo(9);
//     }
//   `, [], false)
//   let chomp = program.chomp();
//   t.equal(chomp.isInvalid(), false, 'returns');
//   let programCompiler = new Compiler(null);
//   let asmBlock = programCompiler.compileProgram(chomp);
//   const mips32 = new Mips32(asmBlock, 1024 * 2, 1024 * 4);
//   mips32.run();
//   t.equal(mips32.runner.printPointerBytes(32, 2048)[0], 55, 'returns true');
//   t.equal(mips32.runner.getStackPointer(), 2048, 'returns true');
//   t.end();
// });

// test('Code translation v15', (t) => {
//   const program = new Program(`
//     int fibbo(int n) {
//       if(n < 2) {
//         return 1;
//       }

//       return fibbo(n - 1) + fibbo(n - 2); 
//     }

//     void main() {
//       *(2048) = fibbo(5);
//     }
//   `, [], false)
//   let chomp = program.chomp();
//   t.equal(chomp.isInvalid(), false, 'returns');
//   let programCompiler = new Compiler(null);
//   let asmBlock = programCompiler.compileProgram(chomp);
//   const mips32 = new Mips32(asmBlock, 1024 * 2, 1024 * 4);
//   mips32.run();
//   t.equal(mips32.runner.printPointerBytes(32, 2048)[0], 8, 'returns true');
//   t.equal(mips32.runner.getStackPointer(), 2048, 'returns true');
//   t.end();
// });

// test('Code translation v16', (t) => {
//   const program = new Program(`
//     int fibbo(int n) {
//       if(n < 2) {
//         return 1;
//       }

//       return fibbo(n - 1) + fibbo(n - 2); 
//     }

//     void main() {
//       *(2048) = fibbo(10);
//     }
//   `, [], false)
//   let chomp = program.chomp();
//   t.equal(chomp.isInvalid(), false, 'returns');
//   let programCompiler = new Compiler(null);
//   let asmBlock = programCompiler.compileProgram(chomp);

//   const mips32 = new Mips32(asmBlock, 1024 * 2, 1024 * 4);
//   mips32.run();
//   t.equal(mips32.runner.printPointerBytes(32, 2048)[0], 89, 'returns true');
//   t.equal(mips32.runner.getStackPointer(), 2048, 'returns true');
//   t.end();
// });

// test('Code translation v17', (t) => {
//   const program = new Program(`
//     int factorial(int n) {
//       if(n < 2) {
//         return 1;
//       }

//       return factorial(n - 1) * n; 
//     }

//     void main() {
//       *(2048) = factorial(4);
//     }
//   `, [], false)
//   let chomp = program.chomp();
//   t.equal(chomp.isInvalid(), false, 'returns');
//   let programCompiler = new Compiler(null);
//   let asmBlock = programCompiler.compileProgram(chomp);
//   const mips32 = new Mips32(asmBlock, 1024 * 2, 1024 * 4);
//   mips32.run();
//   t.equal(mips32.runner.printPointerBytes(32, 2048)[0], 24, 'returns true');
//   t.equal(mips32.runner.getStackPointer(), 2048, 'returns true');
//   t.end();
// });

// test('Code translation v18', (t) => {
//   const program = new Program(`
//     int factorial(int n) {
//       if(n < 2) {
//         return 1;
//       }

//       return factorial(n - 1) * n; 
//     }

//     void main() {
//       *(2048) = factorial(5);
//     }
//   `, [], false)
//   let chomp = program.chomp();
//   t.equal(chomp.isInvalid(), false, 'returns');
//   let programCompiler = new Compiler(null);
//   let asmBlock = programCompiler.compileProgram(chomp);

//   const mips32 = new Mips32(asmBlock, 1024 * 2, 1024 * 4);
//   mips32.run();
//   t.equal(mips32.runner.printPointerBytes(32, 2048)[0], 120, 'returns true');
//   t.equal(mips32.runner.getStackPointer(), 2048, 'returns true');
//   t.end();
// });

// test('Code translation v18', (t) => {
//   const program = new Program(`
//     void main() {
//       *(50 + 50 + 50) = 143;
//     }
//   `)
//   let chomp = program.chomp();
//   t.equal(chomp.isInvalid(), false, 'returns');
//   let programCompiler = new Compiler(null);
//   let asmBlock = programCompiler.compileProgram(chomp);

//   const mips32 = new Mips32(asmBlock, 2 ** 16, 1024 * 2);
//   mips32.run();
//   t.equal(mips32.runner.printPointerBytes(32, 150)[0], 143, 'returns true');
//   t.equal(mips32.runner.getStackPointer(), 2 ** 16, 'returns true');
//   t.end();
// });

// test('Code translation v19', (t) => {
//   const program = new Program(`
//     void main() {
//       int a = 105;
//       int b = a / 5;
//       int c = a % 10;
//       *(2048) = b;
//       *(2052) = c;
//     }
//   `, [], false)
//   let chomp = program.chomp();
//   t.equal(chomp.isInvalid(), false, 'returns');
//   let programCompiler = new Compiler(null);
//   let asmBlock = programCompiler.compileProgram(chomp);

//   const mips32 = new Mips32(asmBlock, 2 ** 16, 1024 * 6);
//   mips32.run();
//   t.equal(mips32.runner.printPointerBytes(32, 2048)[0], 21, 'returns true');
//   t.equal(mips32.runner.printPointerBytes(32, 2052)[0], 5, 'returns true');
//   t.equal(mips32.runner.getStackPointer(), 2 ** 16, 'returns true');
//   t.end();
// });

// test('Code translation v19', (t) => {
//   const program = new Program(`
//     void main() {
//       int a = 1257;
//       printNumber(a);
//     }
//   `)
//   let chomp = program.chomp();
//   t.equal(chomp.isInvalid(), false, 'returns');
//   let programCompiler = new Compiler(null);
//   let asmBlock = programCompiler.compileProgram(chomp);

//   const mips32 = new Mips32(asmBlock, 2 ** 16, 1024 * 6);
//   mips32.run();
//   t.equal(mips32.runner.getRawStdoutBuffer(), '1257', 'returns true');
//   t.equal(mips32.runner.getStackPointer(), 2 ** 16, 'returns true');
//   t.end();
// });

// test('Code translation v20', (t) => {
//   const program = new Program(`
//     void main() {
//       int a = 224556;
//       printNumber(a);
//     }
//   `)
//   let chomp = program.chomp();
//   t.equal(chomp.isInvalid(), false, 'returns');
//   let programCompiler = new Compiler(null);
//   let asmBlock = programCompiler.compileProgram(chomp);

//   const mips32 = new Mips32(asmBlock, 2 ** 16, 1024 * 6);
//   mips32.run();
//   t.equal(mips32.runner.getRawStdoutBuffer(), '224556', 'returns true');
//   t.equal(mips32.runner.getStackPointer(), 2 ** 16, 'returns true');
//   t.end();
// });

// test('Code translation v21', (t) => {
//   const program = new Program(`
//     int fibbo(int n) {
//       if(n < 2) {
//         return 1;
//       }

//       return fibbo(n - 1) + fibbo(n - 2); 
//     }

//     void main() {
//       printNumber(fibbo(5));
//     }
//   `)
//   let chomp = program.chomp();
//   t.equal(chomp.isInvalid(), false, 'returns');
//   let programCompiler = new Compiler(null);
//   let asmBlock = programCompiler.compileProgram(chomp);

//   const mips32 = new Mips32(asmBlock, 2 ** 16, 1024 * 6);
//   mips32.run();
//   t.equal(mips32.runner.getRawStdoutBuffer(), '8', 'returns true');
//   t.equal(mips32.runner.getStackPointer(), 2 ** 16, 'returns true');
//   t.end();
// });

// test('Code translation v21', (t) => {
//   const program = new Program(`
//     int fibbo(int n) {
//       if(n < 2) {
//         return 1;
//       }

//       return fibbo(n - 1) + fibbo(n - 2); 
//     }

//     void main() {
//       printNumber(fibbo(5 + 5));
//     }
//   `)
//   let chomp = program.chomp();
//   t.equal(chomp.isInvalid(), false, 'returns');
//   let programCompiler = new Compiler(null);
//   let asmBlock = programCompiler.compileProgram(chomp);
//   const mips32 = new Mips32(asmBlock, 2 ** 16, 1024 * 6);
//   mips32.run();
//   t.equal(mips32.runner.getRawStdoutBuffer(), '89', 'returns true');
//   t.equal(mips32.runner.getStackPointer(), 2 ** 16, 'returns true');
//   t.end();
// });

// test('Code translation v22', (t) => {
//   const program = new Program(`
//     int permutations(int n, int k, int total, int checker) {
//       if(k >= n) {
//         *total = *total + 1;
//         return 0;
//       }

//       for(int i = 1; i <= n; i = i + 1) {
//         if(getElement(checker, i) == 0) {
//           setElement(checker, i, 1);
//           permutations(n, k + 1, total, checker);
//           setElement(checker, i, 0);
//         }
//       }

//       return 0;
//     }

//     void main() {
//       int n = 5, total = 4100, checker = 3000;
//       permutations(n, 0, total, checker);
//       printNumber(*total);
//     }
//   `)
//   let chomp = program.chomp();
//   t.equal(chomp.isInvalid(), false, 'returns');
//   let programCompiler = new Compiler(null);
//   let asmBlock = programCompiler.compileProgram(chomp);

//   const mips32 = new Mips32(asmBlock, 2 ** 16, 1024 * 6);
//   mips32.run();
//   t.equal(mips32.runner.getRawStdoutBuffer(), '120', 'returns true');
//   t.equal(mips32.runner.getStackPointer(), 2 ** 16, 'returns true');
//   t.end();
// });

// test('Code translation v23', (t) => {
//   const program = new Program(`
//     int permutations(int n, int k, int total, int checker) {
//       if(k >= n) {
//         *total = *total + 1;
//         return 0;
//       }

//       for(int i = 1; i <= n; i = i + 1) {
//         if(getElement(checker, i) == 0) {
//           setElement(checker, i, 1);
//           permutations(n, k + 1, total, checker);
//           setElement(checker, i, 0);
//         }
//       }

//       return 0;
//     }

//     void main() {
//       int n = 8, total = 4100, checker = 3000;
//       permutations(n, 0, total, checker);
//       printNumber(*total);
//     }
//   `)
//   let chomp = program.chomp();
//   t.equal(chomp.isInvalid(), false, 'returns');
//   let programCompiler = new Compiler(null);
//   let asmBlock = programCompiler.compileProgram(chomp);

//   const mips32 = new Mips32(asmBlock, 2 ** 16, 1024 * 6);
//   mips32.run();
//   t.equal(mips32.runner.getRawStdoutBuffer(), '40320', 'returns true');
//   t.equal(mips32.runner.getStackPointer(), 2 ** 16, 'returns true');
//   t.end();
// });

// test('Code translation v24', (t) => {
//   const program = new Program(`
//     int permutations(int n, int k, int total, int checker) {
//       if(k >= n) {
//         *total = *total + 1;
//         return 0;
//       }

//       for(int i = 1; i <= n; i = i + 1) {
//         if(getElement(checker, i) == 0) {
//           setElement(checker, i, 1);
//           permutations(n, k + 1, total, checker);
//           setElement(checker, i, 0);
//         }
//       }

//       return 0;
//     }

//     void main() {
//       int n = 7, total = 4100, checker = 3000;
//       permutations(n, 0, total, checker);
//       printNumber(*total);
//     }
//   `)
//   let chomp = program.chomp();
//   t.equal(chomp.isInvalid(), false, 'returns');
//   let programCompiler = new Compiler(null);
//   let asmBlock = programCompiler.compileProgram(chomp);

//   const mips32 = new Mips32(asmBlock, 2 ** 16, 1024 * 512);
//   mips32.run();
//   t.equal(mips32.runner.getRawStdoutBuffer(), '5040', 'returns true');
//   t.equal(mips32.runner.getStackPointer(), 2 ** 16, 'returns true');
//   t.end();
// });

// test('Code translation v25', (t) => {
//   const program = new Program(`
//     int permutations(int n, int k, int displayBuffer, int checker) {
//       if(k >= n) {
//         for(int i = 0; i < n; i = i + 1) {
//           printNumber(getElement(displayBuffer, i));
//           printChar(32);
//         }
//         printChar(10);
//         return 0;
//       }

//       for(int i = 1; i <= n; i = i + 1) {
//         if(getElement(checker, i) == 0) {
//           setElement(checker, i, 1);
//           setElement(displayBuffer, k, i);
//           permutations(n, k + 1, displayBuffer, checker);
//           setElement(checker, i, 0);
//         }
//       }

//       return 0;
//     }

//     void main() {
//       int buffer = 1050, n = 3, checker = 2000;
//       int responseBuffer = 504;
//       permutations(n, 0, responseBuffer, checker);
//     }
//   `)
//   let chomp = program.chomp();
//   t.equal(chomp.isInvalid(), false, 'returns');
//   let programCompiler = new Compiler(null);
//   let asmBlock = programCompiler.compileProgram(chomp);

//   const mips32 = new Mips32(asmBlock, 2 ** 16, 1024 * 512);
//   mips32.run();
//   t.equal(mips32.runner.getRawStdoutBuffer(), '1 2 3 \n1 3 2 \n2 1 3 \n2 3 1 \n3 1 2 \n3 2 1 \n', 'returns true');
//   t.equal(mips32.runner.getStackPointer(), 2 ** 16, 'returns true');
//   t.end();
// });

// test('Code translation v26', (t) => {
//   const program = new Program(`
//     int getElementInMatrix(int board, int i, int j, int n) {
//       return getElement(board, i * n + j);
//     }

//     int setElementInMatrix(int board, int i, int j, int n, int element) {
//       return setElement(board, i * n + j, element);
//     }

//     int getLineResult(int board, int line, int n) {
//       int firstElement = getElementInMatrix(board, line, 0, n);
//       if(firstElement == getElementInMatrix(board, line, 1, n) && 
//         firstElement == getElementInMatrix(board, line, 2, n)) {
//         return firstElement;
//       }

//       return 0;
//     }

//     int getColumnResult(int board, int column, int n) {
//       int firstElement = getElementInMatrix(board, 0, column, n);
//       if(firstElement == getElementInMatrix(board, 1, column, n) && 
//         firstElement == getElementInMatrix(board, 2, column, n)) {
//         return firstElement;
//       }

//       return 0;
//     }

//     int getLinesResponse(int board, int n) {
//       for(int i = 0; i < 3; i = i + 1) {
//         int lineResult = getLineResult(board, i, n);
//         if(lineResult) {
//           return lineResult;
//         }
//       }

//       return 0;
//     }

//     int getColumnResponse(int board, int n) {
//       for(int i = 0; i < 3; i = i + 1) {
//         int columnResult = getColumnResult(board, i, n);
//         if(columnResult) {
//           return columnResult;
//         }
//       }

//       return 0;
//     }

//     int diag(int board, int n) {
//       int firstElement = getElementInMatrix(board, 0, 0, n);
//       if(firstElement == getElementInMatrix(board, 1, 1, n) &&
//         firstElement == getElementInMatrix(board, 2, 2, n)) {
//           return firstElement;
//       }

//       firstElement = getElementInMatrix(board, 0, 2, n);
//       if(firstElement == getElementInMatrix(board, 1, 1, n) &&
//         firstElement == getElementInMatrix(board, 2, 0, n)) {
//         return firstElement;
//       }

//       return 0;
//     }

//     int isDraw(int board) {
//       for(int i = 0; i < 3; i = i + 1) {
//         for(int j = 0; j < 3; j = j + 1) {
//           if(getElementInMatrix(board, i, j, 3) == 0) {
//             return 0;
//           }
//         }
//       }

//       return 1;
//     }

//     int resultMethod(int board, int n) {
//       int columnResult = getColumnResponse(board, n);
//       if(columnResult) {
//         return columnResult;
//       }
//       int rowResult = getLinesResponse(board, n);
//       if(rowResult) {
//         return rowResult;
//       }
//       int diagLines = diag(board, n);
//       if(diagLines) {
//         return diagLines;
//       }
//       int drawValues = isDraw(board);
//       if(drawValues) {
//         return 3;
//       }
//       return 0;
//     }

//     int aiMove(int board, int move, int n, int bestX, int bestY, int depth, int total) {
//       int result = resultMethod(board, n);
//       if(result == move) {
//         return 50;
//       }
//       if(result == 3 - move) {
//         return 0 - 50;
//       }
//       if(result == 3) {
//         return 20;
//       }

//       int globalMax = 0 - 100;
//       for(int i = 0; i < 3; i = i + 1) {
//         for(int j = 0; j < 3; j = j + 1) {
//           if(getElementInMatrix(board, i, j, n) == 0) {
//             setElementInMatrix(board, i, j, 3, move);
//             *total = *total + 1;
//             int currentMax = 0 - aiMove(board, 3 - move, n, bestX, bestY, depth + 1, total);
//             if(currentMax == 20 || currentMax == 0 - 20) {
//               currentMax = 20;
//             }
//             setElementInMatrix(board, i, j, 3, 0);

//             if(currentMax > globalMax) {
//               globalMax = currentMax;
//               if(depth == 0) {
//                 *bestX = j;
//                 *bestY = i;
//               }
//             }
//           }
//         }
//       }

//       return globalMax;
//     }

//     void main() {
//       int board = 3000, bestX = 5000, bestY = 5200, total = 5304;
//       setElementInMatrix(board, 0, 0, 3, 1);
//       printNumber(aiMove(board, 2, 3, bestX, bestY, 0, total));
//       printChar(32);
//       printNumber(*bestX);
//       printChar(32);
//       printNumber(*bestY);
//       printChar(32);
//       printNumber(*total);
//     }
//   `)
//   let chomp = program.chomp();
//   t.equal(chomp.isInvalid(), false, 'returns');
//   let programCompiler = new Compiler(null);
//   let asmBlock = programCompiler.compileProgram(chomp);

//   const mips32 = new Mips32(asmBlock, 2 ** 16, 1024 * 512);
//   mips32.run();
//   t.equal(mips32.runner.getRawStdoutBuffer(), '20 1 1 59704', 'returns true');
//   t.equal(mips32.runner.getStackPointer(), 2 ** 16, 'returns true');
//   t.end();
// });

// test('Code translation v28', (t) => {
//   const program = new Program(`
//     void main() {
//       int a = (3 && 7);
//       *(2048) = a;
//     }
//   `, [], false)
//   let chomp = program.chomp();
//   t.equal(chomp.isInvalid(), false, 'returns');
//   let programCompiler = new Compiler(null);
//   let asmBlock = programCompiler.compileProgram(chomp);
//   const mips32 = new Mips32(asmBlock, 1024 * 2, 1024 * 4);
//   mips32.run();
//   t.equal(mips32.runner.printPointerBytes(32, 2048)[0], 1, 'returns true');
//   t.equal(mips32.runner.getStackPointer(), 2048, 'returns true');
//   t.end();
// });

// test('Code translation v29', (t) => {
//   const program = new Program(`
//     void main() {
//       int a = (0 && 7);
//       *(2048) = a;
//     }
//   `, [], false)
//   let chomp = program.chomp();
//   t.equal(chomp.isInvalid(), false, 'returns');
//   let programCompiler = new Compiler(null);
//   let asmBlock = programCompiler.compileProgram(chomp);
//   const mips32 = new Mips32(asmBlock, 1024 * 2, 1024 * 4);
//   mips32.run();
//   t.equal(mips32.runner.printPointerBytes(32, 2048)[0], 0, 'returns true');
//   t.equal(mips32.runner.getStackPointer(), 2048, 'returns true');
//   t.end();
// });

// test('Code translation v30', (t) => {
//   const program = new Program(`
//     void main() {
//       int a = (0 || 7);
//       *(2048) = a;
//     }
//   `, [], false)
//   let chomp = program.chomp();
//   t.equal(chomp.isInvalid(), false, 'returns');
//   let programCompiler = new Compiler(null);
//   let asmBlock = programCompiler.compileProgram(chomp);
//   const mips32 = new Mips32(asmBlock, 1024 * 2, 1024 * 4);
//   mips32.run();
//   t.equal(mips32.runner.printPointerBytes(32, 2048)[0], 1, 'returns true');
//   t.equal(mips32.runner.getStackPointer(), 2048, 'returns true');
//   t.end();
// });

// test('Code translation v31', (t) => {
//   const program = new Program(`
//     void main() {
//       int a = (0 || 0);
//       *(2048) = a;
//     }
//   `, [], false)
//   let chomp = program.chomp();
//   t.equal(chomp.isInvalid(), false, 'returns');
//   let programCompiler = new Compiler(null);
//   let asmBlock = programCompiler.compileProgram(chomp);
//   const mips32 = new Mips32(asmBlock, 1024 * 2, 1024 * 4);
//   mips32.run();
//   t.equal(mips32.runner.printPointerBytes(32, 2048)[0], 0, 'returns true');
//   t.equal(mips32.runner.getStackPointer(), 2048, 'returns true');
//   t.end();
// });

// test('Code translation v32', (t) => {
//   const program = new Program(`
//     void main() {
//       int a = ((0 - 3) && 5);
//       *(2048) = a;
//     }
//   `, [], false)
//   let chomp = program.chomp();
//   t.equal(chomp.isInvalid(), false, 'returns');
//   let programCompiler = new Compiler(null);
//   let asmBlock = programCompiler.compileProgram(chomp);
//   const mips32 = new Mips32(asmBlock, 1024 * 2, 1024 * 4);
//   mips32.run();
//   t.equal(mips32.runner.printPointerBytes(32, 2048)[0], 1, 'returns true');
//   t.equal(mips32.runner.getStackPointer(), 2048, 'returns true');
//   t.end();
// });

// test('Code translation v33', (t) => {
//   const program = new Program(`
//     void main() {
//       int a = ((0 - 3) && 0);
//       *(2048) = a;
//     }
//   `, [], false)
//   let chomp = program.chomp();
//   t.equal(chomp.isInvalid(), false, 'returns');
//   let programCompiler = new Compiler(null);
//   let asmBlock = programCompiler.compileProgram(chomp);
//   const mips32 = new Mips32(asmBlock, 1024 * 2, 1024 * 4);
//   mips32.run();
//   t.equal(mips32.runner.printPointerBytes(32, 2048)[0], 0, 'returns true');
//   t.equal(mips32.runner.getStackPointer(), 2048, 'returns true');
//   t.end();
// });

// test('Code translation v34', (t) => {
//   const program = new Program(`
//     void main() {
//       int a = ((0 - 3) || 0);
//       *(2048) = a;
//     }
//   `, [], false)
//   let chomp = program.chomp();
//   t.equal(chomp.isInvalid(), false, 'returns');
//   let programCompiler = new Compiler(null);
//   let asmBlock = programCompiler.compileProgram(chomp);
//   const mips32 = new Mips32(asmBlock, 1024 * 2, 1024 * 4);
//   mips32.run();
//   t.equal(mips32.runner.printPointerBytes(32, 2048)[0], 1, 'returns true');
//   t.equal(mips32.runner.getStackPointer(), 2048, 'returns true');
//   t.end();
// });

// test('Code translation v34', (t) => {
//   const program = new Program(`
//     void main() {
//       int a = ((3 - 3) || 0);
//       *(2048) = a;
//     }
//   `, [], false)
//   let chomp = program.chomp();
//   t.equal(chomp.isInvalid(), false, 'returns');
//   let programCompiler = new Compiler(null);
//   let asmBlock = programCompiler.compileProgram(chomp);
//   const mips32 = new Mips32(asmBlock, 1024 * 2, 1024 * 4);
//   mips32.run();
//   t.equal(mips32.runner.printPointerBytes(32, 2048)[0], 0, 'returns true');
//   t.equal(mips32.runner.getStackPointer(), 2048, 'returns true');
//   t.end();
// });

// test('Code translation v35', (t) => {
//   const program = new Program(`
//     void main() {
//       int a = (5 == 6);
//       *(2048) = a;
//     }
//   `, [], false)
//   let chomp = program.chomp();
//   t.equal(chomp.isInvalid(), false, 'returns');
//   let programCompiler = new Compiler(null);
//   let asmBlock = programCompiler.compileProgram(chomp);
//   const mips32 = new Mips32(asmBlock, 1024 * 2, 1024 * 4);
//   mips32.run();
//   t.equal(mips32.runner.printPointerBytes(32, 2048)[0], 0, 'returns true');
//   t.equal(mips32.runner.getStackPointer(), 2048, 'returns true');
//   t.end();
// });

// test('Code translation v36', (t) => {
//   const program = new Program(`
//     void main() {
//       int a = (6 == 6);
//       *(2048) = a;
//     }
//   `, [], false)
//   let chomp = program.chomp();
//   t.equal(chomp.isInvalid(), false, 'returns');
//   let programCompiler = new Compiler(null);
//   let asmBlock = programCompiler.compileProgram(chomp);
//   const mips32 = new Mips32(asmBlock, 1024 * 2, 1024 * 4);
//   mips32.run();
//   t.equal(mips32.runner.printPointerBytes(32, 2048)[0], 1, 'returns true');
//   t.equal(mips32.runner.getStackPointer(), 2048, 'returns true');
//   t.end();
// });

// test('Code translation v37', (t) => {
//   const program = new Program(`
//     void main() {
//       int a = (6 != 6);
//       *(2048) = a;
//     }
//   `, [], false)
//   let chomp = program.chomp();
//   t.equal(chomp.isInvalid(), false, 'returns');
//   let programCompiler = new Compiler(null);
//   let asmBlock = programCompiler.compileProgram(chomp);
//   const mips32 = new Mips32(asmBlock, 1024 * 2, 1024 * 4);
//   mips32.run();
//   t.equal(mips32.runner.printPointerBytes(32, 2048)[0], 0, 'returns true');
//   t.equal(mips32.runner.getStackPointer(), 2048, 'returns true');
//   t.end();
// });

// test('Code translation v38', (t) => {
//   const program = new Program(`
//     void main() {
//       int a = (6 != 7);
//       *(2048) = a;
//     }
//   `, [], false)
//   let chomp = program.chomp();
//   t.equal(chomp.isInvalid(), false, 'returns');
//   let programCompiler = new Compiler(null);
//   let asmBlock = programCompiler.compileProgram(chomp);
//   const mips32 = new Mips32(asmBlock, 1024 * 2, 1024 * 4);
//   mips32.run();
//   t.equal(mips32.runner.printPointerBytes(32, 2048)[0], 1, 'returns true');
//   t.equal(mips32.runner.getStackPointer(), 2048, 'returns true');
//   t.end();
// });

test('Code translation v39', (t) => {
  const program = new Program(`
    void main() {
      int a = 150000;
      *(2048) = a;
    }
  `, [], false)
  let chomp = program.chomp();
  t.equal(chomp.isInvalid(), false, 'returns');
  let programCompiler = new Compiler(null);
  let asmBlock = programCompiler.compileProgram(chomp);
  const mips32 = new Mips32(asmBlock, 1024 * 2, 1024 * 4);
  mips32.run();
  console.log(mips32.toString())
  t.equal(mips32.runner.printPointerBytes(32, 2048)[0], 240, 'returns true');
  t.equal(mips32.runner.printPointerBytes(32, 2048)[1], 73, 'returns true');
  t.equal(mips32.runner.printPointerBytes(32, 2048)[2], 2, 'returns true');
  t.equal(mips32.runner.printPointerBytes(32, 2048)[3], 0, 'returns true');
  // t.equal(mips32.runner.getStackPointer(), 2048, 'returns true');
  t.end();
});