export class StackDeclarations {
  constructor() {
    this.index = [0];
    this.variables = [];
    this.methods = [];
  }

  push(variable) {
    this.variables.push({
      type: 'variable',
      value: variable
    });
  }

  pushMethod(methodName, params) {
    this.methods.push({
      type: 'method',
      value: methodName,
      params: params
    })
  }

  isMethodDefined(methodDefined) {
    for(let i = 0, c = this.methods.length; i < c; i++) {
      if(this.methods[i].type == 'method' && methodDefined == this.methods[i].value) {
        return true;
      }
    }
    return false;
  }

  isVariableDefined(variable) {
    for(let i = 0, c = this.variables.length; i < c; i++) {
      if(this.variables[i].type == 'variable' && variable == this.variables[i].value) {
        return true;
      }
    }
    return false;
  }

  top() {
    return this.variables[this.variables.length - 1].value;
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