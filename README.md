# Mips compiler

## Description
This repository constitutes a Pseudo C language compiler to a valid mips32 code with 32 general purpose registers.
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

### Hello world
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
mipsCompiler.run(); // This runs the mips32 instructions in order

console.log(mipsCompiler.stdoutBuffer()); // This will print "Hello World"
```

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
mipsCompiler.run(); // This runs the mips32 instructions in order

console.log(mipsCompiler.stdoutBuffer()); // This will print 15
```

### Recursive fibbonaci.
```js
let mipsCompiler = new Mips32Compiler(`
  int fibboRecursive(int n) {
    if ( n < 2 ) {
      return 1;
    }
    return fibboRecursive ( n - 1 ) + fibboRecursive ( n - 2 );
  }
  void main() {
    printNumber(fibboRecursive(8));
  }
`, {
  stdout: 1024 * 512,
  stackPointer: 1024 * 1024,
  memorySize: 1024 * 1024 * 4
})

mipsCompiler.compile();
mipsCompiler.run(); // This runs the mips32 instructions in order

console.log(mipsCompiler.stdoutBuffer()); // This will print 34
```

### Print first 10 digits
```js
let mipsCompiler = new Mips32Compiler(`
  void main() {
    for(int i = 0; i < 10; i = i + 1) {
      printNumber(i);
      printChar(32);
    }
  }
`, {
  stdout: 1024 * 512,
  stackPointer: 1024 * 1024,
  memorySize: 1024 * 1024 * 4
})

mipsCompiler.compile();
mipsCompiler.run();

console.log(mipsCompiler.stdoutBuffer()); // This will print 0 1 2 3 4 5 6 7 8 9 
```

### Arrays
```js
let mipsCompiler = new Mips32Compiler(`
  void main() {
    int array = 1024;
    for(int i = 0; i < 10; i = i + 1) {
      *(array + i * 4) = i;
    }
    for(int i = 0; i < 10; i = i + 1) {
      printNumber(*(array + i * 4));
      printChar(32);
    }
  }
`, {
  stdout: 1024 * 512,
  stackPointer: 1024 * 1024,
  memorySize: 1024 * 1024 * 4
})

mipsCompiler.compile();
mipsCompiler.run();

console.log(mipsCompiler.stdoutBuffer()); // This will print 0 1 2 3 4 5 6 7 8 9 
```

## Instructions
In order to print the mips32 instructions code we can use the method.
```js
mipsCompiler.mips32Code().toString(true)
```
### Example
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
19: SUB $28 $30 $28 // Set stack pointer for variable 'a' in register 28
20: LW $1 0($28) // Loads the (5*3) result into $1 register from [stack_pointer - 4] position.
21: ADD $2 $0 $1 // adds the result and stores it into $2 register.
22: ADDI $28 $31 4
23: SUB $30 $30 $28 // pops the stack from the main method.
```
There is also a config for some of the registers which hold stuff such as stack pointer, high, low (for mult and div) and other such stuff
```
{
  zeroReg: 31, // The register which holds value 0.
  stackPointerRegister: 30, // The register which holds the stack pointer
  stddoutRegister: 29, // Deprecated register.
  freeRegister: 28, // General purpose register used for operations substitutions.
  hi: 27, 
  lo: 26,
  testRegister: 25,
  rsp: 24, // The register which holds the return value after a function call.
  ret: 23, // The register which holds the address where the pc should go after the method yields.
  bitSplitterRegister: 22, // A register used for splitting immediates which are higher then 16 bits.
}
```
## What it can do
- Compilation messages in case of errors (although quite limited in what they offer).
- Methods usage.
- Expressions definitions.
- Initializations.
- Assignations.
- Code blocks.
- General pointers access. (Full access to the entire memory).
- Loops.


## Limitations and problems.
- The compiler processes only 4 bytes signed integers. 
- There are no definitions for stack pointers (int a[100]), a[1]=.... but there is general access to the memory of the program
through pointers.
  ```c
  int a = 5000;
  *a = 150;
  ```
- No direct negative numbers definitions.
  ```c
  // is not allowed.
  int c = -5;
  ```
  ```c
  // is allowed.
  int c = 0 - 5;
  ```
- Even if the asm is mips32, in order to be translated to valid binaries, the amount of generated instructions should be less then 64kb (j jumps support 24 bits address jump but BEQ $a $b label supports only 16 bits offset jump and the compiler does not split the a 32 bits label into 16 bits numbers).
- Assignations are not threated as expressions so things like `a = b = c;` is not considered as valid code.
- No comments.
- No instructions assignations such as `a++, a += 2, etc...`;
- Might suffer some weird compilation error problems due to bugs.

## Notes
The compiler might not be complete and lacks things that C language already have, however it might be a good way to be used for simple MIPS32.






