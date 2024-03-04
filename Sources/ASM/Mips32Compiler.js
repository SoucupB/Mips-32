import { Program } from "../AST/Program.js";
import { Compiler } from "./Compiler.js";
import { Mips32 } from "./Mips32.js";

export class Mips32Compiler {
  constructor(code, config = {}) {
    this.code = code;
    this.config = {};
    this.defaultConfig();
    this.setNewConfig(config);

    this.mips32Instructions = null;
    this.intermediaryASMInsturctions = null;
  }

  setNewConfig(config) {
    for(const [key, value] of Object.entries(config)) {
      if(key in this.config) {
        this.config[key] = value;
      }
    }
  }

  defaultConfig() {
    this.config.registerData = {
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
    };
    this.config.stdout = 256;
    this.config.stackPointer = 512 * 1024;
    this.config.memorySize = 1024 * 1024;
  }

  compile() {
    let errors = []
    const program = new Program(this.code, errors, true, this.config.stdout);
    let chomp = program.chomp();
    if(chomp.isInvalid()) {
      throw new Error(`Errors: ${program.errorsToString()}`);
    }
    let programCompiler = new Compiler(null);
    this.intermediaryASMInsturctions = programCompiler.compileProgram(chomp);
    this.mips32Instructions = new Mips32(this.intermediaryASMInsturctions, this.config.stdout,
                                         this.config.stackPointer, true, this.config.registerData, this.config.memorySize);
    return true;
  }

  mips32Code() {
    return this.mips32Instructions;
  }

  intermediaryAsm() {
    return this.intermediaryASMInsturctions;
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