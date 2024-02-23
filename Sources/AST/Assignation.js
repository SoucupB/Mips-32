import Operator from "./Operator.js";
import Chomp from "./Chomp.js";
import Variable from "./Variable.js";
import Expression from "./Expression.js";
import Character from "./Character.js";
import { CompilationErrors, ErrorTypes } from "./CompilationErrors.js";
import { Pointer } from "./Pointer.js";

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

  static chompDeclarator(str, index) {
    let pointer = Pointer.chomp(str, index);
    if(!pointer.isInvalid()) {
      return pointer;
    }

    let variable = Variable.chomp(str, index);
    if(!variable.isInvalid()) {
      return variable;
    }

    return Chomp.invalid();
  }

  static chompInitializedVariable(str, index) {
    let assigner = Assignation.chompDeclarator(str, index);
    index = assigner.index;
    let equalChomp = Operator.chompEqual(str, index);
    if(equalChomp.isInvalid()) {
      return Chomp.invalid();
    }
    index = equalChomp.index;
    
    assigner.index = index;
    return assigner;
  }

  static toString(chomp) {
    let response = '';
    const assigner = chomp.childrenChomps[0];
    switch(assigner.type) {
      case Variable: {
        response += assigner.buffer;
        break;
      }
      case Pointer: {
        response += `*${assigner.childrenChomps[0].toString()}`;
        break;
      }

      default: {
        break;
      }
    }
    response += '=';
    response += chomp.childrenChomps[1].toString();
    response += ';';
    return response;
  }

  static isAssignerDefined(assigner, stackDeclaration) {
    switch(assigner.type) {
      case Variable: {
        return stackDeclaration.isVariableDefined(assigner.buffer);
      }
      case Pointer: {
        return Expression.checkStackInitialization(assigner.childrenChomps[0], stackDeclaration);
      }
    }

    return false;
  }

  static findUnassignedVariables(chomp, stackDeclaration) {
    let child = chomp.childrenChomps;

    let assigner = child[0];
    let expression = child[1];

    let undefinedVariables = [];

    if(!Assignation.isAssignerDefined(assigner, stackDeclaration)) {
      undefinedVariables.push(assigner);
    }
    if(undefinedVariables.length) {
      return new CompilationErrors(null, ErrorTypes.VARIABLE_NOT_DEFINED);
    }
    let expressionUndefinedVariables = Expression.checkStackInitialization(expression, stackDeclaration);
    if(!expressionUndefinedVariables.isClean()) {
      return expressionUndefinedVariables;
    }

    return CompilationErrors.clean();
  }
}