import Operator from "./Operator.js";
import Chomp from "./Chomp.js";
import { Assignation } from "./Assignation.js";
import { Initialization } from "./Initialization.js";
import { LoopBlocks } from "./LoopBlocks.js";
import { ConditionalBlocks } from "./ConditionalBlocks.js";
import { StackDeclarations } from "./StackDeclarations.js";
import { ReturnMethod } from "./Methods.js";

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
    let responseChomp = new Chomp(null, index + 1, CodeBlock);
    responseChomp.childrenChomps = blockList.childrenChomps;
    return responseChomp;
  }

  static chompBlock(str, index, withReturnStatement) {
    let availableBlocks = [Assignation.chomp, Initialization.chomp, CodeBlock.chomp, LoopBlocks.chomp, ConditionalBlocks.chomp];
    if(withReturnStatement) {
      availableBlocks.push(ReturnMethod.chomp);
    }
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
          if(response.length) {
            return [response, []]
          }
          break;
        }
        case Initialization: {
          let response = Initialization.addToStackAndVerify(currentChild, stackDeclaration);
          // If there are either undefined or multiple definitions.
          if(response[0].length || response[1].length) {
            return response;
          }
          break;
        }
        case CodeBlock: {
          let codeBlockResponse = CodeBlock.addToStackAndVerify(currentChild, stackDeclaration);
          if(codeBlockResponse[0].length || codeBlockResponse[1].length) {
            return codeBlockResponse;
          }
          break;
        }
        case LoopBlocks: {
          let loopBlocks = LoopBlocks.addToStackAndVerify(currentChild, stackDeclaration);
          if(loopBlocks[0].length || loopBlocks[1].length) {
            return loopBlocks;
          }
          break;
        }
        case ConditionalBlocks: {
          let conditionalBlock = ConditionalBlocks.addToStackAndVerify(currentChild, stackDeclaration);
          if(conditionalBlock[0].length || conditionalBlock[1].length) {
            return conditionalBlock;
          }
          break;
        }

        default: {
          break;
        }
      }
    }

    return [[], []]
  }

  static addToStackAndVerify(chomp, stackDeclaration) {
    stackDeclaration.freeze();
    let response = CodeBlock.addToStackAndVerify_t(chomp, stackDeclaration);
    stackDeclaration.pop();
    return response;
  }
}