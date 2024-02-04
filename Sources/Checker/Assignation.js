import Operator from "./Operator.js";
import Chomp from "./Chomp.js";
import Variable from "./Variable.js";
import Expression from "./Expression.js";
import Character from "./Character.js";
import { CompilationErrors, ErrorTypes } from "./CompilationErrors.js";

export class Assignation {
  static chomp(str, index, withEnding = true) {
    let chomper = Assignation.chompDeclaration(str, index);
    index = chomper.index;
    if(withEnding) {
      if(!Character.isAssignationEnding(str[index])) {
        return Chomp.invalid();
      }
      chomper.index++;
    }
    return chomper;
  }

  static chompDeclaration(str, index) {
    let assignerVariable = Assignation.chompInitializedVariable(str, index);
    if(assignerVariable.isInvalid()) {
      return Chomp.invalid();
    }
    index = assignerVariable.index;
    let expression = Expression.chomp(str, index);
    if(expression.isInvalid()) {
      return assignerVariable;
    }
    index = expression.index;
    let chompResponse = new Chomp('', index, Assignation, true);
    chompResponse.childrenChomps = [assignerVariable, expression];

    return chompResponse;
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

  static toString(chomp) {
    let response = '';
    response += chomp.childrenChomps[0].buffer;
    response += '=';
    response += chomp.childrenChomps[1].toString();
    response += ';';
    return response;
  }

  static findUnassignedVariables(chomp, stackDeclaration) {
    let child = chomp.childrenChomps;

    let assignerVariable = child[0];
    let expression = child[1];

    let undefinedVariables = [];

    if(!stackDeclaration.isVariableDefined(assignerVariable.buffer)) {
      undefinedVariables.push(assignerVariable.buffer);
    }
    if(undefinedVariables.length) {
      return new CompilationErrors(undefinedVariables, ErrorTypes.VARIABLE_NOT_DEFINED);
    }
    let expressionUndefinedVariables = Expression.checkStackInitialization(expression, stackDeclaration);
    if(!expressionUndefinedVariables.isClean()) {
      return expressionUndefinedVariables;
    }
    // undefinedVariables = undefinedVariables.concat(expressionUndefinedVariables);

    return CompilationErrors.clean();
  }
}