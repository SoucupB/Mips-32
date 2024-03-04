# Mips compiler

## Description
This repository constitutes a Pseudo C language compiler to a valid mips32 code
The generated mips32 code according to this [Cheat sheet](https://uweb.engr.arizona.edu/~ece369/Resources/spim/MIPSReference.pdf) 
with several differences.
| Instruction | Operation |
|-----------------|-------------------|
| J address       | pc = address      |
| NOOP            | None              |


The input string undergoes several transformations before being compiled into Mips32 instructions.
![image](https://github.com/SoucupB/Mips-32/assets/49458226/c476acb9-29f5-4092-bc4b-6f6c97223bd2).

First, the C code is passed through the AST(Abstract syntax tree) compiler which splits the code into
tokens, then it is assembled into an intermediary ASM instruction set which resembles x86 instruction
set with some differences, and at the end is, again translated into mips32 code.

## Examples

Sum of 2 numbers.
```js
let mipsCompiler = new Mips32Compiler(`
  void main() {
    int a = 5;
    int b = 10;
    printNumber(a + b);
  }
`, {
  stdout: 1024 * 512, // The pointer from where "mipsCompiler.stdoutBuffer()" will transform the data into a string.
  stackPointer: 1024 * 1024, // The stack pointer for when the program will start to run.
  memorySize: 1024 * 1024 * 4 // The memory of the process that runs the program in bytes.
})

mipsCompiler.compile();
mipsCompiler.run();

console.log(mipsCompiler.stdoutBuffer()); // This will print 15
```

Hello world

For this one, we should print all characters one after another.
```js
let mipsCompiler = new Mips32Compiler(`
  void main() {
    printChar(72);printChar(101);
    printChar(108);printChar(108);
    printChar(111);printChar(32);
    printChar(87);printChar(111);
    printChar(114);printChar(108);
    printChar(100);
  }
`, {
  stdout: 1024 * 512,
  stackPointer: 1024 * 1024,
  memorySize: 1024 * 1024 * 4
})

mipsCompiler.compile();
mipsCompiler.run();

console.log(mipsCompiler.stdoutBuffer()); // This will print "Hello World"
```

## Instructions
In order to print the mips32 instructions code we can use the method.
```js
mipsCompiler.mips32Code().toString(true)
```
Example
```js
let mipsCompiler = new Mips32Compiler(`
  void main() {
    int a = 5+2*3;
  }
`, {
  stdout: 1024 * 512,
  stackPointer: 1024 * 1024,
  memorySize: 1024 * 1024 * 4
});
mipsCompiler.compile();
console.log(mipsCompiler.mips32Code().toString(true));
```
Will show this (without the comments).
```
// header part
0: OR $31 $31 $31 // zero register.
1: ADDI $22 $31 0 // split the 1024 * 1024 number into two 16 bits number in order to store it into a register.
2: ADDI $30 $31 16
3: SLL $30 $30 16
4: OR $30 $30 $22
5: ADDI $22 $31 0
6: ADDI $29 $31 8
7: SLL $29 $29 16
8: OR $29 $29 $22
// Header part
9: J 10
10: NOOP // Main method
11: ADDI $0 $31 2
12: ADDI $1 $31 3
13: MULT $0 $1
14: ADDI $2 $26 0 // store LO part register in $2
15: SW $2 0($30) // Adds the result to the stack
16: ADDI $30 $30 4 // Increase the stack pointer with 4
17: ADDI $0 $31 5 // Store 5 into 0 register.
18: ADDI $28 $31 4 
19: SUB $28 $30 $28 // pop the stack with 4 bytes.
20: LW $1 0($28) // Loads the (5*3) result into $1 register from [stack_pointer - 8] position.
21: ADD $2 $0 $1 // adds the result and stores it into $2 register.
22: ADDI $28 $31 4
23: SUB $30 $30 $28
```








