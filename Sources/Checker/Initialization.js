import Operator from "./Operator.js";
import Constant from "./Constant.js";
import Chomp from "./Chomp.js";
import Variable from "./Variable.js";
import Expression from "./Expression.js";
import Character from "./Character.js";

export class Keyword {
  static keyWords() {
    return ['int', 'char'];
  }
}

export class Initialization {
  static isValid(str) {
    let index = 0;
    let keywordType = Initialization.chompDeclarationHeader(str, index);
    if(keywordType.isInvalid()) {
      return false;
    }
    index = keywordType.index;
    let assignerVariable = Initialization.chompInitializedVariable(str, index);
    if(assignerVariable.isInvalid()) {
      return false;
    }
    index = assignerVariable.index;
    let expression = Expression.chomp(str, index);
    if(expression.isInvalid()) {
      return false;
    }
    index = expression.index;
    if(!Character.isAssignationEnding(str[index])) {
      return false;
    }
    return true;
  }

  static chompDeclarationHeader(str, index) {
    let keywordType = Initialization.chompKeywordsInitialization(str, index);
    if(keywordType.isInvalid()) {
      return keywordType;
    }
    index = keywordType.index;
    if(!Character.isSeparator(str[index])) {
      return Chomp.invalid();
    }
    keywordType.index = index + 1;
    return keywordType;
  }

  static chompInitializedVariable(str, index) {
    let variable = Variable.chomp(str, index);
    if(variable.isInvalid()) {
      return Chomp.invalid();
    }
    index = variable.index;
    let equalChomp = Operator.chompEqual(str, index);
    if(equalChomp.isInvalid()) {
      return Chomp.invalid();
    }
    index = equalChomp.index;
    return new Chomp(variable.buffer, index, Variable);
  }

  static chompKeywordsInitialization(str, index) {
    let keywords = Keyword.keyWords();

    for(let i = 0, c = keywords.length; i < c; i++) {
      if(str.indexOf(keywords[i]) == 0) {
        return new Chomp(keywords[i], index + keywords[i].length, Keyword)
      }
    }

    return Chomp.invalid();
  }
}