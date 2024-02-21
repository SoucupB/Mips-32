import { Add, Cmp, Div, Jmp, JmpTypes, Jz, Label, Mov, MovTypes, Mul, Pop, Prp, Push, Register, RegisterBlock, Sete, Setge, Setle, Setne, Setnz, Sub, Test, Print, PrintTypes, Or, Setdor } from './Register.js';

export const ReadMemoryType = {
  INT32: 1,
  INT8: 2
};

let stddoutOutputBuffer = 2 ** 16;

export class Runner {
  constructor(instructionArray) {
    this.instructionArray = instructionArray;
    this.register = {};
    this.initialStackPointer = 1024 * 1024 * 2;
    this.stackPointer = this.initialStackPointer;
    this.memory = new Array(1024 * 1024 * 24).fill(0);
    this.addresses = {};

    this.outputBuffer = '' // temorary method;

    this.pc = 0;
    this.saveLabelAddresses();
  }

  getStdoutResponse() {
    const bufferSize = this.getNumberAtAddress(this.memory, stddoutOutputBuffer - 4);

    let response = [];
    for(let i = 0, c = bufferSize; i < c; i += 4) {
      response.push(this.getNumberAtAddress(this.memory, stddoutOutputBuffer + i));
    }

    return response.join('\n');
  }

  saveRegValue(dst, src) {
    if(src.toString() in this.register) {
      this.register[dst.toString()] = this.register[src.toString()];
      return ;
    }
  }

  saveLabelAddresses() {
    for(let i = 0, c = this.instructionArray.length; i < c; i++) {
      const instruction = this.instructionArray[i];
      if(instruction instanceof Label) {
        this.addresses[instruction.label] = i;
      }
    }
  }

  currentStackPointer() {
    return this.stackPointer;
  }

  getRegValue(reg) {
    if(reg.toString() in this.register) {
      return parseInt(this.register[reg.toString()]);
    }
    return 0;
  }

  printPointerBytes(nrOfBytes) {
    let response = [];
    for(let i = 0; i < nrOfBytes; i++) {
      response.push(this.memory[this.stackPointer + i]);
    }

    return response.join(' ');
  }

  positiveNumberToByteArray(number) {
    const byteArray = new Array(4).fill(0);
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

  saveMemInReg(memPointer, reg) {
    this.register[reg.toString()] = this.getNumberAtAddress(this.memory, parseInt(memPointer));
  }

  saveStackInReg(memPointer, reg) {
    this.register[reg] = this.getNumberAtAddress(this.memory, this.stackPointer - parseInt(memPointer));
  }

  saveRegMemInReg(regSrc, regDst) {
    this.register[regDst] = this.getNumberAtAddress(this.memory, parseInt(this.register[regSrc.toString()]));
  }

  saveRegInMemReg(regSrc, regDst) {
    let numberFromReg = this.numberToByteArray(this.getRegValue(regSrc));

    let pointer = this.getRegValue(regDst);

    for(let i = 0, c = numberFromReg.length; i < c; i++) {
      this.memory[pointer + i] = numberFromReg[i];
    }
  }

  numberFromPointer(pointer) {
    return this.getNumberAtAddress(this.memory, pointer);
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
      case MovTypes.STACK_TO_REG: {
        this.saveStackInReg(instruction.src, instruction.dst);
        break;
      }
      case MovTypes.REG_MEM_TO_REG: {
        this.saveRegMemInReg(instruction.src, instruction.dst);
      }
      case MovTypes.REG_TO_MEM_REG: {
        this.saveRegInMemReg(instruction.src, instruction.dst);
      }
      default: {
        break;
      }
    }
  }

  runPush(instruction) {
    this.saveRegInStack(0, instruction.register);
    this.stackPointer += 4;
  }

  runPop(instruction) {
    this.stackPointer -= parseInt(instruction.bytes);
  }

  jumpAtRegisterLabel(label) {
    this.pc = this.getRegValue(label) - 1
  }

  runJump(instruction) {
    switch(instruction.type) {
      case JmpTypes.LABEL: {
        this.pc = this.addresses[instruction.value]
        break;
      }
      case JmpTypes.REGISTER: {
        this.jumpAtRegisterLabel(instruction.value)
        break;
      }

      default: {
        break;
      }
    }
  }

  runAdd(instruction) {
    this.register[instruction.dst.toString()] = this.getRegValue(instruction.b) + this.getRegValue(instruction.c);
  }

  runMul(instruction) {
    this.register[instruction.dst.toString()] = this.getRegValue(instruction.b) * this.getRegValue(instruction.c);
  }

  runSub(instruction) {
    this.register[instruction.dst.toString()] = this.getRegValue(instruction.b) - this.getRegValue(instruction.c);
  }

  runMul(instruction) {
    this.register[instruction.dst.toString()] = this.getRegValue(instruction.b) * this.getRegValue(instruction.c);
  }

