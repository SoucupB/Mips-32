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
    delete this.registerToID[reg];
    delete this.IDToRegisters[this.registerToID[reg]];
  }
}