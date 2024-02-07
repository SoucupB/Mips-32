export class RegisterBlock {
  constructor() {
    this.block = [];
  }

  toString_t(instruction) {
    if(instruction instanceof RegisterBlock) {
      return this.toStringArray_t(instruction.block)
    }
    return [instruction.toString()];
  }

  toStringArray_t(block) {
    let response = [];
    for(let i = 0, c = block.length; i < c; i++) {
      let currentInstructionArray = this.toString_t(block[i]);
      for(let j = 0, t = currentInstructionArray.length; j < t; j++) {
        response.push(currentInstructionArray[j]);
      }
    }

    return response;
  }

  toStringArray() {
    return this.toStringArray_t(this.block);
  }

  toString() {
    return this.toStringArray_t(this.block).join('\n');
  }

  push(instruction) {
    this.block.push(instruction);
  }
}

export class Register {
  toString() {
    return `UNDEFINED REGISTER`;
  }
}

export const MovTypes = {
  MEM_TO_REG: 1,
  REG_TO_REG: 2,
  REG_TO_MEM: 3,
  NUMBER_TO_REG: 4,
  STACK_TO_REG: 5,
  REG_TO_STACK: 6
}

export class Mov extends Register {
  constructor(dst, src, type) {
    super();
    this.dst = dst;
    this.src = src;
    this.type = type;
  }

  toString() {
    switch(this.type) {
      case MovTypes.NUMBER_TO_REG: {
        return `MOV $${this.dst} ${this.src}`
      }
      case MovTypes.REG_TO_REG: {
        return `MOV $${this.dst} $${this.src}`
      }
      case MovTypes.MEM_TO_REG: {
        return `MOV $${this.dst} [${this.src}]`
      }
      case MovTypes.STACK_TO_REG: {
        if(this.src == 0) {
          return `MOV $${this.dst} [$st]`
        }

        return `MOV $${this.dst} [$st-${this.src}]`
      }
      case MovTypes.REG_TO_STACK: {
        if(this.src == 0) {
          return `MOV [$st] $${this.src}`
        }

        return `MOV [$st-${this.dst}] $${this.src}`
      }

      default: {
        break;
      }
    }
  }
}

export class Add extends Register {
  constructor(dst, b, c) {
    super();
    this.dst = dst;
    this.b = b;
    this.c = c;
  }

  toString() {
    return `ADD $${this.dst} $${this.b} $${this.c}`
  }
}

export class Sub extends Register {
  constructor(dst, b, c) {
    super();
    this.dst = dst;
    this.b = b;
    this.c = c;
  }

  toString() {
    return `SUB $${this.dst} $${this.b} $${this.c}`
  }
}

export class Mul extends Register {
  constructor(dst, b, c) {
    super();
    this.dst = dst;
    this.b = b;
    this.c = c;
  }

  toString() {
    return `MUL $${this.dst} $${this.b} $${this.c}`
  }
}

export class Push extends Register {
  constructor(register) {
    super();
    this.register = register;
  }

  toString() {
    return `PUSH $${this.register}`
  }
}

export class Pop extends Register {
  constructor(bytes) {
    super();
    this.bytes = bytes;
  }

  toString() {
    return `POP ${this.bytes}`
  }
}

export class Cmp extends Register {
  constructor(regA, regB) {
    super();
    this.regA = regA;
    this.regB = regB;
  }

  toString() {
    return `CMP $${this.regA} $${this.regB}`
  }
}