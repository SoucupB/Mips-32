import { ASMProgram } from "../ASM/ASMProgram.js";
import { Program } from "./Program.js";

export class ASMCompiler {
  constructor(code) {
    this.code = code;
  }

  compile() {
    const program = new Program(this.code);
    const ast = program.chomp();
    if(ast.isInvalid()) {
      return null;
    }

    return (new ASMProgram(ast)).compile();
  }
}