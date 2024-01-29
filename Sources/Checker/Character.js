class Character {
  static isNumeric(chr) {
    return chr >= '0' && chr <= '9';
  }

  static isAlpha(char) {
    return /^[a-zA-Z]$/.test(char);
  }

  static isOperator(char) {
    return ['+', '-', '*', '/', '%', '=', '<', '>', '|', '^'].includes(char);
  }
}
export default Character;