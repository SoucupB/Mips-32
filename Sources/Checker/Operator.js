import Character from "./Character.js";
import Chomp from "./Chomp.js";

class Operator {
  static isValid(str) {
    if(!str || !str.length) {
      return false;
    }
    return Character.isOperator(str[0]) || str == '==' || str == '!=' || str == '||' || str == '&&';
  }

  static chomp(str, index) {
    if(!str || !str.length) {
      return Chomp.invalid();
    }

    let i = index;
    if(str.length - i >= 2) {
      let specialCharactersArray = ['==', '!=', '||', '&&']
      for(let j = 0, c = specialCharactersArray.length; j < c; j++) {
        if(`${str[i]}${str[i + 1]}` == specialCharactersArray[j]) {
          return new Chomp(specialCharactersArray[j], i + 2);
        }
      }
    }

    if(Character.isOperator(str[i])) {
      return new Chomp(str[i], i + 1);
    }

    return Chomp.invalid();
  }
}

export default Operator;