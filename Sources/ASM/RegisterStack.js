export class RegisterStack {
  constructor() {
    this.stackValues = [];
    this.offset = {};
    this.stackOffset = 0;
  }

  push(variable, size) {
    this.offset[variable] = {
      stack_offset: this.stackOffset,
      size: size
    };
    this.stackOffset += size;
  }
}