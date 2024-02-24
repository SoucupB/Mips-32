class Character {
  static isNumeric(chr) {
    return chr >= '0' && chr <= '9';
  }

  static isAlpha(char) {
    return /^[a-zA-Z]$/.test(char);
  }

  static isOperator(char) {
    return ['+', '-', '*', '/', '%', '<', '>', '|', '^', '&'].includes(char);
  }

  static isSeparator(char) {
    return char == ' ';
  }

  static isCommaSeparator(char) {
    return char == ',';
  }

  static isAssignationEnding(char) {
    return char == ';';
  }

  static pruneSpacesAndNewlines(str, index) {
    while(index < str.length && Character.isEmptySpaceOrNewLine(str[index])) {
      index++;
    }

    return index;
  }

  static isEmptySpaceOrNewLine(chr) {
    return chr == ' ' || chr == '\n' || chr == '\t' || chr == '\t\n';
  }
}
export default Character;