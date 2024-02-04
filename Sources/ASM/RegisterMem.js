export class RegisterMem {
  constructor() {
    this.registerMem = {};
    this.maxRegisters = 32;
    this.registerWithNodeID = {};
  }

  findUnusedRegister() {
    for(let i = 0; i < this.maxRegisters; i++) {
      if(!(i in this.registerMem)) {
        return i;
      }
    }

    return null;
  }

  saveRegisterID(register, id) {
    this.registerWithNodeID[id] = register;
  }

  getRegisterFromID(id) {
    return this.registerWithNodeID[id];
  }

  freeRegister(reg) {
    delete this.registerMem[reg];
  }
}