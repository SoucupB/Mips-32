import Operator from "./Operator.js";
import Chomp from "./Chomp.js";
import Variable from "./Variable.js";
import Expression from "./Expression.js";
import Character from "./Character.js";
import { Helper } from "./Helper.js";
import { CompilationErrors, ErrorTypes } from "./CompilationErrors.js";

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
    let chompResponse = new Chomp('', index + 1, Initialization, true);
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
      let chompResponse = new Chomp(null, index, InitializationTuple, true);
      chompResponse.childrenChomps = [assignerVariable];

      return chompResponse;
    }
    index = expression.index;
    let chompResponse = new Chomp(null, index, InitializationTuple, true);
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
      if(str.indexOf(keywords[i], index) == index) {
        return new Chomp(keywords[i], index + keywords[i].length, Keyword)
      }
    }

    return Chomp.invalid();
  }

  static displayComponent(component) {
    let response = "";
    let componentChildren = component.childrenChomps;
    response += componentChildren[0].buffer + '=';

    for(let i = 1, c = componentChildren.length; i < c; i++) {
      if(componentChildren[i].type == Expression) {
        response += componentChildren[i].toString();
        continue;
      }
      response += componentChildren[i].buffer;
    }

    return response;
  }

  static display(chomp) {
    if(chomp.isInvalid()) {
      return "Invalid!";
    }
    let response = [];
    response.push(chomp.childrenChomps[0].buffer);
    let children = chomp.childrenChomps;

    for(let i = 1, c = children.length; i < c; i++) {
      response.push(Initialization.displayComponent(children[i]));
    }
    return response.join(' -> ');
  }

  static initializeVariable(initializationChomp, stackDeclaration) {
    let inits = Helper.searchChompByType(initializationChomp, {
      type: Variable
    });

    for(let i = 0, c = inits.length; i < c; i++) {
      stackDeclaration.push(inits[i].buffer);
    }
  }
  
  static hasVariableAlreadyBeenDefined(chomp, stackDeclaration) {
    let variables = Helper.searchChompByType(chomp, {
      type: Variable
    });

    for(let i = 0, c = variables.length; i < c; i++) {
      if(stackDeclaration.isVariableDefined(variables[i].buffer)) {
        return true;
      }
    }
    return false;
  }

  static addToStackAndVerify(chomp, stackDeclaration) {
    let allInitializedTuples = Helper.searchChompByType(chomp, {
      type: InitializationTuple
    });
    // child 0, is the initializer, child 1 is the expression.
    for(let i = 0, c = allInitializedTuples.length; i < c; i++) {
      let initChildren = allInitializedTuples[i].childrenChomps;
      let variableToBeInitialized = initChildren[0];

      if(Initialization.hasVariableAlreadyBeenDefined(variableToBeInitialized, stackDeclaration)) {
        return new CompilationErrors([variableToBeInitialized.buffer], ErrorTypes.VARIABLE_MULTIPLE_DEFINITION);
      }

      Initialization.initializeVariable(variableToBeInitialized, stackDeclaration);

      // when the variable insertion has an expression
      if(initChildren.length > 1) {
        let expression = initChildren[1];
        let errors = Expression.checkStackInitialization(expression, stackDeclaration);
        if(!errors.isClean()) {
          return errors;
        }
      }
    }
    return CompilationErrors.clean();
  }
}