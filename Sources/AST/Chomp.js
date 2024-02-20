import { Pointer } from "./Pointer.js";

class Chomp {
  constructor(buffer, index, type = null, isParent = false, invalid = false) {
    this.buffer = buffer;
    this.index = index;
    this.invalid = invalid;
    this.type = type;
    this.childrenChomps = [];
    this.isParent = isParent;

    this.expressionTree = null;
  }

  static invalid() {
    return new Chomp(-1, -1, null, false, true);
  }

  pushChild(chomp) {
    this.childrenChomps.push(chomp);
  }

  isInvalid() {
    return this.invalid;
  }

  toString(depth = 0) {
    if(this.isParent) {
      let childParent = '';
      for(let i = 0, c = this.childrenChomps.length; i < c; i++) {
        const childString = this.childrenChomps[i].toString(depth + 1);
        childParent += childString;
      }
      if(depth) {
        return `(${childParent})`;
      }
      return childParent;
    }
    
    switch(this.type) {
      case Pointer: {
        return `*${this.childrenChomps[0].toString()}`;
      }

      default: {
        return this.buffer;
      }
    }
  }
}

export default Chomp;