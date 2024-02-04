import Operator from "./Operator.js";
import Chomp from "./Chomp.js";
import { CodeBlock } from "./CodeBlock.js";
import Expression from "./Expression.js";
import { Assignation } from "./Assignation.js";
import { Initialization } from "./Initialization.js";
import Character from "./Character.js";
import { CompilationErrors, ErrorTypes } from "./CompilationErrors.js";

export class LoopKeywords {
  static keyWords() {
    return ['while', 'for'];
  }
}

export class LoopBlocks {
  static chomp(str, index, withReturnStatement = false) {
    let loopBlock = LoopBlocks.chompKeywordsInitialization(str, index);
    if(loopBlock.isInvalid()) {
      return Chomp.invalid();
    }
    index = loopBlock.index;
    if(loopBlock.buffer == 'while') {
      return LoopBlocks.chompWhileBlock(str, index, withReturnStatement);
    }
    if(loopBlock.buffer == 'for') {
      return LoopBlocks.chompForBlock(str, index, withReturnStatement);
    }

    return Chomp.invalid();
  }

  static chompKeywordsInitialization(str, index) {
    let keywords = LoopKeywords.keyWords();
    for(let i = 0, c = keywords.length; i < c; i++) {
      if(str.indexOf(keywords[i], index) == index) {
        return new Chomp(keywords[i], index + keywords[i].length, LoopKeywords)
      }
    }

    return Chomp.invalid();
  }

  static chompWhileBlock(str, index, withReturnStatement) {
    let openParanth = Operator.chompOpenParanth(str, index);
    if(openParanth.isInvalid()) {
      return Chomp.invalid();
    }
    index = openParanth.index;
    let expressionChecker = Expression.chomp(str, index);
    if(expressionChecker.isInvalid()) {
      return Chomp.invalid();
    }
    index = expressionChecker.index;
    let closeParanth = Operator.chompCloseParanth(str, index);
    if(closeParanth.isInvalid()) {
      return Chomp.invalid();
    }
    index = closeParanth.index;

    let blockChomp = CodeBlock.chomp(str, index, withReturnStatement);
    if(blockChomp.isInvalid()) {
      return Chomp.invalid();
    }
    index = blockChomp.index;

    let loopChomp = new Chomp('while', index, LoopBlocks);
    loopChomp.childrenChomps = [expressionChecker, blockChomp];

    return loopChomp;
  }

  static chompForBlock(str, index, withReturnStatement) {
    let openParanth = Operator.chompOpenParanth(str, index);
    if(openParanth.isInvalid()) {
      return Chomp.invalid();
    }
    index = openParanth.index;

    let firstPart = LoopBlocks.chompForInitialization(str, index);
    if(firstPart.isInvalid()) {
      return Chomp.invalid();
    }
    index = firstPart.index;

    let middlePart = Expression.chomp(str, index);
    if(middlePart.isInvalid()) {
      return Chomp.invalid();
    }
    index = middlePart.index;

    if(index >= str.length || !Character.isAssignationEnding(str[index])) {
      return Chomp.invalid();
    }
    index++;

    let lastPart = Assignation.chomp(str, index, false);
    if(lastPart.isInvalid()) {
      return Chomp.invalid();
    } 
    index = lastPart.index;

    let closeParanth = Operator.chompCloseParanth(str, index);
    if(closeParanth.isInvalid()) {
      return Chomp.invalid();
    }
    index = closeParanth.index;

    let blockChomp = CodeBlock.chomp(str, index, withReturnStatement);
    if(blockChomp.isInvalid()) {
      return Chomp.invalid();
    }
    index = blockChomp.index;

    let loopChomp = new Chomp('for', index, LoopBlocks);
    loopChomp.childrenChomps = [firstPart, middlePart, lastPart, blockChomp];

    return loopChomp;
  }

  static chompForInitialization(str, index) {
    let chompMethods = [Assignation.chomp, Initialization.chomp];
    for(let i = 0; i < chompMethods.length; i++) {
      let chompValue = chompMethods[i](str, index);
      if(!chompValue.isInvalid()) {
        return chompValue;
      }
    }
    return Chomp.invalid();
  }

  static addToStackAndVerify_While(chomp, stackDeclaration) {
    const children = chomp.childrenChomps;

    let expression = children[0];
    let expressionUndefinedVariables = Expression.checkStackInitialization(expression, stackDeclaration);
    if(!expressionUndefinedVariables.isClean()) {
      return expressionUndefinedVariables;
    }
    if(children.length < 2) {
      return CompilationErrors.clean();
    }
    let block = children[1];
    return CodeBlock.addToStackAndVerify(block, stackDeclaration);
  }

  static addToStackAndVerify_For(chomp, stackDeclaration) {
    const children = chomp.childrenChomps;

    let startingCondition = children[0];
    let testingCondition = children[1];
    let stateChange = children[2];

    switch(startingCondition.type) {
      case Assignation: {
        let assignationVariableErrors = Assignation.findUnassignedVariables(startingCondition, stackDeclaration);
        if(!assignationVariableErrors.isClean()) {
          return assignationVariableErrors
        }
        break;
      }
      case Initialization: {
        let initializationVariableErrors = Initialization.addToStackAndVerify(startingCondition, stackDeclaration);
        if(!initializationVariableErrors.isClean()) {
          return initializationVariableErrors;
        }
        // if(initializationVariableErrors[0].length || initializationVariableErrors[1].length) {
        //   return initializationVariableErrors;
        // }
        break;
      }
      default: {
        break;
      }
    }

    const testingConditionStackDeclaration = Expression.checkStackInitialization(testingCondition, stackDeclaration);
    if(!testingConditionStackDeclaration.isClean()) {
      return testingConditionStackDeclaration;
    }
    // if(testingConditionStackDeclaration.length) {
    //   return [testingConditionStackDeclaration, []];
    // }

    const stateChangeStackDeclaration = Expression.checkStackInitialization(stateChange, stackDeclaration);
    // if(stateChangeStackDeclaration.length) {
    //   return [stateChangeStackDeclaration, []];
    // }
    if(!stateChangeStackDeclaration.isClean()) {
      return stateChangeStackDeclaration;
    }
    // No condition
    if(children.length <= 3) {
      return CompilationErrors.clean();
    }
    const block = children[3];
    
    return CodeBlock.addToStackAndVerify(block, stackDeclaration);
  }

  static addToStackAndVerify(chomp, stackDeclaration) {
    switch(chomp.buffer) {
      case 'while': {
        return LoopBlocks.addToStackAndVerify_While(chomp, stackDeclaration);
      }
      case 'for': {
        stackDeclaration.freeze();
        let variableErrors = LoopBlocks.addToStackAndVerify_For(chomp, stackDeclaration);
        stackDeclaration.pop();
        return variableErrors;
      }
      default: {
        break;
      }
    }

    return CompilationErrors.clean();
  }
}