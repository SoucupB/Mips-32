export class RegisterMem {
  constructor() {
    this.registerToID = {};
    this.maxRegisters = 32;
    this.IDToRegisters = {};
  }

  findUnusedRegister() {
    for(let i = 0; i < this.maxRegisters; i++) {
      if(!(i in this.registerToID)) {
        return i;
      }
    }

    return null;
  }

  registerFromID(nodeID) {
    return this.IDToRegisters[nodeID];
  }

  isNodeIDUsed(nodeID) {
    if(nodeID in this.IDToRegisters) {
      return this.IDToRegisters[nodeID];
    }
    return null;
  }

  saveRegisterID(register, id) {
    this.registerToID[register] = id;
    this.IDToRegisters[id] = register;
  }

  getRegisterFromID(id) {
    return this.registerWithNodeID[id];
  }

  freeRegister(reg) {
    if(reg in this.registerToID) {
      delete this.registerToID[reg];
    }
    if(this.registerToID[reg] in this.IDToRegisters) {
      delete this.IDToRegisters[this.registerToID[reg]];
    }
  }
}