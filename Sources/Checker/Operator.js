import Character from "./Character.js";

class Operator {
  static isValid(str) {
    if(!str || !str.length) {
      return false;
    }
    return Character.isOperator(str[0]) || str == '==' || str == '!=' || str == '||' || str == '&&';
  }
}

export default Operator;