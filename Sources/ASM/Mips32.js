import { Mov } from "./Register.js";

export class Mips32 {
  constructor(registerBlock, stddout, stackPointer) {
    this.registerBlock = registerBlock.flatten();
    this.registerBlock.optimize();
    this.stddout = stddout;
    this.stackPointer = stackPointer;
    this.block = [];

    this.zeroReg = 0;
    this.stackPointerRegister = 24;
    this.stddoutRegister = 25;

    this.registerCount = 32;
    this.usedRegisters = {};
    this.usedRegisters[this.zeroReg] = 0;
    this.usedRegisters[this.stackPointerRegister] = this.stackPointer;
    this.usedRegisters[this.stddoutRegister] = this.stddout;

    this.prepareHeader();
  }

  iterateBlock() {
    const instructionBlockAsm = this.registerBlock.block;

    for(let i = 0, c = instructionBlockAsm.length; i < c; i++) {
      if(instructionBlockAsm instanceof Mov) {

      }
    }
  }

  prepareHeader() {
    this.block.push(new MipsOr(this.zeroReg, this.zeroReg, this.zeroReg));
    this.block.push(new MipsAddi(this.stackPointerRegister, this.zeroReg, this.stackPointer));
    this.block.push(new MipsOr(this.stddoutRegister, this.zeroReg, this.stddout));
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
export class MipsMultu extends MipsRegister {
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
    return `SW $${this.d} ${this.s}($${this.t})`;
  }
}