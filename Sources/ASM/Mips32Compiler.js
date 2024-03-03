import { Program } from "../AST/Program.js";
import { Compiler } from "./Compiler.js";
import { Mips32 } from "./Mips32.js";

export class Mips32Compiler {
  constructor(code, stdout = 256, stackPointer = 512, memorySize = 1024) {
    this.code = code;
    this.stdout = stdout;
    this.stackPointer = stackPointer;
    this.memorySize = memorySize;

    this.mips32Instructions = null;
    this.intermediaryASMInsturctions = null;
  }

  compile() {
    const program = new Program()
    let chomp = program.chomp();
    if(chomp.isInvalid()) {
      return false;
    }
    let programCompiler = new Compiler(null);
    this.intermediaryASMInsturctions = programCompiler.compileProgram(chomp);
    this.mips32Instructions = new Mips32(this.intermediaryASMInsturctions, this.stdout, this.stackPointer);
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
  }
}