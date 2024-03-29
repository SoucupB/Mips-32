import { Runner } from "./Runner.js";

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

  getStdoutResponse() {
    return this.runner.getStdoutResponse();
  }

  getRawStdoutBuffer() {
    return this.runner.getRawStdoutBuffer();
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

  getOutputBuffer() {
    return this.runner.getOutputBuffer();
  }

  getPopback(index, currentBlock) {
    let sum = 0;
    while(index < currentBlock.length && (currentBlock[index] instanceof Pop))  {
      sum += parseInt(currentBlock[index].bytes);
      index++;
    }

    return sum;
  }

  markPopBacks(index, pushPopBuffer, currentBlock) {
    while(index < currentBlock.length && (currentBlock[index] instanceof Pop)) {
      pushPopBuffer[index] = 1;
      index++;
    }
  }

  removeUselessPushPopBlocks(currentBlock) {
    let optimizedBlock = new RegisterBlock();
    let pushPopBuffer = new Array(currentBlock.length).fill(0);
    for(let i = 0, c = currentBlock.length; i < c; i++) {
      if(!pushPopBuffer[i]) {
        if(currentBlock[i] instanceof Pop) {  
          optimizedBlock.push(new Pop(this.getPopback(i, currentBlock)));
        }
        else {
          optimizedBlock.push(currentBlock[i]);
        }
      }
      this.markPopBacks(i, pushPopBuffer, currentBlock);
    }

    return optimizedBlock;
  }

  removeComplementaryPushPopBlocks(currentBlock) {
    let optimizedBlock = new RegisterBlock();
    let pushPopBuffer = new Array(currentBlock.length).fill(0);
    for(let i = 0, c = currentBlock.length - 1; i < c; i++) {
      if((currentBlock[i] instanceof Push) && 
         (currentBlock[i + 1] instanceof Pop) &&
         parseInt(currentBlock[i + 1].bytes) == 4) {
        pushPopBuffer[i] = 1;
        pushPopBuffer[i + 1] = 1;
      }
      else if((currentBlock[i] instanceof Push) && 
         (currentBlock[i + 1] instanceof Pop)) {
        pushPopBuffer[i] = 1;
        currentBlock[i + 1].bytes = parseInt(currentBlock[i + 1].bytes) - 4;
      }
    }
    for(let i = 0, c = currentBlock.length; i < c; i++) {
      if(!pushPopBuffer[i]) {
        optimizedBlock.push(currentBlock[i]);
      }
    }

    return optimizedBlock;
  }

  optimize() {
    this.block = this.flatten().block;
    let blockWOConsecutivePops = this.removeUselessPushPopBlocks(this.block).block;
    this.block = this.removeComplementaryPushPopBlocks(blockWOConsecutivePops).block;
  }

  run() {
    this.runner = (new Runner(this.flatten().block));
    this.runner.run();
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
  REG_TO_STACK: 6,
  REG_MEM_TO_REG: 7,
  REG_TO_MEM_REG: 8
}

export class Setdor extends Register {
  constructor(reg) {
    super();
    this.reg = reg;
  }

  toString() {
    return `SETDOR $${this.reg}`
  }
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
      case MovTypes.REG_MEM_TO_REG: {
        return `MOV $${this.dst} [$${this.src}]`
      }
      case MovTypes.REG_TO_MEM_REG: {
        return `MOV [$${this.dst}] $${this.src}`
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

export const PopTypes = {
  BYTES: 1,
  REGISTER: 2
}

export class Pop extends Register {
  constructor(bytes, type = PopTypes.BYTES) {
    super();
    this.bytes = bytes;
    this.type = type;
  }

  toString() {
    switch(this.type) {
      case PopTypes.BYTES: {
        return `POP ${this.bytes}`;
      }
      case PopTypes.REGISTER: {
        return `POP $${this.bytes}`;
      }
      default: {
        break;
      }
    }
    return '';
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

export const PrintTypes = {
  MEMORY: 1,
  REGISTER: 2
}

export class Print extends Register {
  constructor(value, type = PrintTypes.REGISTER) {
    super();
    this.value = value;
    this.type = type;
  }

  toString() {
    switch(this.type) {
      case PrintTypes.REGISTER: {
        return `PRR $${this.value} 4`
      }
      case PrintTypes.MEMORY: {
        return `PRR [${this.value}] 4`
      }
      default: {
        break;
      }
    }
  }
}