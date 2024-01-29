import Character from "./Character.js";

class Constant {
  static isValid(str) {
    for(let i = 0, c = str.length; i < c; i++) {
      if(!Character.isNumeric(str[i])) {
        return false;
      }
    }
    return true;
  }
}

export default Constant;