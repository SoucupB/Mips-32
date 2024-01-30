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
      if(!Expression.chompParanthesisData(str, index, chompsArray)) {
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
    let newIndex = [index];
    let chompsArray = [];
    if(Expression.denominator_Chomp(str, newIndex, chompsArray).isInvalid()) {
      return false;
    }
    while(newIndex < str.length) {
      if(Expression.operator_Chomp(str, newIndex, chompsArray).isInvalid()) {
        return false;
      }
      if(!Expression.chompParanthesisData(str, newIndex, chompsArray)) {
        return Chomp.invalid();
      }
      if(Expression.denominator_Chomp(str, newIndex, chompsArray).isInvalid()) {
        return Chomp.invalid();
      }
    }
    let chompResponse = new Chomp('', newIndex[0], Expression, true);
    chompResponse.childrenChomps = chompsArray;

    return chompResponse;
  }

  static chompParanthesisData(str, index, chompsArray) {
    if(Operator.chompOpenParanth(str, index[0]).isInvalid()) {
      return true;
    }
    let chomp = Operator.chomp(str, index[0]);
    if(chomp.isInvalid()) {
      return false;
    }
    index[0] = chomp.index;
    chompsArray.push(chomp);
    if(Operator.chompCloseParanth(str, index[0]).isInvalid()) {
      return false;
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
    return Chomp.invalid();
  }
}

export default Expression;