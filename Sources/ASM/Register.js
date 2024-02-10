export class RegisterBlock {
  constructor() {
    this.block = []
    this.runner = null;
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

  flatten_t(instruction, block) {
    if(instruction instanceof RegisterBlock) {
      for(let i = 0, c = instruction.block.length; i < c; i++) {
        this.flatten_t(instruction.block[i], block);
      }
      return ;
    }
    block.push(instruction);
  }

  flatten() {
    let block = new RegisterBlock();
    this.flatten_t(this, block);
    return block;
  }

  getRegValue(reg) {
    return this.runner.getRegValue(reg)
  }

  run() {
    this.runner = (new Runner(this.flatten().block));
    this.runner.run();
  }
}

export class Runner {
  constructor(instructionArray) {
    this.instructionArray = instructionArray;
    this.register = {};
    this.initialStackPointer = 1024 * 1024 * 2;
    this.stackPointer = this.initialStackPointer;
    this.memory = new Array(1024 * 1024 * 24).fill(0);
  }

  saveRegValue(dst, src) {
    if(src.toString() in this.register) {
      this.register[dst.toString()] = this.register[src.toString()];
      return ;
    }
  }

  getRegValue(reg) {
    if(reg.toString() in this.register) {
      return parseInt(this.register[reg.toString()]);
    }
    return 0;
  }

  numberToByteArray(number) {
    const byteArray = new Array(4).fill(0);
    byteArray[0] = number & 0xFF;
    byteArray[1] = (number >> 8) & 0xFF;
    byteArray[2] = (number >> 16) & 0xFF;
    byteArray[3] = (number >> 24) & 0xFF;
    return byteArray;
  }

  saveRegInStack(memPointer, reg) {
    let crp = this.numberToByteArray(this.getRegValue(reg));
    let memPointerNumber = parseInt(memPointer);
    for(let i = 0, c = crp.length; i < c; i++) {
      this.memory[this.stackPointer - memPointerNumber + i] = crp[i]; 
    }
  }

  saveRegInMem(memPointer, reg) {
    let crp = this.numberToByteArray(this.getRegValue(reg));
    let memPointerNumber = parseInt(memPointer);
    for(let i = 0, c = crp.length; i < c; i++) {
      this.memory[memPointerNumber + i] = crp[i];
    }
  }

  saveMemInReg(memPointer, reg) {
    let memPointerNumber = parseInt(memPointer);
    let number = this.memory[memPointerNumber] + 
                 this.memory[memPointerNumber + 1] * 256 + 
                 this.memory[memPointerNumber + 2] * 256 * 256 + 
                 this.memory[memPointerNumber + 3] * 256 * 256 * 256;
    this.register[reg.toString()] = number;
  }

  runMov(instruction) {
    switch(instruction.type) {
      case MovTypes.REG_TO_REG: {
        this.saveRegValue(instruction.dst, instruction.src);
        break;
      }
      case MovTypes.REG_TO_STACK: {
        this.saveRegInStack(instruction.dst, instruction.src);
        break;
      }
      case MovTypes.NUMBER_TO_REG: {
        this.register[instruction.dst.toString()] = parseInt(instruction.src);
        break;
      }
      case MovTypes.REG_TO_MEM: {
        this.saveRegInMem(instruction.dst, instruction.src);
        break;
      }
      case MovTypes.MEM_TO_REG: {
        this.saveMemInReg(instruction.src, instruction.dst);
        break;
      }
      default: {
        break;
      }
    }
  }

  runInstruction(instruction) {
    if(instruction instanceof Mov) {
      this.runMov(instruction)
    }
  }

  run() {
    for(let i = 0, c = this.instructionArray.length; i < c; i++) {
      const currentInstruction = this.instructionArray[i];
      this.runInstruction(currentInstruction);
    }
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
        if(this.dst == 0) {
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

export class Setne extends Register {
  constructor(regA) {
    super();
    this.regA = regA;
  }

  toString() {
    return `SETNE $${this.regA}`
  }
}

export class Sete extends Register {
  constructor(regA) {
    super();
    this.regA = regA;
  }

  toString() {
    return `SETE $${this.regA}`
  }
}

export class Test extends Register {
  constructor(regA, regB) {
    super();
    this.regA = regA;
    this.regB = regB;
  }

  toString() {
    return `TEST $${this.regA} $${this.regB}`
  }
}

export class Setnz extends Register {
  constructor(regA) {
    super();
    this.regA = regA;
  }

  toString() {
    return `SETNZ $${this.regA}`
  }
}

export class Or extends Register {
  constructor(regA, regB) {
    super();
    this.regA = regA;
    this.regB = regB;
  }

  toString() {
    return `OR $${this.regA} $${this.regB}`
  }
}

export class Setge extends Register {
  constructor(regA) {
    super();
    this.regA = regA;
  }

  toString() {
    return `SETGE $${this.regA}`
  }
}

export class Setle extends Register {
  constructor(regA) {
    super();
    this.regA = regA;
  }

  toString() {
    return `SETLE $${this.regA}`
  }
}

export class Jz extends Register {
  constructor(label) {
    super();
    this.label = label;
  }

  toString() {
    return `JZ ${this.label}`
  }
}

export class Label extends Register {
  constructor(label) {
    super();
    this.label = label;
  }

  toString() {
    return `:${this.label}`
  }
}

export const JmpTypes = {
  LABEL: 1,
  REGISTER: 2
}

export class Jmp extends Register {
  constructor(value, type = JmpTypes.LABEL) {
    super();
    this.value = value;
    this.type = type;
  }

  toString() {
    switch(this.type) {
      case JmpTypes.LABEL: {
        return `JMP ${this.value}`
      }

      case JmpTypes.REGISTER: {
        return `JMP $${this.value}`
      }

      default: {
        break;
      }
    }
  }
}

export class Div extends Register {
  constructor(a, b) {
    super();
    this.a = a;
    this.b = b;
  }

  toString() {
    return `DIV $${this.a} $${this.b}`
  }
}

export class Prp extends Register { // pseudoinstruction. Sets the values of the register with the current execution pointer + offset.
  constructor(reg, offset) {
    super();
    this.reg = reg;
    this.offset = offset
  }

  toString() {
    return `PRP $${this.reg} ${this.offset}`
  }
}