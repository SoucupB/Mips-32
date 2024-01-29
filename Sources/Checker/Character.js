class Character {
  static isNumeric(chr) {
    return chr >= '0' && chr <= '9';
  }

  static isAlpha(char) {
    return /^[a-zA-Z]$/.test(char);
  }
}
export default Character;