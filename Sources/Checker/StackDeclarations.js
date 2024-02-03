export class StackDeclarations {
  constructor() {
    this.index = 0;
    this.variables = [];
  }

  push(variable) {
    this.variables.push(variable);
  }

  isVariableDefined(variable) {
    for(let i = 0, c = this.variables.length; i < c; i++) {
      if(variable == this.variables[i]) {
        return true;
      }
    }
    return false;
  }

}