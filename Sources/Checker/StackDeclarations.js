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

  freeze() {
    this.index = this.variables.length;
  }

  pop() {
    for(let i = this.variables.length - 1; i >= this.index; i--) {
      this.variables.pop();
    }
  }

}