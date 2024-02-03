export class StackDeclarations {
  constructor() {
    this.index = [0];
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

  top() {
    return this.variables[this.variables.length - 1];
  }

  freeze() {
    this.index.push(this.variables.length);
  }

  pop() {
    if(!this.index.length) {
      return ;
    }
    for(let i = this.variables.length - 1; i >= this.index[this.index.length - 1]; i--) {
      this.variables.pop();
    }
    this.index.pop();
  }

}