export class ASMProgram {
  constructor(ast) {
    this.ast = ast;
  }

  compile() {
    console.log(this.ast)
  }
}