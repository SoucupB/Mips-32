import { Mips32Runner } from "./Mips32Runner.js";
import { Add, Div, JmpTypes, Mov, MovTypes, Mul, Pop, Push, Jmp, Label, Cmp, Sete, Setne, Setge, Setle, Setnz, Setdor, Sub, Test, Jz, Prp, Or } from "./Register.js";

export class Mips32 {
  constructor(registerBlock, stddout, stackPointer, compile = true, registerData = {
    zeroReg: 31,
    stackPointerRegister: 30,
    stddoutRegister: 29,
    freeRegister: 28,
    hi: 27,
    lo: 26,
    testRegister: 25,
    rsp: 24,
    ret: 23,
    bitSplitterRegister: 22,
  }, memorySize = 1024 * 1024) {
    this.registerBlock = registerBlock.flatten();
    this.registerBlock.optimize();
    this.stddout = stddout;
    this.stackPointer = stackPointer;
    this.block = [];
    this.memorySize = memorySize;

    this.registerData = registerData

    this.registerCount = 32;
    this.usedRegisters = {
      'HI': this.registerData.hi,
      'LO': this.registerData.lo,
      'rsp': this.registerData.rsp,
      'ret': this.registerData.ret
    };

    this.labelsOffsets = {};

    if(compile) {
      this.prepareHeader();
      this.iterateBlock();
      this.iterateImediates();
      this.createLabelOffsets();
      // this.rebuildJumpInstructions(); 
      // This will not work since labels will not be reofseted.
    }
  }

  iterateImediates() {
    let newBlock = [];
    for(let i = 0, c = this.block.length; i < c; i++) {
      if(this.block[i] instanceof MipsAddi) {
        this.addNumberToBlock(this.block[i], newBlock);
        continue;
      }

      newBlock.push(this.block[i]);
    }
    this.block = newBlock;
  }

  getStdoutResponse() {
    const bufferSize = this.runner.getNumberAtAddress(this.runner.memory, this.stddout - 4);

    let response = [];
    for(let i = 0, c = bufferSize; i < c; i += 4) {
      response.push(this.getNumberAtAddress(this.runner.memory, this.stddout + i));
    }

    return response.join('\n');
  }

  addLabelFromImmediate(instruction, block) {
    if(this.doesNumberFitInImmediate(instruction.register)) {
      block.push(instruction)
      return ;
    }
    let immediate = parseInt(instruction.register);

    let lowImmediate = (immediate & ((1 << 16) - 1));
    let highImmediate = (immediate >> 16);

    block.push(new MipsAddi(this.registerData.bitSplitterRegister, this.registerData.zeroReg, lowImmediate));
    block.push(new MipsAddi(this.registerData.freeRegister, this.registerData.zeroReg, highImmediate));
    block.push(new MipsSll(this.registerData.freeRegister, this.registerData.freeRegister, 16));
    block.push(new MipsOr(this.registerData.freeRegister, this.registerData.freeRegister, this.registerData.bitSplitterRegister));
    block.push(new MipsJr(this.registerData.freeRegister));
  }

  rebuildJumpInstructions() {
    let newBlock = [];
    for(let i = 0, c = this.block.length; i < c; i++) {
      if(this.block[i] instanceof MipsJ) {
        this.addLabelFromImmediate(this.block[i], newBlock);
        continue;
      }

      newBlock.push(this.block[i]);
    }
    this.block = newBlock;
  }

  createLabelOffsets() {
    for(let i = 0, c = this.block.length; i < c; i++) {
      if(this.block[i] instanceof MipsLabel) {
        this.labelsOffsets[this.block[i].label] = i;
        this.block[i] = new MipsNoop()
      }
    }
    for(let i = 0, c = this.block.length; i < c; i++) {
      if(this.block[i] instanceof MipsJ) {
        this.block[i] = new MipsJ(this.labelsOffsets[this.block[i].register])
      }
      if(this.block[i] instanceof MipsBeq) {
        this.block[i].label = this.labelsOffsets[this.block[i].label] - i;
      }
      if(this.block[i] instanceof MipsPrp) {
        this.block[i] = new MipsAddi(this.getRegisterValue(this.block[i].reg), this.registerData.zeroReg, i + this.block[i].offset);
      }
    }
  }

  numberToUnsignedRpresentation(number) {
    if(number >= 0) {
      return number;
    }

    return 2 ** 32 - number + 1;
  }

  doesNumberFitInImmediate(immediate) {
    return parseInt(immediate) <= 2 ** 16;
  }

