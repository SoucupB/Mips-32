export class RegisterStack {
  constructor() {
    this.stackValues = [];
    this.offset = {};
    this.stackOffset = [];
  }

  getStackOffset() {
    if(!this.stackOffset.length) {
      return 0;
    }

    return this.stackOffset[this.stackOffset.length - 1];
  }

  push(variable, size) {
    this.offset[variable] = {
      stack_offset: this.getStackOffset(),
      size: size
    };
    this.stackOffset.push(size);
  }

  getStackOffset(variable) {
    if(variable in this.offset) {
      return this.offset[variable].stack_offset;
    }
    return null;
  }
}