import Character from "./Character.js";

class Variable {
  static isValid(str) {
    if(!str.length) {
      return false;
    }

    if(Character.isNumeric(str[0])) {
      return false;
    }

    for(let i = 0, c = str.length; i < c; i++) {
      if(!(Character.isAlpha(str[i]) || Character.isNumeric(str[i]) || str[i] == '_')) {
        return false;
      }
    }

    return true;
  }

  static chomp(str, index) {
    
  }
}

export default Variable;