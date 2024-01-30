import Operator from "./Operator.js";
import Constant from "./Constant.js";
import Chomp from "./Chomp.js";
import Character from "./Character.js";
import Variable from "./Variable.js";

class Expression {
  static isValid(str) {
    let index = 0;
    let chompsArray = [];
    let chomp = Expression.chompDenominator(str, index);
    if(chomp.isInvalid()) {
      return false;
    }
    chompsArray.push(chomp);
    index = chomp.index;
    
    while(index < str.length) {
      let signChomp = Operator.chomp(str, index);
      if(signChomp.isInvalid()) {
        return false;
      }
      chompsArray.push(signChomp);
      index = signChomp.index;

      chomp = Expression.chompDenominator(str, index);
      if(chomp.isInvalid()) {
        return false;
      }
      chompsArray.push(chomp);
      index = chomp.index;
    }
    return true;
  }

  static chompDenominator(str, index) {
    let possibleCharacters = [Constant.chomp, Variable.chomp]
    for(let i = 0, c = possibleCharacters.length; i < c; i++) {
      let chomp = possibleCharacters[i](str, index);
      if(!chomp.isInvalid()) {
        return chomp;
      }
    }
    return null;
  }
}

export default Expression;