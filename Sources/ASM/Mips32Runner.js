import { MipsAdd, MipsAddi, MipsAnd, MipsBeq, MipsDiv, MipsJ, MipsJr, MipsLw, MipsMult, MipsOr, MipsSlt, MipsSltu, MipsSub, MipsSw, MipsXor, MipsXori } from "./Mips32.js";

export const ReadMemoryType = {
  INT32: 1,
  INT8: 2
};

export class Mips32Runner {
  constructor(block) {
    this.block = block;

    this.zeroReg = 31;
    this.stackPointerRegister = 30;
    this.stddoutRegister = 29;
    this.freeRegister = 28;
    this.hi = 27;
    this.lo = 26;
    this.testRegister = 25;
    this.rsp = 24;
    this.ret = 23;

    this.registerCount = 32;
    this.usedRegisters = {
      'HI': this.hi,
      'LO': this.lo,
      'rsp': this.rsp,
      'ret': this.ret
    };

    this.memory = new Array(1024 * 1024).fill(0);
    this.register = {};

    this.pc = 0;
  }

  registerValue(reg) {
    const stringReg = reg.toString();
    if(stringReg in this.register) {
      return this.register[stringReg];
    }

    return 0;
  }

  printPointerBytes(nrOfBytes, pointer) {
    let response = [];
    for(let i = 0; i < nrOfBytes; i++) {
      response.push(this.memory[pointer + i]);
    }

    return response;
  }

  printStack(nrOfBytes) {
    let response = [];
    let regValue = this.registerValue(this.stackPointerRegister);
    for(let i = 0; i < nrOfBytes; i++) {
      response.push(this.memory[regValue + i]);
    }

    return response.join(' ');
  }

  unsigned(number) {
    if(number >= 0) {
      return number;
    }
    return 2 ** 32 - -(number + 1);
  }

  positiveNumberToByteArray(number) {
    const byteArray = [0, 0, 0, 0];
    byteArray[0] = number & 0xFF;
    byteArray[1] = (number >> 8) & 0xFF;
    byteArray[2] = (number >> 16) & 0xFF;
    byteArray[3] = (number >> 24) & 0xFF;
    return byteArray;
  }

  negativeNumberToByteArray(number) {
    const normalisedNumber = 2**32 + number;
    return this.positiveNumberToByteArray(normalisedNumber);
  }

  numberToByteArray(number) {
    if(number >= 0) {
      return this.positiveNumberToByteArray(number);
    }
    return this.negativeNumberToByteArray(number);
  }

  saveRegInMemory(pointer, reg, offset) {
    let crp = this.numberToByteArray(this.registerValue(reg));
    // console.log(reg, this.registerValue(reg), pointer)
    for(let i = 0, c = crp.length; i < c; i++) {
      this.memory[pointer + i + offset] = crp[i];
    }
  }

  get32ByteInteger(number) {
    if(number < 2**31) {
      return number;
    }
    return -(2**32 - number);
  }

  getNumberAtAddress(memory, pointer, type = ReadMemoryType.INT32) {
    switch(type) {
      case ReadMemoryType.INT32: {
        let number = 0;
        let power = 1;
        for(let i = 0; i < 4; i++) {
          number += memory[pointer + i] * power;
          power *= 256;
        }
        return this.get32ByteInteger(number);
      }
      case ReadMemoryType.INT8: {
        return memory[pointer];
      }
      default: {
        break;
      }
    }

    return 0;
  }

  saveNumberInReg(pointer, reg, offset) {
    let number = this.getNumberAtAddress(this.memory, pointer + offset);
    this.register[reg.toString()] = number;
  }

  runInstruction(instruction) {
    if(instruction instanceof MipsAdd) {
      this.register[instruction.dst.toString()] = this.registerValue(instruction.srcA) + this.registerValue(instruction.srcB);
    }
    if(instruction instanceof MipsSub) {
      this.register[instruction.d.toString()] = this.registerValue(instruction.s) - this.registerValue(instruction.t);
    }
    if(instruction instanceof MipsOr) {
      this.register[instruction.d.toString()] = (this.registerValue(instruction.s) | this.registerValue(instruction.t));
    }
    if(instruction instanceof MipsAnd) {
      this.register[instruction.d.toString()] = (this.registerValue(instruction.s) & this.registerValue(instruction.t));
    }
    if(instruction instanceof MipsDiv) {
      this.register[this.lo] = Math.floor(this.registerValue(instruction.s) / this.registerValue(instruction.t));
      this.register[this.hi] = this.registerValue(instruction.s) & this.registerValue(instruction.t);
    }
    if(instruction instanceof MipsJ) {
      this.pc = parseInt(instruction.register);
    }
    if(instruction instanceof MipsBeq) {
      if(this.registerValue(instruction.s) == this.registerValue(instruction.t)) {
        this.pc += parseInt(instruction.label);
      }
    }
    if(instruction instanceof MipsAddi) {
      this.register[instruction.t.toString()] = this.registerValue(instruction.s) + parseInt(instruction.immediate);
    }
    if(instruction instanceof MipsJr) {
      this.pc = this.registerValue(instruction.register);
    }
    if(instruction instanceof MipsMult) {
      this.register[this.lo] = this.registerValue(instruction.s) * this.registerValue(instruction.t);
    }
    if(instruction instanceof MipsSlt) {
      this.register[instruction.d.toString()] = this.booleanToNumber(this.registerValue(instruction.s) < this.registerValue(instruction.t));
    }
    if(instruction instanceof MipsSltu) {
      this.register[instruction.d.toString()] = this.booleanToNumber(this.unsigned(this.registerValue(instruction.s)) < this.unsigned(this.registerValue(instruction.t)));
    }
    if(instruction instanceof MipsXor) {
      this.register[instruction.d.toString()] = (this.registerValue(instruction.s) ^ this.registerValue(instruction.t));
    }
    if(instruction instanceof MipsXori) {
      this.register[instruction.d.toString()] = (this.registerValue(instruction.s) ^ parseInt(instruction.i));
    }
    if(instruction instanceof MipsSw) {
      this.saveRegInMemory(this.registerValue(instruction.s), instruction.t, parseInt(instruction.i));
    }
    if(instruction instanceof MipsLw) {
      this.saveNumberInReg(this.registerValue(instruction.s), instruction.t, parseInt(instruction.i));
    }
  }

  booleanToNumber(instr) {
    if(instr) {
      return 1;
    }
    return 0;
  }

  run() {
    for(this.pc = 0; this.pc < this.block.length; this.pc++) {
      this.runInstruction(this.block[this.pc]);
    }
  }
}