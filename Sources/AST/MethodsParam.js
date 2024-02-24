import Operator from "./Operator.js";
import Chomp from "./Chomp.js";
import Variable from "./Variable.js";
import Expression from "./Expression.js";
import Character from "./Character.js";

export class MethodParamsTypes {
  static keyWords() {
    return ['int', 'char'];
  }
}

export class MethodsParams {
  static chomp(str, index) {
    let varType = MethodsParams.chompKeywordsInitialization(str, index);
    if(varType.isInvalid()) {
      return Chomp.invalid();
    }
    index = varType.index;

    if(index >= str.length || !Character.isSeparator(str[index])) {
      return Chomp.invalid();
    }
    index++;

    let variableName = Variable.chomp(str, index);
    if(variableName.isInvalid()) {
      return Chomp.invalid();
    }
    index = variableName.index;

    let chomp = new Chomp(null, index, MethodsParams);
    chomp.childrenChomps = [varType, variableName];

    return chomp;
  }

  static chompKeywordsInitialization(str, index) {
    index = Character.pruneSpacesAndNewlines(str, index);
    let keywords = MethodParamsTypes.keyWords();
    for(let i = 0, c = keywords.length; i < c; i++) {
      if(str.indexOf(keywords[i], index) == index) {
        return new Chomp(keywords[i], index + keywords[i].length, MethodParamsTypes)
      }
    }

    return Chomp.invalid();
  }
}