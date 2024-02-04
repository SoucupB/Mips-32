export class RegisterBlock {
  constructor() {
    this.block = [];
  }

  push(instruction) {
    this.block.push(instruction);
  }
}

export class Register {
  
}

export const MovTypes = {
  MEM_TO_REG: 1,
  REG_TO_REG: 2,
  REG_TO_MEM: 3,
  NUMBER_TO_REG: 4
}

export class Mov extends Register {
  constructor(dst, src, type) {
    this.dst = dst;
    this.src = src;
    this.type = type;
  }
}

export class Add extends Register {
  constructor(dst, b, c) {
    this.dst = dst;
    this.b = b;
    this.c = c;
  }
}

export class Sub extends Register {
  constructor(dst, b, c) {
    this.dst = dst;
    this.b = b;
    this.c = c;
  }
}

export class Mul extends Register {
  constructor(dst, b, c) {
    this.dst = dst;
    this.b = b;
    this.c = c;
  }
}

export class Push extends Register {
  constructor(register) {
    this.register = register;
  }
}