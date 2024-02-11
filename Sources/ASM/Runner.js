import { Add, Div, Jmp, JmpTypes, Label, Mov, MovTypes, Mul, Pop, Prp, Push, Register, RegisterBlock, Sub } from './Register.js';

export class Runner {
  constructor(instructionArray) {
    this.instructionArray = instructionArray;
    this.register = {};
    this.initialStackPointer = 1024 * 1024 * 2;
    this.stackPointer = this.initialStackPointer;
    this.memory = new Array(1024 * 1024 * 24).fill(0);
    this.addresses = {};

    this.pc = 0;
    this.saveLabelAddresses();
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

  saveStackInReg(memPointer, reg) {
    let memoryStack = this.stackPointer - parseInt(memPointer)
    let number = this.memory[memoryStack] + 
                 this.memory[memoryStack + 1] * 256 + 
                 this.memory[memoryStack + 2] * 256 * 256 + 
                 this.memory[memoryStack + 3] * 256 * 256 * 256;
    this.register[reg] = number;
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

  runJump(instruction) {
    switch(instruction.type) {
      case JmpTypes.LABEL: {
        this.pc = this.addresses[instruction.value]
        break;
      }
      case JmpTypes.REGISTER: {
        this.pc = this.getRegValue(instruction.value) - 1
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
  }

  run() {
    for(this.pc = 0; this.pc < this.instructionArray.length; this.pc++) {
      this.runInstruction(this.instructionArray[this.pc]);
    }
  }
}