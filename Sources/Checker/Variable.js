import Character from "./Character.js";
import Chomp from "./Chomp.js";

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
    if(!str || !str.length || Character.isNumeric(str[index])) {
      return Chomp.invalid();
    }

    let i = index;
    let result = "";

    while(i < str.length && (Character.isAlpha(str[i]) || Character.isNumeric(str[i]) || str[i] == '_')) {
      result += str[i++];
    }
    if(!result.length) {
      return Chomp.invalid();
    }

    return new Chomp(result, i);
  }
}

export default Variable;