  iterateBlock() {
    const instructionBlockAsm = this.registerBlock.block;

    for(let i = 0, c = instructionBlockAsm.length; i < c; i++) {
      const instruction = instructionBlockAsm[i];
      if(instruction instanceof Mov) {
        this.addMoveBlock(instruction, instructionBlockAsm, i);
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
        this.block.push(new MipsLabel(instruction.label));
      }
      if(instruction instanceof Cmp) {
        continue;
      }
      if(instruction instanceof Setne) {
        this.addSetneInstruction(instruction, instructionBlockAsm, i);
      }
      if(instruction instanceof Sete) {
        this.addSeteInstruction(instruction, instructionBlockAsm, i);
      }
      if(instruction instanceof Setge) {
        this.addSetgeInstruction(instruction, instructionBlockAsm, i);
      }
      if(instruction instanceof Setle) {
        this.addSetleInstruction(instruction, instructionBlockAsm, i);
      }
      if(instruction instanceof Setnz) {
        this.addSetnzInstruction(instruction, instructionBlockAsm, i);
      }
      if(instruction instanceof Setdor) {
        this.addSetdorInstruction(instruction, instructionBlockAsm, i);
      }
      if(instruction instanceof Sub) {
        this.addSubInstruction(instruction);
      }
      if(instruction instanceof Test) {
        this.addSetTestInstruction(instruction, instructionBlockAsm, i);
      }
      if(instruction instanceof Jz) {
        this.addJzInstruction(instruction)
      }
      if(instruction instanceof Prp) {
        this.addPrpInstruction(instruction)
      }
    }
  }

  addPrpInstruction(instruction) {
    this.block.push(new MipsPrp(instruction.reg, instruction.offset))
  }

  addJzInstruction(instruction) {
    this.block.push(new MipsBeq(this.registerData.testRegister, this.registerData.zeroReg, instruction.label))
  }

  addSetTestOnEqual(instruction) {
    this.block.push(new MipsSltu(this.registerData.testRegister, this.registerData.zeroReg, instruction.regA));
  }

  addSetTestInstruction(instruction) {
    if(instruction.regA == instruction.regB) {
      this.addSetTestOnEqual(instruction);
      return ;
    }
    this.block.push(new MipsSlt(instruction.regA, this.registerData.zeroReg, instruction.regA));
    this.block.push(new MipsSlt(instruction.regB, this.registerData.zeroReg, instruction.regB));
    this.block.push(new MipsAnd(this.registerData.testRegister, instruction.regA, instruction.regB));
  }

  addSubInstruction(instruction) {
    this.block.push(new MipsSub(instruction.dst, instruction.b, instruction.c));
  }

  addSetdorInstruction(instruction, instructions, index) {
    let closestCmp = this.searchClosestOr(instructions, index);
    this.block.push(new MipsSltu(closestCmp.regA, this.registerData.zeroReg, closestCmp.regA));
    this.block.push(new MipsSltu(closestCmp.regB, this.registerData.zeroReg, closestCmp.regB));
    this.block.push(new MipsOr(instruction.reg, closestCmp.regA, closestCmp.regB));
  }

  addSetnzInstruction(instruction, instructions, index) {
    let closestCmp = this.searchClosestCmp(instructions, index);
    this.block.push(new MipsSltu(closestCmp.regA, this.registerData.zeroReg, closestCmp.regA));
    this.block.push(new MipsSltu(closestCmp.regB, this.registerData.zeroReg, closestCmp.regB));
    this.block.push(new MipsAnd(instruction.regA, closestCmp.regA, closestCmp.regB));
  }

  addSetleInstruction(instruction, instructions, index) {
    let closestCmp = this.searchClosestCmp(instructions, index);
    this.block.push(new MipsSlt(instruction.regA, closestCmp.regB, closestCmp.regA));
    this.block.push(new MipsXori(instruction.regA, instruction.regA, 1));
  }

  addSetgeInstruction(instruction, instructions, index) {
    let closestCmp = this.searchClosestCmp(instructions, index);
    this.block.push(new MipsSlt(instruction.regA, closestCmp.regA, closestCmp.regB));
    this.block.push(new MipsXori(instruction.regA, instruction.regA, 1));
  }

  addSeteInstruction(instruction, instructions, index) {
    let closestCmp = this.searchClosestCmp(instructions, index);
    this.block.push(new MipsXor(closestCmp.regA, closestCmp.regA, closestCmp.regB));
    this.block.push(new MipsSltu(instruction.regA, this.registerData.zeroReg, closestCmp.regA));
    this.block.push(new MipsXori(instruction.regA, instruction.regA, 1));
  }

