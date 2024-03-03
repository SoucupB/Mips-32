import { Program } from "../AST/Program.js";
import { Compiler } from "./Compiler.js";
import { Mips32 } from "./Mips32.js";

export class Mips32Compiler {
  constructor(code, stdout = 256, stackPointer = 512 * 1024, memorySize = 1024 * 1024, registerData = {
    zeroReg: 31,
    stackPointerRegister: 30,
    stddoutRegister: 29,
    freeRegister: 28,
    hi: 27,
    lo: 26,
    testRegister: 25,
    rsp: 24,
    ret: 23,
    bitSplitterRegister: 22,
  }) {
    this.code = code;
    this.stdout = stdout;
    this.stackPointer = stackPointer;
    this.memorySize = memorySize;
    this.registerData = registerData;

    this.mips32Instructions = null;
    this.intermediaryASMInsturctions = null;
  }

  compile() {
    let errors = []
    const program = new Program(this.code, errors, true, this.stdout);
    if(!program.compilationError()) {
      throw new Error(`Errors: ${program.errorsToString()}`);
    }
    let chomp = program.chomp();
    if(chomp.isInvalid()) {
      return false;
    }
    let programCompiler = new Compiler(null);
    this.intermediaryASMInsturctions = programCompiler.compileProgram(chomp);
    this.mips32Instructions = new Mips32(this.intermediaryASMInsturctions, this.stdout,
                                         this.stackPointer, true, this.registerData, this.memorySize);
    return true;
  }

  mips32Code() {
    return this.mips32Instructions;
  }

  stdoutBuffer() {
    return this.mips32Instructions.runner.getRawStdoutBuffer();
  }

  run() {
    if(this.mips32Instructions) {
      this.mips32Instructions.run();
      return true;
    }

    return false;
  }
}