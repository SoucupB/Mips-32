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
  memorySize: 1024 * 1024 * 4 // The memory of the process that runs the program.
})

mipsCompiler.compile();
mipsCompiler.run();

console.log(mipsCompiler.stdoutBuffer()); // This will print 15
```





