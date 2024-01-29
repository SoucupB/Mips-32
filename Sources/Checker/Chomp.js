class Chomp {
  constructor(buffer, index, invalid = false) {
    this.buffer = buffer;
    this.index = index;
    this.invalid = invalid;
  }

  static invalid() {
    return new Chomp(-1, -1, true);
  }

  isInvalid() {
    return this.invalid;
  }
}

export default Chomp;