  addSetneInstruction(instruction, instructions, index) {
    let closestCmp = this.searchClosestCmp(instructions, index);
    this.block.push(new MipsXor(closestCmp.regA, closestCmp.regA, closestCmp.regB));
    this.block.push(new MipsSltu(instruction.regA, this.registerData.zeroReg, closestCmp.regA));
  }

  addJumpInstruction(instruction) {
    switch(instruction.type) {
      case JmpTypes.REGISTER: {
        this.block.push(new MipsJr(this.getRegisterValue(instruction.value)));
        break;
      }
      case JmpTypes.LABEL: {
        this.block.push(new MipsJ(instruction.value));
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
    this.block.push(new MipsAddi(instruction.dst, this.registerData.lo, 0));
  }

  addPushBlock(instruction) {
    this.block.push(new MipsSw(this.getRegisterValue(instruction.register), 0, this.registerData.stackPointerRegister));
    this.block.push(new MipsAddi(this.registerData.stackPointerRegister, this.registerData.stackPointerRegister, 4));
  }

  addAddInstruction(instruction) {
    this.block.push(new MipsAdd(instruction.dst, instruction.b, instruction.c));
  }

  addPopInstruction(instruction) {
    this.block.push(new MipsAddi(this.registerData.freeRegister, this.registerData.zeroReg, instruction.bytes));
    this.block.push(new MipsSub(this.registerData.stackPointerRegister, this.registerData.stackPointerRegister, this.registerData.freeRegister));
  }

  searchClosestCmp(instructions, index) {
    for(let i = index; i >= 0; i--) {
      if(instructions[i] instanceof Cmp) {
        return instructions[i];
      }
    }

    return null;
  }

  searchClosestOr(instructions, index) {
    for(let i = index; i >= 0; i--) {
      if(instructions[i] instanceof Or) {
        return instructions[i];
      }
    }

    return null;
  }

  addSpecialMov(instruction, instructions, index) {
    let closestCmp = this.searchClosestCmp(instructions, index);
    if(instruction.src == 'CF') {
      this.block.push(new MipsSlt(instruction.dst, closestCmp.regA, closestCmp.regB));
      return ;
    }
    if(instruction.src == 'CT') {
      this.block.push(new MipsSlt(instruction.dst, closestCmp.regB, closestCmp.regA));
      return ;
    }
    this.block.push(new MipsAdd(this.getRegisterValue(instruction.dst), this.getRegisterValue(instruction.src), this.registerData.zeroReg));
  }

  addNumberToBlock(instruction, block) { 
    let dstRegisterNumber = instruction.t;
    if(this.doesNumberFitInImmediate(instruction.immediate)) {
      block.push(instruction);
      return ;
    }
    let immediate = parseInt(instruction.immediate);

    let lowImmediate = (immediate & ((1 << 16) - 1));
    let highImmediate = (immediate >> 16);

    block.push(new MipsAddi(this.registerData.bitSplitterRegister, this.registerData.zeroReg, lowImmediate));
    block.push(new MipsAddi(dstRegisterNumber, this.registerData.zeroReg, highImmediate));
    block.push(new MipsSll(dstRegisterNumber, dstRegisterNumber, 16));
    block.push(new MipsOr(dstRegisterNumber, dstRegisterNumber, this.registerData.bitSplitterRegister));
  }

  getPositiveLwInstructions(t, i, s) {
    if(i >= 0) {
      return new MipsLw(t, i, s);
    }

    this.block.push(new MipsAddi(this.registerData.freeRegister, this.registerData.zeroReg, -i));
    this.block.push(new MipsSub(this.registerData.freeRegister, s, this.registerData.freeRegister));
    return new MipsLw(t, 0, this.registerData.freeRegister);
  }

  getPositiveSwInstructions(t, i, s) {
    if(i >= 0) {
      return new MipsSw(t, i, s);
    }

    this.block.push(new MipsAddi(this.registerData.freeRegister, this.registerData.zeroReg, -i));
    this.block.push(new MipsSub(this.registerData.freeRegister, s, this.registerData.freeRegister));
    return new MipsSw(t, 0, this.registerData.freeRegister);
  }

  addMoveBlock(instruction, instructions, index) {
    switch(instruction.type) {
      case MovTypes.REG_TO_REG: {
        // Extend number in case its bigger then 16 bits.
        this.addSpecialMov(instruction, instructions, index);
        break;
      }
      case MovTypes.NUMBER_TO_REG: {
        // this.addNumberToBlock(instruction);
        this.block.push(new MipsAddi(this.getRegisterValue(instruction.dst), this.registerData.zeroReg, instruction.src));
        break;
      }
      case MovTypes.STACK_TO_REG: {
        this.block.push(this.getPositiveLwInstructions(this.getRegisterValue(instruction.dst), -instruction.src, this.registerData.stackPointerRegister));
        break;
      }
      case MovTypes.REG_TO_STACK: {
        this.block.push(this.getPositiveSwInstructions(this.getRegisterValue(instruction.src), -instruction.dst, this.registerData.stackPointerRegister));
        break;
      }
      case MovTypes.REG_MEM_TO_REG: {
        this.block.push(this.getPositiveLwInstructions(this.getRegisterValue(instruction.dst), 0, this.getRegisterValue(instruction.src)));
        break;
      }
      case MovTypes.REG_TO_MEM_REG: {
        this.block.push(this.getPositiveSwInstructions(this.getRegisterValue(instruction.src), 0, this.getRegisterValue(instruction.dst)));
        break;
      }

      default: {
        break;
      }
    }
  }

  prepareHeader() {
    this.block.push(new MipsOr(this.registerData.zeroReg, this.registerData.zeroReg, this.registerData.zeroReg));
    this.block.push(new MipsAddi(this.registerData.stackPointerRegister, this.registerData.zeroReg, this.stackPointer));
    this.block.push(new MipsAddi(this.registerData.stddoutRegister, this.registerData.zeroReg, this.stddout));
  }

  run() {
    this.runner = new Mips32Runner(this.block, this.registerData, this.memorySize);
    this.runner.run()
  }

  toString_t(withIndex = false) {
    let response = [];
    for(let i = 0, c = this.block.length; i < c; i++) {
      if(!withIndex) {
        response.push(this.block[i].toString());
        continue;
      }
      response.push(`${i}: ${this.block[i].toString()}`);
    }
    return response.join('\n');
  }

  toString(withIndex = false) {
    const newBlock = this.flatten();
    return newBlock.toString_t(withIndex);
  }

  flatten_t(instruction, block) {
    if(instruction instanceof Mips32) {
      for(let i = 0, c = instruction.block.length; i < c; i++) {
        this.flatten_t(instruction.block[i], block);
      }
      return ;
    }
    block.push(instruction);
  }
  
  flatten() {
    let block = new Mips32(this.registerBlock, this.stddout, this.stackPointer, false);
    this.flatten_t(this, block);

    return block;
  }

  push(instruction) {
    this.block.push(instruction)
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

export class MipsXori extends MipsRegister {
  constructor(d, s, i) {
    super();
    this.d = d;
    this.s = s;
    this.i = i;
  }

  toString() {
    return `XORI $${this.d} $${this.s} ${this.i}`;
  }
}

export class MipsAnd extends MipsRegister {
  constructor(d, s, t) {
    super();
    this.d = d;
    this.s = s;
    this.t = t;
  }

  toString() {
    return `AND $${this.d} $${this.s} $${this.t}`;
  }
}

export class MipsAndi extends MipsRegister {
  constructor(d, s, i) {
    super();
    this.d = d;
    this.s = s;
    this.i = i;
  }

  toString() {
    return `ANDI $${this.d} $${this.s} ${this.i}`;
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

export class MipsSlt extends MipsRegister {
  constructor(d, s, t) {
    super();
    this.d = d;
    this.s = s;
    this.t = t;
  }

  toString() {
    return `SLT $${this.d} $${this.s} $${this.t}`;
  }
}

export class MipsBeq extends MipsRegister {
  constructor(s, t, label) {
    super();
    this.s = s;
    this.t = t;
    this.label = label;
  }

  toString() {
    return `BEQ $${this.s} $${this.t} ${this.label}`;
  }
}

export class MipsNoop extends MipsRegister {
  constructor() {
    super();
  }

  toString() {
    return `NOOP`;
  }
}

export class MipsLabel extends MipsRegister {
  constructor(label) {
    super();
    this.label = label;
  }

  toString() {
    return `:${this.label}`;
  }
}

export class MipsJ extends MipsRegister {
  constructor(register) {
    super();
    this.register = register;
  }

  toString() {
    return `J ${this.register}`;
  }
}

export class MipsPrp extends MipsRegister {
  constructor(reg, offset) {
    super();
    this.reg = reg;
    this.offset = offset
  }

  toString() {
    return `PRP $${this.reg} ${this.offset}`
  }
}

export class MipsSltu extends MipsRegister {
  constructor(d, s, t) {
    super();
    this.d = d;
    this.s = s;
    this.t = t;
  }

  toString() {
    return `SLTU $${this.d} $${this.s} $${this.t}`;
  }
}