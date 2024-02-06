export class RegisterStack {
  constructor() {
    this.stackValues = [];
    this.offset = {};
    this.stackOffset = [];
  }

  push(variable, size) {
    this.offset[variable] = {
      stack_offset: this.stackOffset,
      size: size
    };
    this.stackOffset.push(size);
  }

  getStackOffset(variable) {
    if(variable in this.offset) {
      return this.offset[variable].stack_offset
    }

    return null;
  }
}