import { Add, Div, JmpTypes, Mov, MovTypes, Mul, Pop, Push, Jmp, Label } from "./Register.js";

export class Mips32 {
  constructor(registerBlock, stddout, stackPointer) {
    this.registerBlock = registerBlock.flatten();
    this.registerBlock.optimize();
    this.stddout = stddout;
    this.stackPointer = stackPointer;
    this.block = [];

    this.zeroReg = 31;
    this.stackPointerRegister = 30;
    this.stddoutRegister = 29;
    this.freeRegister = 28;
    this.hi = 27;
    this.lo = 26;

    this.registerCount = 32;
    this.usedRegisters = {
      'HI': this.hi,
      'LO': this.lo
    };
    this.usedRegisters[this.zeroReg] = 0;
    this.usedRegisters[this.stackPointerRegister] = this.stackPointer;
    this.usedRegisters[this.stddoutRegister] = this.stddout;

    this.prepareHeader();
    this.iterateBlock();
  }

  iterateBlock() {
    const instructionBlockAsm = this.registerBlock.block;

    for(let i = 0, c = instructionBlockAsm.length; i < c; i++) {
      const instruction = instructionBlockAsm[i];
      if(instruction instanceof Mov) {
        this.addMoveBlock(instruction);
      }
      if(instruction instanceof Push) {
        this.addPushBlock(instruction);
      }
      if(instruction instanceof Add) {
        this.addAddInstruction(instruction);
      }
      if(instruction instanceof Pop) {
        this.addPopInstruction(instruction)
      }
      if(instruction instanceof Mul) {
        this.addMultInstruction(instruction);
      }
      if(instruction instanceof Div) {
        this.addDivInstruction(instruction);
      }
      if(instruction instanceof Jmp) {
        this.addJumpInstruction(instruction)
      }
      if(instruction instanceof Label) {
        continue;
      }
      
    }
  }

  addJumpInstruction(instruction) {
    switch(instruction.type) {
      case JmpTypes.REGISTER: {
        this.block.push(new MipsJr(instruction.value));
        break;
      }
      case JmpTypes.LABEL: {
        // to do
        break;
      }
    }
  }

  getRegisterValue(register) {
    if(register in this.usedRegisters) {
      return this.usedRegisters[register];
    }

    return register;
  }

  addDivInstruction(instruction) {
    this.block.push(new MipsDiv(instruction.a, instruction.b));
  }

  addMultInstruction(instruction) {
    this.block.push(new MipsMult(instruction.b, instruction.c));
    this.block.push(new MipsAddi(instruction.dst, this.lo, 0));
  }

  addPushBlock(instruction) {
    this.block.push(new MipsSw(instruction.register, 0, this.stackPointerRegister));
    this.block.push(new MipsAddi(this.stackPointerRegister, this.zeroReg, 4));
  }

  addAddInstruction(instruction) {
    this.block.push(new MipsAdd(instruction.dst, instruction.b, instruction.c));
  }

  addPopInstruction(instruction) {
    this.block.push(new MipsAddi(this.freeRegister, this.zeroReg, instruction.bytes));
    this.block.push(new MipsSub(this.stackPointerRegister, this.stackPointerRegister, this.freeRegister));
  }

  addMoveBlock(instruction) {

    switch(instruction.type) {
      case MovTypes.REG_TO_REG: {
        this.block.push(new MipsAdd(instruction.dst, this.getRegisterValue(instruction.src), this.zeroReg));
        break;
      }
      case MovTypes.NUMBER_TO_REG: { // In case number is only 16 bits.
        this.block.push(new MipsAddi(instruction.dst, this.zeroReg, instruction.src));
        break;
      }
      case MovTypes.STACK_TO_REG: {
        this.block.push(new MipsLw(instruction.dst, -instruction.src, this.stackPointerRegister));
        break;
      }
      case MovTypes.REG_TO_STACK: {
        this.block.push(new MipsSw(instruction.dst, -instruction.src, this.stackPointerRegister));
        break;
      }
      case MovTypes.REG_MEM_TO_REG: {
        this.block.push(new MipsLw(instruction.dst, 0, instruction.src));
        break;
      }
      case MovTypes.REG_TO_MEM_REG: {
        this.block.push(new MipsSw(instruction.dst, 0, instruction.src));
        break;
      }

      default: {
        break;
      }
    }
  }

