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

export class InitializationTuple {

}

export class Initialization {
  static isValid(str) {
    let index = 0;
    let keywordType = Initialization.chompDeclarationHeader(str, index);
    if(keywordType.isInvalid()) {
      return false;
    }
    index = keywordType.index;
    while(index < str.length) {
      let currentChomp = Initialization.chompDeclaration(str, index);
      if(currentChomp.isInvalid()) {
        break;
      }
      index = currentChomp.index;
      if(Character.isCommaSeparator(str[index])) {
        index++;
      }
    }
    if(!Character.isAssignationEnding(str[index])) {
      return false;
    }
    return true;
  }

  // Chomp.new('', index, Expression)
  static chomp(str, index) {
    let initializers = [];    
    let keywordType = Initialization.chompDeclarationHeader(str, index);
    if(keywordType.isInvalid()) {
      return Chomp.invalid();
    }
    initializers.push(keywordType)
    index = keywordType.index;
    while(index < str.length) {
      let currentChomp = Initialization.chompDeclaration(str, index);
      if(currentChomp.isInvalid()) {
        break;
      }
      initializers.push(currentChomp)
      index = currentChomp.index;
      if(Character.isCommaSeparator(str[index])) {
        index++;
      }
    }
    if(!Character.isAssignationEnding(str[index])) {
      return Chomp.invalid();
    }
    let chompResponse = new Chomp('', index, Initialization);
    chompResponse.childrenChomps = initializers;
    return chompResponse;
  }

  static chompDeclaration(str, index) {
    let assignerVariable = Initialization.chompInitializedVariable(str, index);
    if(assignerVariable.isInvalid()) {
      return Chomp.invalid();
    }
    index = assignerVariable.index;
    let expression = Expression.chomp(str, index);
    if(expression.isInvalid()) {
      return assignerVariable;
    }
    index = expression.index;
    let chompResponse = new Chomp('', index, InitializationTuple);
    chompResponse.childrenChomps = [assignerVariable, expression];

    return chompResponse;
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
      return variable;
    }
    index = equalChomp.index;
    return new Chomp(variable.buffer, index, Variable);
  }

  static chompKeywordsInitialization(str, index) {
    let keywords = Keyword.keyWords();
    for(let i = 0, c = keywords.length; i < c; i++) {
      if(str.indexOf(keywords[i]) == index) {
        return new Chomp(keywords[i], index + keywords[i].length, Keyword)
      }
    }

    return Chomp.invalid();
  }
}