  runDivAndMod(instruction) {
    this.register['HI'] = Math.floor(this.getRegValue(instruction.a) / this.getRegValue(instruction.b));
    this.register['LO'] = this.getRegValue(instruction.a) % this.getRegValue(instruction.b);
  }

  runPrp(instruction) {
    this.register[instruction.reg.toString()] = this.pc + instruction.offset;
  }

  booleanToNumber(instr) {
    if(instr) {
      return 1;
    }
    return 0;
  }

  runCmp(instruction) {
    this.register['_setGe'] = this.booleanToNumber(this.getRegValue(instruction.regA) >= this.getRegValue(instruction.regB));
    this.register['_setE'] = this.booleanToNumber(this.getRegValue(instruction.regA) == this.getRegValue(instruction.regB));
    this.register['_setNe'] = this.booleanToNumber(this.getRegValue(instruction.regA) != this.getRegValue(instruction.regB));
    this.register['_setLe'] = this.booleanToNumber(this.getRegValue(instruction.regA) <= this.getRegValue(instruction.regB));
    this.register['CF'] = this.booleanToNumber(this.getRegValue(instruction.regA) < this.getRegValue(instruction.regB));
    this.register['CT'] = this.booleanToNumber(this.getRegValue(instruction.regA) > this.getRegValue(instruction.regB));
  }

  setGe(instruction) {
    this.register[instruction.regA.toString()] = this.register['_setGe'];
  }

  setE(instruction) {
    this.register[instruction.regA.toString()] = this.register['_setE'];
  }
  
  setNe(instruction) {
    this.register[instruction.regA.toString()] = this.register['_setNe'];
  }
  
  setNz(instruction) {
    this.register[instruction.regA.toString()] = !this.booleanToNumber(this.register[instruction.regA.toString()]);
  }

  setLe(instruction) {
    this.register[instruction.regA.toString()] = this.register['_setLe'];
  }

  setTest(instruction) {
    this.register['zero_reg'] = this.booleanToNumber(this.getRegValue(instruction.regA) && this.getRegValue(instruction.regB));
  }

  setJz(instruction) {
    if('zero_reg' in this.register && !this.register['zero_reg']) {
      this.pc = this.addresses[instruction.label]
    }
  }

  setOr(instruction) {
    this.register['or_reg'] = this.booleanToNumber(this.getRegValue(instruction.regA) || this.getRegValue(instruction.regB))
  }

  setDor(instruction) {
    this.register[instruction.reg.toString()] = this.register['or_reg'];
  }

  setPrint(instruction) {
    switch(instruction.type) {
      case PrintTypes.REGISTER: {
        this.outputBuffer += this.getRegValue(instruction.value);
        break;
      }
      case PrintTypes.MEMORY: {
        this.outputBuffer += this.numberFromPointer(parseInt(instruction.value) + this.initialStackPointer);
        break;
      }

      default: {
        break;
      }
    }
  }

  runInstruction(instruction) {
    if(instruction instanceof Mov) {
      this.runMov(instruction);
    }
    if(instruction instanceof Push) {
      this.runPush(instruction);
    }
    if(instruction instanceof Pop) {
      this.runPop(instruction);
    }
    if(instruction instanceof Jmp) {
      this.runJump(instruction);
    }
    if(instruction instanceof Add) {
      this.runAdd(instruction);
    }
    if(instruction instanceof Div) {
      this.runDivAndMod(instruction);
    }
    if(instruction instanceof Sub) {
      this.runSub(instruction);
    }
    if(instruction instanceof Mul) {
      this.runMul(instruction);
    }
    if(instruction instanceof Prp) {
      this.runPrp(instruction);
    }
    if(instruction instanceof Cmp) {
      this.runCmp(instruction);
    }

    if(instruction instanceof Setge) {
      this.setGe(instruction);
    }
    if(instruction instanceof Sete) {
      this.setE(instruction);
    }
    if(instruction instanceof Setne) {
      this.setNe(instruction);
    }
    if(instruction instanceof Setnz) {
      this.setNz(instruction);
    }
    if(instruction instanceof Setle) {
      this.setLe(instruction);
    }

    if(instruction instanceof Test) {
      this.setTest(instruction)
    }
    if(instruction instanceof Jz) {
      this.setJz(instruction)
    }
    if(instruction instanceof Print) {
      this.setPrint(instruction)
    }
    if(instruction instanceof Or) {
      this.setOr(instruction)
    }
    if(instruction instanceof Setdor) {
      this.setDor(instruction)
    }
  }

  getOutputBuffer() {
    return this.outputBuffer;
  }

  run() {
    for(this.pc = 0; this.pc < this.instructionArray.length; this.pc++) {
      this.runInstruction(this.instructionArray[this.pc]);
    }
  }
}