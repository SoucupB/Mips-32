import { Compiler } from "../ASM/Compiler.js";
import { Program } from "./Program.js";

export class ASMCompiler {
  constructor(code) {
    this.code = code;
  }

  compile() {
    const program = new Program(this.code);
    this.ast = program.chomp();
    if(this.ast.isInvalid()) {
      return null;
    }

    return (new Compiler(this.ast)).compile();
  }
}