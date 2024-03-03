import Character from "./Character.js";
import Chomp from "./Chomp.js";
import Expression from "./Expression.js";
import { Variable } from "./Variable.js";

export class Pointer {
  static chomp(str, index) {
    if(!str || index >= str.length) {
      return Chomp.invalid();
    }

    index = Character.pruneSpacesAndNewlines(str, index);
    if(str[index] != '*') {
      return Chomp.invalid();
    }
    index++;

    let variableChomp = Variable.chomp(str, index);
    if(!variableChomp.isInvalid()) {
      index = variableChomp.index;
      let currentChomp = new Chomp(null, index, Pointer);
      currentChomp.childrenChomps = [Expression.chomp(variableChomp.buffer, 0)];
      return currentChomp;
    }

    let paranthesysExpressionChomp = Expression.chomp_ParanthesisData(str, index);
    if(paranthesysExpressionChomp.isInvalid()) {
      return Chomp.invalid();
    }
    index = paranthesysExpressionChomp.index;

    let currentChomp = new Chomp(null, index, Pointer);
    currentChomp.childrenChomps = [paranthesysExpressionChomp];
    return currentChomp;
  }

  static findUnassignedVariables(chomp, stackDeclaration) {
    const expression = chomp.childrenChomps[0];
    return Expression.checkStackInitialization(expression, stackDeclaration);
  }
}