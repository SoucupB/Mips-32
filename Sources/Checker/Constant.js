import Character from "./Character.js";
import Chomp from "./Chomp.js";

class Constant {
  static isValid(str) {
    for(let i = 0, c = str.length; i < c; i++) {
      if(!Character.isNumeric(str[i])) {
        return false;
      }
    }
    return true;
  }

  static chomp(str, index) {
    if(!str || !str.length) {
      return Chomp.invalid();
    }

    let i = index;
    let result = "";

    while(i < str.length && Character.isNumeric(str[i])) {
      result += str[i++];
    }
    if(!result.length) {
      return Chomp.invalid();
    }

    return new Chomp(result, i, Constant);
  }
}

export default Constant;