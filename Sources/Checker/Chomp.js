class Chomp {
  constructor(buffer, index, type = null, isParent = false, invalid = false) {
    this.buffer = buffer;
    this.index = index;
    this.invalid = invalid;
    this.type = type;
    this.childrenChomps = [];
    this.isParent = isParent;
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
}

export default Chomp;