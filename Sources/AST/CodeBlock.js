import Operator from "./Operator.js";
import Chomp from "./Chomp.js";
import { Assignation } from "./Assignation.js";
import { Initialization } from "./Initialization.js";
import { LoopBlocks } from "./LoopBlocks.js";
import { ConditionalBlocks } from "./ConditionalBlocks.js";
import { ReturnMethod } from "./Methods.js";
import Expression from "./Expression.js";
import Character from "./Character.js";
import { CompilationErrors, ErrorTypes } from "./CompilationErrors.js";

export class CodeBlock {
  // [0] -> assignation/init/while/for/if, [1] -> assignation/init/while/for/if, .... 

  static chomp(str, index, withReturnStatement = false) {
    let openBracket = Operator.chompOpenBracket(str, index);
    if(openBracket.isInvalid()) {
      return Chomp.invalid();
    }
    index = openBracket.index;
    let blockList = CodeBlock.chompBlock(str, index, withReturnStatement);
    index = blockList.index;
    let closedBracket = Operator.chompCloseBracket(str, index);
    if(closedBracket.isInvalid()) {
      return Chomp.invalid();
    }
    index = closedBracket.index;
    let responseChomp = new Chomp(null, index, CodeBlock);
    responseChomp.childrenChomps = blockList.childrenChomps;
    return responseChomp;
  }

  static expressionChompWithLineTerminator(str, index) {
    let expression = Expression.chomp(str, index);
    if(expression.isInvalid()) {
      return Chomp.invalid();
    }
    index = expression.index;

    if(index >= str.index || !Character.isAssignationEnding(str[index])) {
      return Chomp.invalid();
    }
    expression.index++;

    return expression;
  }

  static chompBlock(str, index, withReturnStatement) {
    let availableBlocks = [Assignation.chomp, Initialization.chomp, (str, index) => CodeBlock.chomp(str, index, withReturnStatement), 
                           (str, index) => LoopBlocks.chomp(str, index, withReturnStatement), (str, index) => ConditionalBlocks.chomp(str, index, withReturnStatement)];
    if(withReturnStatement) {
      availableBlocks.push(ReturnMethod.chomp);
    }
    availableBlocks.push(CodeBlock.expressionChompWithLineTerminator);
    let responseBlocks = [];
    while(index < str.length) {
      let hasLineBeenProcessed = false;
      for(let i = 0; i < availableBlocks.length; i++) {
        let chomp = availableBlocks[i](str, index);
        if(!chomp.isInvalid()) {
          index = chomp.index;
          hasLineBeenProcessed = true;
          responseBlocks.push(chomp);
          break;
        }
      }
      if(!hasLineBeenProcessed) {
        break;
      }
    }

    let responseChomp = new Chomp(null, index, CodeBlock);
    responseChomp.childrenChomps = responseBlocks;
    return responseChomp;
  }

  static addToStackAndVerify_t(chomp, stackDeclaration) {
    let children = chomp.childrenChomps;
    for(let i = 0, c = children.length; i < c; i++) {
      let currentChild = children[i];
      switch(currentChild.type) {
        case Assignation: {
          let response = Assignation.findUnassignedVariables(currentChild, stackDeclaration);
          if(!response.isClean()) {
            return response;
          }
          break;
        }
        case Initialization: {
          let response = Initialization.addToStackAndVerify(currentChild, stackDeclaration);
          // If there are either undefined or multiple definitions.
          if(!response.isClean()) {
            return response;
          }
          break;
        }
        case CodeBlock: {
          let codeBlockResponse = CodeBlock.addToStackAndVerify(currentChild, stackDeclaration);
          if(!codeBlockResponse.isClean()) {
            return codeBlockResponse;
          }
          break;
        }
        case LoopBlocks: {
          let loopBlocks = LoopBlocks.addToStackAndVerify(currentChild, stackDeclaration);
          if(!loopBlocks.isClean()) {
            return loopBlocks;
          }
          break;
        }
        case ConditionalBlocks: {
          let conditionalBlock = ConditionalBlocks.addToStackAndVerify(currentChild, stackDeclaration);
          if(!conditionalBlock.isClean()) {
            return conditionalBlock;
          }
          break;
        }
        case ReturnMethod: {
          let returnBlocks = ReturnMethod.addToStackAndVerify(currentChild, stackDeclaration);
          if(!returnBlocks.isClean()) {
            return returnBlocks;
          }
          break;
        }
        case Expression: {
          let expressionUndefinedVariables = Expression.checkStackInitialization(currentChild, stackDeclaration);
          if(!expressionUndefinedVariables.isClean()) {
            return expressionUndefinedVariables;
          }
          break;
        }

        default: {
          break;
        }
      }
    }

    return CompilationErrors.clean();
  }

  static addToStackAndVerify(chomp, stackDeclaration) {
    stackDeclaration.freeze();
    let response = CodeBlock.addToStackAndVerify_t(chomp, stackDeclaration);
    stackDeclaration.pop();
    return response;
  }
}