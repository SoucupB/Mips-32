class Chomp {
  constructor(buffer, index, type, invalid = false) {
    this.buffer = buffer;
    this.index = index;
    this.invalid = invalid;
    this.type = type;
  }

  static invalid() {
    return new Chomp(-1, -1, null, true);
  }

  isInvalid() {
    return this.invalid;
  }
}

export default Chomp;