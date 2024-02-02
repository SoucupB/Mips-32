import Operator from "./Operator.js";
import Constant from "./Constant.js";
import Chomp from "./Chomp.js";
import Variable from "./Variable.js";
import { Methods } from "./Methods.js";

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
      let newIndex = [indexArray[0]]
      let denomitorChomp = Expression.chomp_ParanthesisData(str, newIndex, chompsArray);
      if(!denomitorChomp.isInvalid()) {
        chompsArray.push(denomitorChomp);
        indexArray[0] = denomitorChomp.index;
      }
      return denomitorChomp;
    }
    chompsArray.push(chomp);
    indexArray[0] = chomp.index;

    return chomp;
  }

  static chompFromArray(chompsArray, newIndex) {
    let chompResponse = new Chomp('', newIndex[0], Expression, true);
    chompResponse.childrenChomps = chompsArray;

    return chompResponse;
  }

  static chompSearch_t(str, index) {
    let newIndex = [index];
    let chompsArray = [];
    if(Expression.denominator_Chomp(str, newIndex, chompsArray).isInvalid()) {
      return Chomp.invalid();
    }
    while(newIndex < str.length) {
      if(Expression.operator_Chomp(str, newIndex, chompsArray).isInvalid()) {
        return Expression.chompFromArray(chompsArray, newIndex);
      }
      if(Expression.denominator_Chomp(str, newIndex, chompsArray).isInvalid()) {
        return Chomp.invalid();
      }
    }
    return Expression.chompFromArray(chompsArray, newIndex);
  }

  static chomp(str, index) {
    for(let i = str.length - 1; i >= index; i--) {
      let chomp = Expression.chompSearch_t(str.substring(index, i + 1), 0);
      if(!chomp.isInvalid()) {
        chomp.index += index;
        return chomp;
      }
    }
    return Chomp.invalid();
  }

  static chomp_ParanthesisData(str, index) {
    let chompOpenParanth = Operator.chompOpenParanth(str, index[0]);
    if(chompOpenParanth.isInvalid()) {
      return Chomp.invalid();
    }
    index[0] = chompOpenParanth.index;
    let chomp = Expression.chompSearch_t(str, index[0]);
    if(chomp.isInvalid()) {
      return Chomp.invalid();
    }
    index[0] = chomp.index;
    let chompCloseParanth = Operator.chompCloseParanth(str, index[0]);
    if(chompCloseParanth.isInvalid()) {
      return Chomp.invalid();
    }
    index[0] = chompCloseParanth.index;
    return Expression.chompFromArray(chomp.childrenChomps, index);
  }

  static chompDenominator(str, index) {
    let possibleCharacters = [Methods.chompMethodCall, Constant.chomp, Variable.chomp]
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