import { Compiler } from "../ASM/Compiler.js";
import { Program } from "./Program.js";

export class ASMCompiler {
  constructor(code) {
    this.code = code;
    this.printOffsetPoint = 0x532321;
  }

  _printf() {
    return `int printf(int x){int p=${this.printOffsetPoint};}`
  }

  implicitMethods(code) {
    return this._printf() + code;
  }

  compile() {
    const program = new Program(this.implicitMethods(this.code));
    this.ast = program.chomp();
    if(this.ast.isInvalid()) {
      return null;
    }

    return (new Compiler(this.ast)).compile();
  }
}