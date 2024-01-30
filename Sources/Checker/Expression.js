import Operator from "./Operator.js";
import Constant from "./Constant.js";
import Chomp from "./Chomp.js";
import Variable from "./Variable.js";

class Expression {
  static isValid(str) {
    let index = [0];
    let chompsArray = [];
    if(Expression.denominator_Chomp(str, index, chompsArray).isInvalid()) {
      return false;
    }
    while(index < str.length) {
      if(Expression.operator_Chomp(str, index, chompsArray).isInvalid()) {
        return false;
      }
      if(Expression.denominator_Chomp(str, index, chompsArray).isInvalid()) {
        return false;
      }
    }
    return true;
  }

  static operator_Chomp(str, indexArray, chompsArray) {
    let chomp = Operator.chomp(str, indexArray[0]);
    if(chomp.isInvalid()) {
      return Chomp.invalid();
    }
    chompsArray.push(chomp);
    indexArray[0] = chomp.index;

    return chomp;
  }

  static denominator_Chomp(str, indexArray, chompsArray) {
    let chomp = Expression.chompDenominator(str, indexArray[0]);
    if(chomp.isInvalid()) {
      return Chomp.invalid();
    }
    chompsArray.push(chomp);
    indexArray[0] = chomp.index;

    return chomp;
  }

  static chomp(str, index) {
    let chompsArray = [];
    let chomp = Expression.chompDenominator(str, index);
    if(chomp.isInvalid()) {
      return chomp.invalid();
    }
    chompsArray.push(chomp);
    index = chomp.index;

    while(index < str.length) {
      let signChomp = Operator.chomp(str, index);
      if(signChomp.isInvalid()) {
        break;
      }
      chompsArray.push(signChomp);
      index = signChomp.index;

      chomp = Expression.chompDenominator(str, index);
      if(chomp.isInvalid()) {
        return chomp.invalid();
      }
      chompsArray.push(chomp);
      index = chomp.index;
    }
    let chompResponse = new Chomp('', index, Expression, true);
    chompResponse.childrenChomps = chompsArray;

    return chompResponse;
  }

  static chompDenominator(str, index) {
    let possibleCharacters = [Constant.chomp, Variable.chomp]
    for(let i = 0, c = possibleCharacters.length; i < c; i++) {
      let chomp = possibleCharacters[i](str, index);
      if(!chomp.isInvalid()) {
        return chomp;
      }
    }
    return Chomp.invalid();
  }
}

export default Expression;