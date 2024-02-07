export class RegisterStack {
  constructor() {
    this.stackValues = [];
    this.offset = {};
    this.stackOffset = [];
    this.freezeHistory = [0];
    this.variableNames = [];
  }

  getStackLastIndex() {
    if(!this.stackOffset.length) {
      return 0;
    }
    return this.stackOffset[this.stackOffset.length - 1];
  }

  push(variable, size) {
    this.offset[variable] = {
      stack_offset: this.getStackLastIndex(),
      size: size
    };
    this.stackOffset.push(this.getStackLastIndex() + size);
    // this.variableNames.push(variable);
  }

  freeze() {
    this.variableNames.push(this.getStackLastIndex());
  }

  topVariableName() {
    if(!this.variableNames.length) {
      return null;
    }

    return this.variableNames[this.variableNames.length - 1];
  }

  pop() {
    if(!this.freezeHistory.length) {
      return ;
    }
    for(let i = this.freezeHistory.length - 1; i >= this.freezeHistory[this.freezeHistory.length - 1]; i--) {
      this.stackOffset.pop();
      const variableName = this.topVariableName();
      delete this.offset[variableName];
    }
    this.freezeHistory.pop();
  }

  getStackOffset(variable) {
    if(variable in this.offset) {
      return this.getStackLastIndex() - this.offset[variable].stack_offset;
    }
    return null;
  }
}