export class RegisterMem {
  constructor() {
    this.registerMem = {};
    this.maxRegisters = 32;
  }

  findUnusedRegister() {
    for(let i = 0; i < this.maxRegisters; i++) {
      if(!(i in this.registerMem)) {
        return i;
      }
    }

    return null;
  }

  freeRegister(reg) {
    delete this.registerMem[reg];
  }
}