  prepareHeader() {
    this.block.push(new MipsOr(this.zeroReg, this.zeroReg, this.zeroReg));
    this.block.push(new MipsAddi(this.stackPointerRegister, this.zeroReg, this.stackPointer));
    this.block.push(new MipsAddi(this.stddoutRegister, this.zeroReg, this.stddout));
  }

  flatten() {

  }

  toStringArray_t(block) {
  }

  toString() {
    let response = [];
    for(let i = 0, c = this.block.length; i < c; i++) {
      response.push(this.block[i].toString());
    }
    return response.join('\n');
  }
}

export class MipsRegister {
  toString() {
    return `UNDEFINED REGISTER`;
  }
}

export class MipsAdd extends MipsRegister {
  constructor(dst, srcA, srcB) {
    super();
    this.dst = dst;
    this.srcA = srcA;
    this.srcB = srcB;
  }

  toString() {
    return `ADD $${this.dst} $${this.srcA} $${this.srcB}`
  }
}

export class MipsAddi extends MipsRegister {
  constructor(t, s, immediate) {
    super();
    this.t = t;
    this.s = s;
    this.immediate = immediate;
  }

  toString() {
    return `ADDI $${this.t} $${this.s} ${this.immediate}`
  }
}

// lo = s / t, hi = s % t
export class MipsDiv extends MipsRegister {
  constructor(s, t) {
    super();
    this.s = s;
    this.t = t;
  }

  toString() {
    return `DIV $${this.s} $${this.t}`
  }
}

// lo = s * t (first 32 bits), hi = s * t (last 32 bits)
export class MipsMult extends MipsRegister {
  constructor(s, t) {
    super();
    this.s = s;
    this.t = t;
  }

  toString() {
    return `MULT $${this.s} $${this.t}`
  }
}

export class MipsSll extends MipsRegister {
  constructor(s, t, i) {
    super();
    this.s = s;
    this.t = t;
    this.i = i;
  }

  toString() {
    return `SLL $${this.s} $${this.t} ${this.i}`
  }
}

export class MipsSub extends MipsRegister {
  constructor(d, s, t) {
    super();
    this.d = d;
    this.s = s;
    this.t = t;
  }

  toString() {
    return `SUB $${this.d} $${this.s} $${this.t}`;
  }
}

export class MipsSubi extends MipsRegister {
  constructor(d, s, i) {
    super();
    this.d = d;
    this.s = s;
    this.i = i;
  }

  toString() {
    return `SUBI $${this.d} $${this.s} ${this.i}`;
  }
}

export class MipsSw extends MipsRegister {
  constructor(t, i, s) {
    super();
    this.t = t;
    this.i = i;
    this.s = s;
  }

  toString() {
    return `SW $${this.t} ${this.i}($${this.s})`;
  }
}

export class MipsLw extends MipsRegister {
  constructor(t, i, s) {
    super();
    this.t = t;
    this.i = i;
    this.s = s;
  }

  toString() {
    return `LW $${this.t} ${this.i}($${this.s})`;
  }
}

export class MipsOr extends MipsRegister {
  constructor(d, s, t) {
    super();
    this.d = d;
    this.s = s;
    this.t = t;
  }

  toString() {
    return `OR $${this.d} $${this.s} $${this.t}`;
  }
}

export class MipsXor extends MipsRegister {
  constructor(d, s, t) {
    super();
    this.d = d;
    this.s = s;
    this.t = t;
  }

  toString() {
    return `XOR $${this.d} $${this.s} $${this.t}`;
  }
}

export class MipsJr extends MipsRegister {
  constructor(register) {
    super();
    this.register = register;
  }

  toString() {
    return `JR $${this.register}`;
  }
}